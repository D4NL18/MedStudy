import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';
import { FlashcardsStudyComponent } from '../../features/flashcards/pages/flashcards-study/flashcards-study.component';
import { selectUser } from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';
import { NotificationService, NotificationSummary } from '../../core/services/notification.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FlashcardsStudyComponent, LucideAngularModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent implements OnInit {
  private store = inject(Store);
  private notificationService = inject(NotificationService);
  
  user = this.store.selectSignal(selectUser);
  notifications = signal<NotificationSummary | null>(null);
  showDropdown = signal(false);

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.getSummary().subscribe(summary => {
      this.notifications.set(summary);
    });
  }

  toggleDropdown() {
    this.showDropdown.set(!this.showDropdown());
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
