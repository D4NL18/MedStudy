import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeService, AppTheme } from '@core/services/theme.service';
import { BadgeService, UserBadge } from '@core/services/badge.service';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ModalLayoutComponent } from '@shared/components/modal-layout/modal-layout.component';
import { AVATAR_PRESETS, AvatarPreset } from '@core/constants/avatar-presets';
import { ProfileActions } from '@store/profile/profile.actions';
import { selectProfile, selectLoading } from '@store/profile/profile.reducer';
import { selectUser } from '@store/auth/auth.selectors';
import { selectDashboardKPIs } from '@store/dashboard/dashboard.selectors';
import * as DashboardActions from '@store/dashboard/dashboard.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SubscriptionService, UserSubscription, PixTransaction } from '@core/services/subscription.service';



import { RouterModule } from '@angular/router';

/**
 * Angular component for the Perfil feature.
 * @description Handles the presentation logic and user interactions for the Perfil view.
 */
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule, AvatarComponent, ButtonComponent, ModalLayoutComponent, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  public themeService = inject(ThemeService);
  private badgeService = inject(BadgeService);
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private subscriptionService = inject(SubscriptionService);
  
  user = this.store.selectSignal(selectUser);
  profile = this.store.selectSignal(selectProfile);
  saving = this.store.selectSignal(selectLoading);
  kpis = toSignal(this.store.select(selectDashboardKPIs));
  
  earnedBadges = signal<UserBadge[]>([]);
  showAllBadgesModal = signal(false);
  isEditing = signal(false);
  editForm!: FormGroup;

  subscription = signal<UserSubscription | null>(null);
  transactions = signal<PixTransaction[]>([]);
  subscriptionLoaded = signal(false);

  badgesWithProgress = computed(() => {
    const kpisData = this.kpis();
    const badges = this.allPossibleBadges();
    return badges.map(b => ({
      ...b,
      progress: this.calculateProgress(b.name, kpisData)
    }));
  });

  showSchools = false;
  selectedCategory = 'Clínica Médica';
  selectedAvatarId = 'clinica_geral';
  
  themes: AppTheme[] = ['verde', 'azul', 'rosa', 'roxo', 'laranja', 'vermelho', 'claro', 'escuro'];
  semestres = Array.from({ length: 12 }, (_, i) => i + 1);
  categories = ['Clínica Médica', 'Cirurgia', 'Pediatria', 'Ginecologia e Obstetrícia', 'Preventiva', 'Outros'];

  schoolsList = [
    'USP - Universidade de São Paulo',
    'UNICAMP - Universidade Estadual de Campinas',
    'UNIFESP - Universidade Federal de São Paulo',
    'UFRJ - Universidade Federal do Rio de Janeiro',
    'UFMG - Universidade Federal de Minas Gerais',
    'UFRGS - Universidade Federal do Rio Grande do Sul',
    'UFSC - Universidade Federal de Santa Catarina',
    'UNESP - Universidade Estadual Paulista',
    'UERJ - Universidade do Estado do Rio de Janeiro',
    'UFPR - Universidade Federal do Paraná',
    'UFC - Universidade Federal do Ceará',
    'UFPE - Universidade Federal de Pernambuco',
    'UFBA - Universidade Federal da Bahia',
    'UnB - Universidade de Brasília',
    'Santa Casa de São Paulo'
  ];
  filteredSchools: string[] = [];

  allPossibleBadges = signal<any[]>([]);

  ngOnInit() {
    // Fetch subscription data
    this.subscriptionService.getMySubscription().subscribe({
      next: (sub) => { this.subscription.set(sub); this.subscriptionLoaded.set(true); },
      error: () => { this.subscription.set(null); this.subscriptionLoaded.set(true); }
    });
    this.subscriptionService.getMyTransactions().subscribe({
      next: (txs) => this.transactions.set(txs),
      error: () => this.transactions.set([])
    });

    combineLatest([
      this.badgeService.getAllBadges(),
      this.badgeService.getUserBadges()
    ]).subscribe(([allBadges, earnedBadges]) => {
      this.earnedBadges.set(earnedBadges);

      allBadges.forEach(b => {
        if (b.name.includes('STREAK')) b.icon = 'zap';
        else if (b.name.includes('PRECISION') || b.name.includes('QUESTIONS')) b.icon = 'target';
        else if (b.name.includes('SIMULADO')) b.icon = 'award';
        else if (b.name.includes('MASTER') || b.name.includes('AVATAR')) b.icon = 'sparkles';
        else b.icon = 'check-circle';
      });

      allBadges.sort((a, b) => {
        const aEarned = earnedBadges.some(eb => (eb.type as any).name === a.name || eb.type === a.name);
        const bEarned = earnedBadges.some(eb => (eb.type as any).name === b.name || eb.type === b.name);
        if (aEarned && !bEarned) return -1;
        if (!aEarned && bEarned) return 1;
        return a.displayName.localeCompare(b.displayName);
      });

      this.allPossibleBadges.set(allBadges);
    });

    this.store.dispatch(DashboardActions.loadDashboard());

    this.editForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      isFormado: [false],
      semestre: ['', Validators.required],
      faculdade: ['', Validators.required]
    });

    this.editForm.get('isFormado')?.valueChanges.subscribe(isFormado => {
      const semestreCtrl = this.editForm.get('semestre');
      if (isFormado) {
        semestreCtrl?.clearValidators();
        semestreCtrl?.setValue('');
      } else {
        semestreCtrl?.setValidators([Validators.required]);
      }
      semestreCtrl?.updateValueAndValidity();
    });

    // Autocomplete filter
    this.editForm.get('faculdade')?.valueChanges.subscribe(val => {
      if (!val) {
        this.filteredSchools = [];
      } else {
        const lowerVal = val.toLowerCase();
        this.filteredSchools = this.schoolsList.filter(s => s.toLowerCase().includes(lowerVal));
      }
    });
  }

  getFilteredPresets(): AvatarPreset[] {
    return AVATAR_PRESETS.filter(p => p.category === this.selectedCategory);
  }

  getAllPresets(): AvatarPreset[] {
    return AVATAR_PRESETS;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('A foto deve ter no máximo 10MB.');
        return;
      }
      this.store.dispatch(ProfileActions.uploadProfilePicture({ file }));
    }
  }

  selectSchool(school: string) {
    this.editForm.get('faculdade')?.setValue(school);
    this.showSchools = false;
  }

  hideSchoolsList() {
    setTimeout(() => {
      this.showSchools = false;
    }, 200);
  }

  startEditing() {
    const prof = this.profile();
    if (prof) {
      this.editForm.patchValue({
        nomeCompleto: prof.nomeCompleto,
        isFormado: !!prof.isFormado,
        semestre: prof.semestre,
        faculdade: prof.faculdade
      });
      this.selectedAvatarId = prof.avatarPresetId;
      const preset = AVATAR_PRESETS.find(p => p.id === prof.avatarPresetId);
      if (preset) {
        this.selectedCategory = preset.category;
      }
    }
    this.isEditing.set(true);
  }

  cancelEditing() {
    this.isEditing.set(false);
  }

  saveProfile() {
    if (this.editForm.valid) {
      const updatedProfile = {
        ...this.profile(),
        nomeCompleto: this.editForm.value.nomeCompleto,
        isFormado: this.editForm.value.isFormado,
        semestre: this.editForm.value.isFormado ? null : Number(this.editForm.value.semestre),
        faculdade: this.editForm.value.faculdade,
        avatarPresetId: this.selectedAvatarId,
        handle: this.profile()?.handle || ''
      };
      this.store.dispatch(ProfileActions.saveProfile({ profile: updatedProfile }));
      this.isEditing.set(false);
    }
  }

  togglePrivacySetting(field: 'isPublic' | 'shareStreak' | 'shareFaculdade' | 'shareTotalQuestions' | 'shareBadges') {
    const currentProfile = this.profile();
    if (currentProfile) {
      const updatedProfile = {
        ...currentProfile,
        [field]: currentProfile[field] === false ? true : false
      };
      this.store.dispatch(ProfileActions.saveProfile({ profile: updatedProfile }));
    }
  }

  changeTheme(theme: AppTheme) {
    this.themeService.setTheme(theme);
  }

  isEarned(name: string): boolean {
    return this.earnedBadges().some(b => (b.type as any).name === name || b.type === name);
  }

  getEarnedDate(name: string): string | null {
    const badge = this.earnedBadges().find(b => (b.type as any).name === name || b.type === name);
    return badge ? badge.earnedAt : null;
  }

  calculateProgress(badgeName: string, kpisData: any): { current: number, target: number, percent: number } | null {
    if (!kpisData) return null;

    let target = 0;
    let current = 0;

    const match = badgeName.match(/_(\d+)$/);
    if (match) {
      target = parseInt(match[1], 10);
    }

    if (badgeName.startsWith('QUESTIONS_')) current = kpisData.sessions?.totalQuestions || 0;
    else if (badgeName.startsWith('SIMULADOS_')) current = kpisData.simulados?.totalSimulados || 0;
    else if (badgeName.startsWith('STREAK_')) current = kpisData.currentStreak || 0;
    else if (badgeName.startsWith('EXPERT_') || badgeName.startsWith('MASTER_')) {
      target = badgeName.startsWith('EXPERT_') ? 200 : 1000;
      let area = '';
      if (badgeName.includes('PEDIATRIA')) area = 'Pediatria';
      else if (badgeName.includes('CIRURGIA')) area = 'Cirurgia';
      else if (badgeName.includes('PREVENTIVA')) area = 'Preventiva';
      else if (badgeName.includes('CLINICA')) area = 'Clínica Médica';
      else if (badgeName.includes('GO')) area = 'GO';

      if (area && kpisData.areaAnalytics) {
        const areaData = kpisData.areaAnalytics.find((a: any) => a.grandeArea === area || (area === 'GO' && a.grandeArea?.includes('Ginecologia')));
        current = areaData ? areaData.totalQuestions : 0;
      }
    } else if (badgeName === 'MEDICINE_AVATAR') {
      target = 5;
      if (kpisData.areaAnalytics) {
        const masterAreas = kpisData.areaAnalytics.filter((a: any) => a.totalQuestions >= 1000).length;
        current = masterAreas;
      }
    } else if (badgeName === 'CONSISTENT_80' || badgeName === 'CONSISTENT_90') {
      target = 5;
      current = 0; // The backend does not track this metric incrementally yet
    } else if (badgeName === 'ERROR_FREE_WEEK') {
      target = 7;
      current = Math.min(kpisData.currentStreak || 0, target); // Best effort visual representation
    } else {
      return null; // For PRECISION_*, FAST_THINKER, COMEBACK_KID, etc
    }

    if (target === 0) return null;

    return {
      current: Math.min(current, target),
      target,
      percent: Math.min(100, Math.round((current / target) * 100))
    };
  }
}
