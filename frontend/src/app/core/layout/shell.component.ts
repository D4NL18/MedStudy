import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { LucideAngularModule } from 'lucide-angular';
import { FlashcardsStudyComponent } from '../../features/flashcards/pages/flashcards-study/flashcards-study.component';
import { selectUser } from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';
import { NotificationService, NotificationSummary } from '../../core/services/notification.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    FlashcardsStudyComponent, 
    LucideAngularModule,
    OverlayModule,
    PortalModule
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent implements OnInit {
  private store = inject(Store);
  private notificationService = inject(NotificationService);
  private breakpointObserver = inject(BreakpointObserver);
  
  user = this.store.selectSignal(selectUser);
  notifications = signal<NotificationSummary | null>(null);
  showDropdown = signal(false);
  isDrawerOpen = signal(false);
  isMobile = signal(false);

  ngOnInit() {
    this.loadNotifications();
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe(result => {
      this.isMobile.set(result.matches);
    });
  }

  loadNotifications() {
    this.notificationService.getSummary().subscribe(summary => {
      this.notifications.set(summary);
    });
  }

  toggleDropdown() {
    this.showDropdown.set(!this.showDropdown());
  }

  toggleDrawer() {
    this.isDrawerOpen.set(!this.isDrawerOpen());
  }

  logout() {
    this.isDrawerOpen.set(false);
    this.store.dispatch(AuthActions.logout());
  }
}
