import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
export class AppComponent {
  title = 'MedStudy';
}
