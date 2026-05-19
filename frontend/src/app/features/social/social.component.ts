import { Component, OnInit, inject, signal, DestroyRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SocialService, SocialProfile, SocialNotification } from '../../core/services/social.service';
import { NotificationService } from '../../core/services/notification.service';
import { ToastService } from '../../core/services/toast.service';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    AvatarComponent
  ],
  templateUrl: './social.component.html',
  styleUrl: './social.component.scss'
})
export class SocialComponent implements OnInit {
  private socialService = inject(SocialService);
  private notificationService = inject(NotificationService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  activeTab = signal<'friends' | 'pending' | 'search' | 'blocked' | 'notifications'>('friends');
  
  friends = signal<SocialProfile[]>([]);
  pendingRequests = signal<SocialProfile[]>([]);
  blockedUsers = signal<SocialProfile[]>([]);
  searchResults = signal<SocialProfile[]>([]);
  notifications = signal<SocialNotification[]>([]);
  
  unreadNotificationsCount = computed(() => 
    this.notifications().filter(n => !n.isRead).length
  );
  
  loading = signal<boolean>(false);
  searchLoading = signal<boolean>(false);
  
  searchControl = new FormControl('');

  ngOnInit() {
    this.loadAllData();
    this.setupSearch();
  }

  loadAllData() {
    this.loadFriends();
    this.loadPendingRequests();
    this.loadBlockedUsers();
    this.loadNotifications();
  }

  setupSearch() {
    this.searchControl.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(300),
      distinctUntilChanged(),
      tap(query => {
        if (query && query.trim().length >= 2) {
          this.searchLoading.set(true);
        } else {
          this.searchResults.set([]);
          this.searchLoading.set(false);
        }
      }),
      switchMap(query => {
        if (!query || query.trim().length < 2) {
          return of([]);
        }
        return this.socialService.searchProfiles(query.trim()).pipe(
          catchError(() => {
            this.toastService.error('Erro ao realizar busca de perfis.');
            return of([]);
          })
        );
      })
    ).subscribe(results => {
      this.searchResults.set(results);
      this.searchLoading.set(false);
    });
  }

  // Load functions
  loadFriends() {
    this.loading.set(true);
    this.socialService.getFriends().subscribe({
      next: data => {
        this.friends.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.toastService.error('Erro ao carregar lista de amigos.');
        this.loading.set(false);
      }
    });
  }

  loadPendingRequests() {
    this.socialService.getPendingRequests().subscribe({
      next: data => {
        this.pendingRequests.set(data);
      },
      error: () => {
        this.toastService.error('Erro ao carregar solicitações pendentes.');
      }
    });
  }

  loadBlockedUsers() {
    this.socialService.getBlockedUsers().subscribe({
      next: data => {
        this.blockedUsers.set(data);
      },
      error: () => {
        this.toastService.error('Erro ao carregar lista de usuários bloqueados.');
      }
    });
  }

  loadNotifications() {
    this.socialService.getSocialNotifications().subscribe({
      next: data => {
        this.notifications.set(data);
        const hasUnread = data.some(n => !n.isRead);
        if (hasUnread && this.activeTab() === 'notifications') {
          this.markAllNotificationsAsRead(true);
        }
      },
      error: () => {
        this.toastService.error('Erro ao carregar notificações.');
      }
    });
  }

  // Social Actions
  sendFriendRequest(profile: SocialProfile) {
    this.socialService.sendFriendRequest(profile.userId).subscribe({
      next: () => {
        this.toastService.success(`Solicitação de amizade enviada para ${profile.name}!`);
        this.updateProfileStatusInLists(profile.userId, 'PENDING', true);
        this.loadPendingRequests();
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Erro ao enviar solicitação de amizade.';
        this.toastService.error(errorMsg);
      }
    });
  }

  acceptFriendRequest(profile: SocialProfile) {
    this.socialService.acceptFriendRequest(profile.userId).subscribe({
      next: () => {
        this.toastService.success(`Agora você e ${profile.name} são amigos!`);
        this.loadAllData();
      },
      error: () => {
        this.toastService.error('Erro ao aceitar solicitação de amizade.');
      }
    });
  }

  declineFriendRequest(profile: SocialProfile) {
    this.socialService.declineFriendRequest(profile.userId).subscribe({
      next: () => {
        this.toastService.success(`Solicitação de ${profile.name} recusada.`);
        this.loadAllData();
      },
      error: () => {
        this.toastService.error('Erro ao recusar solicitação de amizade.');
      }
    });
  }

  removeFriend(profile: SocialProfile) {
    if (confirm(`Tem certeza que deseja remover ${profile.name} da sua lista de amigos?`)) {
      this.socialService.removeFriend(profile.userId).subscribe({
        next: () => {
          this.toastService.success(`Amizade com ${profile.name} removida.`);
          this.loadAllData();
        },
        error: () => {
          this.toastService.error('Erro ao remover amigo.');
        }
      });
    }
  }

  blockUser(profile: SocialProfile) {
    if (confirm(`Deseja mesmo bloquear ${profile.name}? Vocês não poderão mais se encontrar ou interagir no sistema.`)) {
      this.socialService.blockUser(profile.userId).subscribe({
        next: () => {
          this.toastService.success(`${profile.name} foi bloqueado(a).`);
          this.loadAllData();
        },
        error: () => {
          this.toastService.error('Erro ao bloquear usuário.');
        }
      });
    }
  }

  unblockUser(profile: SocialProfile) {
    this.socialService.unblockUser(profile.userId).subscribe({
      next: () => {
        this.toastService.success(`${profile.name} foi desbloqueado(a).`);
        this.loadAllData();
      },
      error: () => {
        this.toastService.error('Erro ao desbloquear usuário.');
      }
    });
  }

  markNotificationAsRead(notif: SocialNotification) {
    if (notif.isRead) return;
    this.socialService.markNotificationAsRead(notif.id).subscribe({
      next: () => {
        this.notifications.update(list => 
          list.map(n => n.id === notif.id ? { ...n, isRead: true } : n)
        );
        this.notificationService.refreshSummary();
      }
    });
  }

  markAllNotificationsAsRead(silent = false) {
    this.socialService.markAllNotificationsAsRead().subscribe({
      next: () => {
        this.notifications.update(list => 
          list.map(n => ({ ...n, isRead: true }))
        );
        if (!silent) {
          this.toastService.success('Todas as notificações foram marcadas como lidas.');
        }
        this.notificationService.refreshSummary();
      },
      error: () => {
        if (!silent) {
          this.toastService.error('Erro ao marcar notificações como lidas.');
        }
      }
    });
  }

  private updateProfileStatusInLists(userId: string, status: 'NONE' | 'PENDING' | 'ACCEPTED' | 'BLOCKED', isRequester: boolean) {
    this.searchResults.update(list =>
      list.map(p => p.userId === userId ? { ...p, relationshipStatus: status, isRequester } : p)
    );
    this.friends.update(list =>
      list.map(p => p.userId === userId ? { ...p, relationshipStatus: status, isRequester } : p)
    );
  }

  changeTab(tab: 'friends' | 'pending' | 'search' | 'blocked' | 'notifications') {
    this.activeTab.set(tab);
    if (tab === 'friends') this.loadFriends();
    if (tab === 'pending') this.loadPendingRequests();
    if (tab === 'blocked') this.loadBlockedUsers();
    if (tab === 'notifications') this.loadNotifications();
  }
}
