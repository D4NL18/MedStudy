import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { LucideAngularModule } from 'lucide-angular';
import { FlashcardsStudyComponent } from '@features/flashcards/pages/flashcards-study/flashcards-study.component';
import { OfflineBannerComponent } from '@shared/components/offline-banner/offline-banner';

import { selectUser } from '@store/auth/auth.selectors';
import * as AuthActions from '@store/auth/auth.actions';
import { NotificationService, NotificationSummary } from '@core/services/notification.service';
import { SocialService } from '@core/services/social.service';
import { PwaService } from '../services/pwa.service';
import { OnboardingComponent } from '@features/auth/onboarding/onboarding.component';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { ProfileActions } from '@store/profile/profile.actions';
import { selectProfile } from '@store/profile/profile.reducer';


/**
 * Angular component for the Shell feature.
 * @description Handles the presentation logic and user interactions for the Shell view.
 */
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    FlashcardsStudyComponent, 
    OfflineBannerComponent,
    LucideAngularModule,
    OnboardingComponent,
    AvatarComponent,

    OverlayModule,
    PortalModule
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent implements OnInit {
  private store = inject(Store);
  private notificationService = inject(NotificationService);
  private socialService = inject(SocialService);
  private breakpointObserver = inject(BreakpointObserver);
  private pwaService = inject(PwaService);
  
  canInstall = this.pwaService.canInstall$;
  
  user = this.store.selectSignal(selectUser);
  profile = this.store.selectSignal(selectProfile);
  notifications = signal<NotificationSummary | null>(null);
  showDropdown = signal(false);
  isDrawerOpen = signal(false);
  isMobile = signal(false);
  hasOpenedDropdown = signal(false);
  previousTotalAlerts = signal(0);

  constructor() {
    effect(() => {
      if (this.notificationService.summary) {
        const sum = this.notificationService.summary();
        if (sum) {
          this.notifications.set(sum);
          if (sum.totalAlerts > this.previousTotalAlerts()) {
            this.hasOpenedDropdown.set(false);
          }
          this.previousTotalAlerts.set(sum.totalAlerts);
        }
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.store.dispatch(ProfileActions.loadProfile());
    this.loadNotifications();
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe(result => {
      this.isMobile.set(result.matches);
    });
  }

  loadNotifications() {
    this.notificationService.getSummary().subscribe(summary => {
      this.notifications.set(summary);
      if (summary) {
        if (summary.totalAlerts > this.previousTotalAlerts()) {
          this.hasOpenedDropdown.set(false);
        }
        this.previousTotalAlerts.set(summary.totalAlerts);
      }
    });
  }

  toggleDropdown() {
    const isOpening = !this.showDropdown();
    this.showDropdown.set(isOpening);
    if (isOpening) {
      this.hasOpenedDropdown.set(true);
      this.socialService.markAllNotificationsAsRead().subscribe({
        next: () => {
          this.loadNotifications();
        }
      });
    }
  }

  toggleDrawer() {
    this.isDrawerOpen.set(!this.isDrawerOpen());
  }

  logout() {
    this.isDrawerOpen.set(false);
    this.store.dispatch(AuthActions.logout());
  }

  installApp() {
    this.pwaService.install();
  }

  getFirstName(): string {
    const p = this.profile();
    const u = this.user() as any;
    const nome = p?.nomeCompleto || u?.name || u?.nome;
    if (!nome) return 'Estudante';
    return nome.split(' ')[0];
  }

  getInitials(): string {
    const p = this.profile();
    const u = this.user() as any;
    const nome = p?.nomeCompleto || u?.name || u?.nome;
    return nome ? nome.charAt(0).toUpperCase() : 'E';
  }
}
