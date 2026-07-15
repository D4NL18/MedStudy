import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService, UserSubscription } from '../../../core/services/subscription.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expiration-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expiration-banner.html',
  styleUrl: './expiration-banner.scss',
})
export class ExpirationBanner {
  private subscriptionService = inject(SubscriptionService);
  private router = inject(Router);

  subscription$: Observable<UserSubscription> = this.subscriptionService.getMySubscription();
  dismissed = false;

  getDaysRemaining(endDateStr: string | null): number | null {
    if (!endDateStr) return null;
    const endDate = new Date(endDateStr);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    if (diffTime < 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isExpiringSoon(sub: UserSubscription): boolean {
    if (sub.status === 'LIFETIME' || sub.status === 'EXPIRED') return false;
    const days = this.getDaysRemaining(sub.status === 'TRIAL' ? sub.trialEndDate : sub.currentPeriodEnd);
    return days !== null && days <= 5;
  }

  isExpired(sub: UserSubscription): boolean {
    return sub.status === 'EXPIRED';
  }

  irParaPlanos() {
    this.router.navigate(['/planos']);
  }

  dismiss() {
    this.dismissed = true;
  }
}
