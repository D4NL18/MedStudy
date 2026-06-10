import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeService, AppTheme } from '../../core/services/theme.service';
import { BadgeService, UserBadge } from '../../core/services/badge.service';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { AVATAR_PRESETS, AvatarPreset } from '../../core/constants/avatar-presets';
import { ProfileActions } from '../../store/profile/profile.actions';
import { selectProfile, selectLoading } from '../../store/profile/profile.reducer';
import { selectUser } from '../../store/auth/auth.selectors';
import { selectDashboardKPIs } from '../../store/dashboard/dashboard.selectors';
import * as DashboardActions from '../../store/dashboard/dashboard.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule, AvatarComponent],
  template: `
    <div class="perfil-container fade-in">
      <header class="perfil-header glass">
        <div class="user-info">
          <app-avatar [presetId]="profile()?.avatarPresetId" size="xl"></app-avatar>
          <div class="info-text">
            <h1>{{ profile()?.nomeCompleto || user()?.nome }}</h1>
            <p class="handle" *ngIf="profile()?.handle">&#64;{{ profile()?.handle }}</p>
            <p class="email">{{ user()?.email }}</p>
          </div>
        </div>
      </header>

      <div class="perfil-grid">
        <!-- Informações do Perfil / Form de Edição -->
        <section class="perfil-section glass">
          <div class="section-header">
            <div class="header-main">
              <h3>👤 Dados do Perfil</h3>
              <button class="edit-toggle-btn glass" *ngIf="!isEditing() && profile()" (click)="startEditing()">
                <lucide-icon name="edit-2" [size]="16"></lucide-icon>
                <span>Editar</span>
              </button>
            </div>
            <p>Seus dados acadêmicos e identificação no MedStudy</p>
          </div>

          <!-- View Mode -->
          <div class="profile-details" *ngIf="!isEditing() && profile()">
            <div class="detail-item">
              <span class="label">Nome Completo</span>
              <span class="value">{{ profile()?.nomeCompleto }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Faculdade</span>
              <span class="value">{{ profile()?.faculdade }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Situação Acadêmica</span>
              <span class="value">{{ profile()?.isFormado ? 'Formado' : (profile()?.semestre + 'º Semestre') }}</span>
            </div>
          </div>

          <!-- Edit Mode Form -->
          <form [formGroup]="editForm" class="edit-form" *ngIf="isEditing()" (ngSubmit)="saveProfile()">
            <div class="form-group">
              <label for="editNome">Nome Completo</label>
              <div class="input-wrap">
                <lucide-icon name="user" class="input-icon"></lucide-icon>
                <input id="editNome" type="text" formControlName="nomeCompleto">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group" *ngIf="!editForm.get('isFormado')?.value">
                <label for="editSemestre">Semestre</label>
                <div class="input-wrap">
                  <lucide-icon name="calendar" class="input-icon"></lucide-icon>
                  <select id="editSemestre" formControlName="semestre">
                    <option *ngFor="let sem of semestres" [value]="sem">{{ sem }}º Semestre</option>
                  </select>
                </div>
              </div>

              <div class="form-group checkbox-group" style="display: flex; align-items: center; justify-content: center;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                  <input type="checkbox" formControlName="isFormado" style="margin-right: 8px;">
                  Já sou formado
                </label>
              </div>

              <div class="form-group">
                <label for="editFaculdade">Faculdade</label>
                <div class="input-wrap">
                  <lucide-icon name="book-open" class="input-icon"></lucide-icon>
                  <input id="editFaculdade" type="text" formControlName="faculdade" 
                         (focus)="showSchools = true"
                         (blur)="hideSchoolsList()">
                </div>
                
                <!-- Autocomplete Dropdown -->
                <div class="autocomplete-dropdown glass" *ngIf="showSchools && filteredSchools.length > 0">
                  <div class="autocomplete-item" 
                       *ngFor="let school of filteredSchools"
                       (mousedown)="selectSchool(school)">
                    {{ school }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Avatar selection -->
            <div class="form-group">
              <label>Escolha seu Avatar</label>
              
              <div class="specialties-grid scrollable avatar-grid">
                <div class="avatar-option-card" 
                     *ngFor="let item of getAllPresets()"
                     [class.active]="selectedAvatarId === item.id"
                     (click)="selectedAvatarId = item.id"
                     [title]="item.name">
                  <app-avatar [presetId]="item.id" size="sm"></app-avatar>
                  <div class="check-indicator" *ngIf="selectedAvatarId === item.id">
                    <lucide-icon name="check" [size]="10"></lucide-icon>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary glass" (click)="cancelEditing()">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="editForm.invalid || saving()">
                {{ saving() ? 'Salvando...' : 'Salvar Alterações' }}
              </button>
            </div>
          </form>
        </section>

        <!-- Personalização -->
        <section class="perfil-section glass">
          <div class="section-header">
            <h3>🎨 Personalização</h3>
            <p>Escolha o tema que melhor combina com seu estudo</p>
          </div>
          <div class="theme-grid">
            <button *ngFor="let t of themes" 
                    class="theme-card"
                    [class.active]="themeService.activeTheme() === t"
                    (click)="changeTheme(t)">
              <div class="color-preview" [attr.data-theme]="t"></div>
              <span>{{ t | titlecase }}</span>
            </button>
          </div>
        </section>
      </div>

      <!-- Conquistas -->
      <section class="perfil-section glass mt-6">
        <div class="section-header">
          <h3>🏆 Galeria de Conquistas</h3>
          <p>Seu progresso e badges conquistadas</p>
        </div>
        
        <div class="badges-grid">
          <div *ngFor="let badge of badgesWithProgress().slice(0, 3)" 
               class="badge-item" 
               [class.locked]="!isEarned(badge.name)">
            <div class="badge-icon">
              <lucide-icon [name]="badge.icon"></lucide-icon>
            </div>
            <div class="badge-info">
              <h4>{{ badge.displayName }}</h4>
              <p>{{ badge.description }}</p>
              <span class="earned-date" *ngIf="getEarnedDate(badge.name)">
                Conquistada em {{ getEarnedDate(badge.name) | date:'dd/MM/yyyy' }}
              </span>
              <span class="locked-text" *ngIf="!isEarned(badge.name)">
                Bloqueada
              </span>
              <div class="badge-progress mt-4" *ngIf="!isEarned(badge.name) && badge.progress">
                <div class="progress-info" style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #94a3b8; margin-bottom: 4px;">
                  <span>Progresso</span>
                  <span>{{ badge.progress.current }} / {{ badge.progress.target }}</span>
                </div>
                <div class="progress-bar-bg" style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                  <div class="progress-bar-fill" [style.width.%]="badge.progress.percent" style="height: 100%; background: #6366f1; transition: width 0.3s ease;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div style="display: flex; justify-content: center; margin-top: 20px;">
          <button class="btn btn-secondary glass" style="padding: 10px 24px; border-radius: 12px; font-weight: 700; color: #e2e8f0; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); cursor: pointer;" (click)="showAllBadgesModal.set(true)">
            Ver todas as conquistas
          </button>
        </div>
      </section>

      <!-- Configurações de Privacidade -->
      <section class="perfil-section glass mt-6">
          <div class="section-header">
            <h3>🔒 Privacidade</h3>
            <p>Controle quem pode visualizar seus dados acadêmicos e conquistas</p>
          </div>

          <div class="privacy-settings">
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-title">
                  <lucide-icon name="shield" [size]="18" class="icon-primary"></lucide-icon>
                  <span>Perfil Público</span>
                </div>
                <p class="setting-desc">Permitir que outros estudantes busquem e vejam seu perfil. Se desativado, apenas amigos aceitos terão acesso.</p>
              </div>
              <label class="switch-control">
                <input type="checkbox" [checked]="profile()?.isPublic !== false" (change)="togglePrivacySetting('isPublic')">
                <span class="switch-slider"></span>
              </label>
            </div>

            <div class="setting-item" [class.disabled]="profile()?.isPublic === false">
              <div class="setting-info">
                <div class="setting-title">
                  <lucide-icon name="book-open" [size]="18" class="icon-secondary"></lucide-icon>
                  <span>Compartilhar Faculdade</span>
                </div>
                <p class="setting-desc">Mostrar faculdade, semestre e situação acadêmica para outros usuários.</p>
              </div>
              <label class="switch-control">
                <input type="checkbox" 
                       [disabled]="profile()?.isPublic === false" 
                       [checked]="profile()?.shareFaculdade !== false" 
                       (change)="togglePrivacySetting('shareFaculdade')">
                <span class="switch-slider"></span>
              </label>
            </div>

            <div class="setting-item" [class.disabled]="profile()?.isPublic === false">
              <div class="setting-info">
                <div class="setting-title">
                  <lucide-icon name="zap" [size]="18" class="icon-accent"></lucide-icon>
                  <span>Compartilhar Ofensiva (Streak)</span>
                </div>
                <p class="setting-desc">Mostrar o número de dias seguidos que você estudou.</p>
              </div>
              <label class="switch-control">
                <input type="checkbox" 
                       [disabled]="profile()?.isPublic === false" 
                       [checked]="profile()?.shareStreak !== false" 
                       (change)="togglePrivacySetting('shareStreak')">
                <span class="switch-slider"></span>
              </label>
            </div>

            <div class="setting-item" [class.disabled]="profile()?.isPublic === false">
              <div class="setting-info">
                <div class="setting-title">
                  <lucide-icon name="target" [size]="18" class="icon-target"></lucide-icon>
                  <span>Compartilhar Total de Questões</span>
                </div>
                <p class="setting-desc">Mostrar o total de questões resolvidas.</p>
              </div>
              <label class="switch-control">
                <input type="checkbox" 
                       [disabled]="profile()?.isPublic === false" 
                       [checked]="profile()?.shareTotalQuestions !== false" 
                       (change)="togglePrivacySetting('shareTotalQuestions')">
                <span class="switch-slider"></span>
              </label>
            </div>

            <div class="setting-item" [class.disabled]="profile()?.isPublic === false">
              <div class="setting-info">
                <div class="setting-title">
                  <lucide-icon name="award" [size]="18" class="icon-award"></lucide-icon>
                  <span>Compartilhar Conquistas</span>
                </div>
                <p class="setting-desc">Mostrar as badges e conquistas na sua galeria.</p>
              </div>
              <label class="switch-control">
                <input type="checkbox" 
                       [disabled]="profile()?.isPublic === false" 
                       [checked]="profile()?.shareBadges !== false" 
                       (change)="togglePrivacySetting('shareBadges')">
                <span class="switch-slider"></span>
              </label>
            </div>
          </div>
        </section>

      <!-- Modal Todas as Conquistas -->
      <div class="modal-overlay" *ngIf="showAllBadgesModal()" (click)="showAllBadgesModal.set(false)" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px;">
        <div class="modal-content glass" (click)="$event.stopPropagation()" style="background: rgba(30, 30, 40, 0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; width: 100%; max-width: 900px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;">
          <div class="modal-header" style="padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 1.2rem; font-weight: 700;">🏆 Todas as Conquistas</h3>
            <button class="close-btn" (click)="showAllBadgesModal.set(false)" style="background: transparent; border: none; color: #94a3b8; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; border-radius: 8px;">
              <lucide-icon name="x"></lucide-icon>
            </button>
          </div>
          <div class="modal-body" style="padding: 24px; overflow-y: auto;">
            <div class="badges-grid">
              <div *ngFor="let badge of badgesWithProgress()" 
                   class="badge-item" 
                   [class.locked]="!isEarned(badge.name)">
                <div class="badge-icon">
                  <lucide-icon [name]="badge.icon"></lucide-icon>
                </div>
                <div class="badge-info" style="width: 100%;">
                  <h4>{{ badge.displayName }}</h4>
                  <p>{{ badge.description }}</p>
                  <span class="earned-date" *ngIf="getEarnedDate(badge.name)">
                    Conquistada em {{ getEarnedDate(badge.name) | date:'dd/MM/yyyy' }}
                  </span>
                  <span class="locked-text" *ngIf="!isEarned(badge.name)">
                    Bloqueada
                  </span>
                  <div class="badge-progress mt-4" *ngIf="!isEarned(badge.name) && badge.progress">
                    <div class="progress-info" style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #94a3b8; margin-bottom: 4px;">
                      <span>Progresso</span>
                      <span>{{ badge.progress.current }} / {{ badge.progress.target }}</span>
                    </div>
                    <div class="progress-bar-bg" style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                      <div class="progress-bar-fill" [style.width.%]="badge.progress.percent" style="height: 100%; background: #6366f1; transition: width 0.3s ease;"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  public themeService = inject(ThemeService);
  private badgeService = inject(BadgeService);
  private store = inject(Store);
  private fb = inject(FormBuilder);
  
  user = this.store.selectSignal(selectUser);
  profile = this.store.selectSignal(selectProfile);
  saving = this.store.selectSignal(selectLoading);
  kpis = toSignal(this.store.select(selectDashboardKPIs));
  
  earnedBadges = signal<UserBadge[]>([]);
  showAllBadgesModal = signal(false);
  isEditing = signal(false);
  editForm!: FormGroup;

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
