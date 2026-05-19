import { Component, OnInit, inject, signal } from '@angular/core';
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

        <!-- Configurações de Privacidade -->
        <section class="perfil-section glass">
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
      </div>

      <!-- Conquistas -->
      <section class="perfil-section glass mt-6">
        <div class="section-header">
          <h3>🏆 Galeria de Conquistas</h3>
          <p>Seu progresso e badges conquistadas</p>
        </div>
        
        <div class="badges-grid">
          <div *ngFor="let badge of allPossibleBadges" 
               class="badge-item" 
               [class.locked]="!isEarned(badge.type)">
            <div class="badge-icon">
              <lucide-icon [name]="badge.icon"></lucide-icon>
            </div>
            <div class="badge-info">
              <h4>{{ badge.displayName }}</h4>
              <p>{{ badge.description }}</p>
              <span class="earned-date" *ngIf="getEarnedDate(badge.type)">
                Conquistada em {{ getEarnedDate(badge.type) | date:'dd/MM/yyyy' }}
              </span>
              <span class="locked-text" *ngIf="!isEarned(badge.type)">
                Bloqueada
              </span>
            </div>
          </div>
        </div>
      </section>
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
  
  earnedBadges = signal<UserBadge[]>([]);
  isEditing = signal(false);
  editForm!: FormGroup;

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

  allPossibleBadges = [
    { type: 'STREAK_7', displayName: 'Mestre da Ofensiva', description: '7 dias seguidos de estudo', icon: 'zap' },
    { type: 'QUESTIONS_1000', displayName: 'Maratonista de Questões', description: 'Resolveu 1000 questões', icon: 'target' },
    { type: 'SIMULADOS_10', displayName: 'Estratega de Simulados', description: 'Realizou 10 simulados completos', icon: 'award' }
  ];

  ngOnInit() {
    this.badgeService.getUserBadges().subscribe(badges => {
      this.earnedBadges.set(badges);
    });

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

  isEarned(type: string): boolean {
    return this.earnedBadges().some(b => b.type === type);
  }

  getEarnedDate(type: string): string | null {
    const badge = this.earnedBadges().find(b => b.type === type);
    return badge ? badge.earnedAt : null;
  }
}
