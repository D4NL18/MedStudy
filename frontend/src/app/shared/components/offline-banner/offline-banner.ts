import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { fromEvent, Subscription, merge } from 'rxjs';
import { map } from 'rxjs/operators';


/**
 * Offline Banner.
 * @description Provides offline banner functionality.
 */
@Component({
  selector: 'app-offline-banner',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './offline-banner.html',
  styleUrls: ['./offline-banner.scss']
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
