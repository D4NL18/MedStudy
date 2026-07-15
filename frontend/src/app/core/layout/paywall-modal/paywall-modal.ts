import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { selectShowPaywall } from '../../../store/auth/auth.selectors';
import { hidePaywall } from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-paywall-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paywall-modal.html',
  styleUrl: './paywall-modal.scss',
})
export class PaywallModal {
  private store = inject(Store);
  private router = inject(Router);

  showPaywall$ = this.store.select(selectShowPaywall);

  irParaPlanos() {
    this.store.dispatch(hidePaywall());
    this.router.navigate(['/planos']);
  }
}

