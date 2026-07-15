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
  userSelectedStatuses = signal<string[]>([]);
  userSelectedOrigins = signal<boolean[]>([]);
  userSortCol = signal<string>('user.name');
  userSortDir = signal<'asc' | 'desc'>('asc');
  
  statusFilterOpen = false;
  originFilterOpen = false;

  userPage = signal(0);
  userTotalPages = signal(0);
  userTotalElements = signal(0);

  // Filtering & Pagination Transactions
  txSearch = '';
  txSelectedStatuses = signal<string[]>([]);
  txSortCol = signal<string>('createdAt');
  txSortDir = signal<'asc' | 'desc'>('desc');
  txStatusFilterOpen = false;

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
    this.adminService.getUsers(
      this.userSearch, 
      this.userSelectedStatuses(),
      this.userSelectedOrigins(),
      this.userSortCol(),
      this.userSortDir(),
      this.userPage()
    ).subscribe({
      next: (res) => {
        console.log('API Response getUsers:', res);
        this.users.set(res.content || []);
        this.userTotalPages.set(res.totalPages || 0);
        this.userTotalElements.set(res.totalElements || 0);
        this.loadingUsers.set(false);
      },
      error: () => this.loadingUsers.set(false)
    });
  }

  loadTransactions() {
    this.loadingTransactions.set(true);
    this.adminService.getTransactions(
      this.txPage(),
      20,
      this.txSortCol(),
      this.txSortDir(),
      this.txSearch,
      this.txSelectedStatuses()
    ).subscribe({
      next: (res) => {
        this.transactions.set(res.content || []);
        this.txTotalPages.set(res.totalPages || 0);
        this.txTotalElements.set(res.totalElements || 0);
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

  clearFilters() {
    this.userSearch = '';
    this.userSelectedStatuses.set([]);
    this.userSelectedOrigins.set([]);
    this.userSortCol.set('user.name');
    this.userSortDir.set('asc');
    this.userPage.set(0);
    this.statusFilterOpen = false;
    this.originFilterOpen = false;
    this.loadUsers();
  }

  toggleUserStatusFilter(status: string) {
    const current = this.userSelectedStatuses();
    if (current.includes(status)) {
      this.userSelectedStatuses.set(current.filter(s => s !== status));
    } else {
      this.userSelectedStatuses.set([...current, status]);
    }
    this.onUserFilterChange();
  }

  toggleUserOriginFilter(isAdminOverride: boolean) {
    const current = this.userSelectedOrigins();
    if (current.includes(isAdminOverride)) {
      this.userSelectedOrigins.set(current.filter(o => o !== isAdminOverride));
    } else {
      this.userSelectedOrigins.set([...current, isAdminOverride]);
    }
    this.onUserFilterChange();
  }

  sortBy(col: string) {
    if (this.userSortCol() === col) {
      this.userSortDir.set(this.userSortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.userSortCol.set(col);
      this.userSortDir.set('asc');
    }
    this.onUserFilterChange();
  }

  clearTxFilters() {
    this.txSearch = '';
    this.txSelectedStatuses.set([]);
    this.txSortCol.set('createdAt');
    this.txSortDir.set('desc');
    this.txPage.set(0);
    this.txStatusFilterOpen = false;
    this.loadTransactions();
  }

  toggleTxStatusFilter(status: string) {
    const current = this.txSelectedStatuses();
    if (current.includes(status)) {
      this.txSelectedStatuses.set(current.filter(s => s !== status));
    } else {
      this.txSelectedStatuses.set([...current, status]);
    }
    this.onTxFilterChange();
  }

  sortTxBy(col: string) {
    if (this.txSortCol() === col) {
      this.txSortDir.set(this.txSortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.txSortCol.set(col);
      this.txSortDir.set('asc');
    }
    this.onTxFilterChange();
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
    if (!user) return;

    if (this.selectedOverrideOption === 'FORCE_EXPIRE' && !this.overrideNotes.trim()) {
      alert('Por favor, preencha o motivo para forçar a expiração.');
      return;
    }

    const finalNotes = this.selectedOverrideOption === 'FORCE_EXPIRE'
      ? this.overrideNotes.trim()
      : 'Alteração concedida manualmente pelo painel administrativo.';

    this.submittingOverride.set(true);
    this.adminService.overrideSubscription(user.userId, this.selectedOverrideOption, finalNotes).subscribe({
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
