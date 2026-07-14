import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  AdminSubscriptionService,
  AdminSubscriptionStats,
  AdminUserSubscription,
  AdminPixTransaction,
  OverrideOption
} from '@core/services/admin-subscription.service';

@Component({
  selector: 'app-admin-subscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-subscriptions.component.html',
  styleUrl: './admin-subscriptions.component.scss'
})
export class AdminSubscriptionsComponent implements OnInit {
  private adminService = inject(AdminSubscriptionService);

  activeTab = signal<'users' | 'transactions'>('users');
  loadingStats = signal(true);
  loadingUsers = signal(true);
  loadingTransactions = signal(true);

  stats = signal<AdminSubscriptionStats | null>(null);
  users = signal<AdminUserSubscription[]>([]);
  transactions = signal<AdminPixTransaction[]>([]);

  // Filtering & Pagination Users
  userSearch = '';
  userStatusFilter = '';
  userPage = signal(0);
  userTotalPages = signal(0);
  userTotalElements = signal(0);

  // Filtering & Pagination Transactions
  txStatusFilter = '';
  txPage = signal(0);
  txTotalPages = signal(0);
  txTotalElements = signal(0);

  // Modal State
  selectedUserForOverride = signal<AdminUserSubscription | null>(null);
  selectedOverrideOption: OverrideOption = 'ADD_365_DAYS';
  overrideNotes = '';
  submittingOverride = signal(false);

  ngOnInit() {
    this.loadStats();
    this.loadUsers();
    this.loadTransactions();
  }

  loadStats() {
    this.loadingStats.set(true);
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loadingStats.set(false);
      },
      error: () => this.loadingStats.set(false)
    });
  }

  loadUsers() {
    this.loadingUsers.set(true);
    this.adminService.getUsers(this.userSearch, this.userStatusFilter, this.userPage()).subscribe({
      next: (res) => {
        this.users.set(res.content);
        this.userTotalPages.set(res.totalPages);
        this.userTotalElements.set(res.totalElements);
        this.loadingUsers.set(false);
      },
      error: () => this.loadingUsers.set(false)
    });
  }

  loadTransactions() {
    this.loadingTransactions.set(true);
    this.adminService.getTransactions(this.txStatusFilter, this.txPage()).subscribe({
      next: (res) => {
        this.transactions.set(res.content);
        this.txTotalPages.set(res.totalPages);
        this.txTotalElements.set(res.totalElements);
        this.loadingTransactions.set(false);
      },
      error: () => this.loadingTransactions.set(false)
    });
  }

  onUserSearch() {
    this.userPage.set(0);
    this.loadUsers();
  }

  onUserFilterChange() {
    this.userPage.set(0);
    this.loadUsers();
  }

  onTxFilterChange() {
    this.txPage.set(0);
    this.loadTransactions();
  }

  changeUserPage(newPage: number) {
    if (newPage >= 0 && newPage < this.userTotalPages()) {
      this.userPage.set(newPage);
      this.loadUsers();
    }
  }

  changeTxPage(newPage: number) {
    if (newPage >= 0 && newPage < this.txTotalPages()) {
      this.txPage.set(newPage);
      this.loadTransactions();
    }
  }

  openOverrideModal(user: AdminUserSubscription) {
    this.selectedUserForOverride.set(user);
    this.selectedOverrideOption = 'ADD_365_DAYS';
    this.overrideNotes = '';
  }

  closeOverrideModal() {
    this.selectedUserForOverride.set(null);
    this.overrideNotes = '';
  }

  submitOverride() {
    const user = this.selectedUserForOverride();
    if (!user || !this.overrideNotes.trim()) {
      alert('Por favor, preencha o motivo/observação para realizar a alteração.');
      return;
    }

    this.submittingOverride.set(true);
    this.adminService.overrideSubscription(user.userId, this.selectedOverrideOption, this.overrideNotes.trim()).subscribe({
      next: () => {
        this.submittingOverride.set(false);
        this.closeOverrideModal();
        this.loadStats();
        this.loadUsers();
      },
      error: (err) => {
        this.submittingOverride.set(false);
        alert(err?.error?.message || 'Erro ao realizar alteração manual de acesso.');
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'badge-active';
      case 'TRIAL': return 'badge-trial';
      case 'EXPIRED': return 'badge-expired';
      case 'LIFETIME': return 'badge-lifetime';
      case 'PAID': return 'badge-active';
      case 'CREATED': return 'badge-trial';
      case 'CANCELLED': return 'badge-expired';
      default: return 'badge-default';
    }
  }
}
