import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PaywallModal } from './core/layout/paywall-modal/paywall-modal';


/**
 * Angular component for the App feature.
 * @description Handles the presentation logic and user interactions for the App view.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PaywallModal],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'MedStudy';
  private http = inject(HttpClient);

  ngOnInit() {
    this.http.get('/api/health/ping', { responseType: 'text' }).subscribe({
      next: () => console.log('Backend wake-up ping successful'),
      error: (err) => console.log('Backend wake-up ping failed:', err)
    });
  }
}
