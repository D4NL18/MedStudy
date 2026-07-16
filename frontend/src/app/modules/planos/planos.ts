import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService, PixResponse } from '../../core/services/subscription.service';
import { Subscription, interval, Subject } from 'rxjs';
import { switchMap, takeUntil, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './planos.html',
  styleUrl: './planos.scss',
})
export class Planos implements OnDestroy {
  private subscriptionService = inject(SubscriptionService);
  private router = inject(Router);
  
  loadingPix = false;
  showPixModal = false;
  pixData: PixResponse | null = null;
  pixSuccess = false;
  copiado = false;
  
  price = environment.premiumPrice;
  billingCycle = environment.premiumBillingCycle;

  private destroy$ = new Subject<void>();
  private pollSubscription?: Subscription;

  gerarPix() {
    this.loadingPix = true;
    this.subscriptionService.createPixCharge().subscribe({
      next: (res) => {
        this.pixData = res;
        this.showPixModal = true;
        this.loadingPix = false;
        this.startPolling(res.txid);
      },
      error: (err) => {
        console.error('Erro ao gerar PIX:', err);
        this.loadingPix = false;
      }
    });
  }

  copiarPix(codigo: string) {
    navigator.clipboard.writeText(codigo).then(() => {
      this.copiado = true;
      setTimeout(() => this.copiado = false, 2000);
    });
  }

  fecharModal() {
    this.showPixModal = false;
    this.pixData = null;
    this.stopPolling();
    if (this.pixSuccess) {
      this.router.navigate(['/dashboard']);
    }
  }

  private startPolling(txid: string) {
    this.stopPolling();
    this.pollSubscription = interval(6000)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.subscriptionService.getPixStatus(txid)),
        filter(status => status.isPaid)
      )
      .subscribe({
        next: (status) => {
          this.pixSuccess = true;
          this.stopPolling();
        },
        error: (err) => console.error('Erro ao consultar status do PIX:', err)
      });
  }

  private stopPolling() {
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
      this.pollSubscription = undefined;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
