import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { fromEvent, Subscription, merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-offline-banner',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="offline-banner" *ngIf="isOffline()">
      <lucide-icon name="wifi-off" [size]="16"></lucide-icon>
      <span>Conexão perdida. Você está visualizando uma versão offline dos seus estudos.</span>
    </div>
  `,
  styles: [`
    .offline-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background-color: #FEF9C3; /* Amber-100 */
      color: #854D0E; /* Amber-900 */
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
  `]
})
export class OfflineBannerComponent implements OnInit, OnDestroy {
  isOffline = signal(!navigator.onLine);
  private subscription = new Subscription();

  ngOnInit() {
    this.subscription.add(
      merge(
        fromEvent(window, 'offline').pipe(map(() => true)),
        fromEvent(window, 'online').pipe(map(() => false))
      ).subscribe(isOffline => {
        this.isOffline.set(isOffline);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
