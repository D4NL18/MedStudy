import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { AVATAR_PRESETS, AvatarPreset } from '../../../core/constants/avatar-presets';
import { ProfileActions } from '../../../store/profile/profile.actions';
import { selectProfile, selectLoading, selectHandleAvailability, selectHandleChecking } from '../../../store/profile/profile.reducer';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule, AvatarComponent],
  template: `
    <div class="onboarding-overlay" *ngIf="showOnboarding()">
      <div class="onboarding-card glass fade-in">
        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-bar" [style.width.%]="(step / 3) * 100"></div>
          <div class="steps-info">
            <span class="step-num">Passo {{ step }} de 3</span>
            <span class="step-title">{{ getStepTitle() }}</span>
          </div>
        </div>

        <!-- Step 1: Basic Info -->
        <div class="step-content" *ngIf="step === 1">
          <div class="header-section">
            <h2>Boas-vindas ao MedStudy! 👋</h2>
            <p>Vamos configurar o seu perfil acadêmico para personalizar sua jornada.</p>
          </div>

          <form [formGroup]="basicForm" class="onboarding-form">
            <div class="form-group">
              <label for="nomeCompleto">Nome Completo</label>
              <div class="input-wrap">
                <lucide-icon name="user" class="input-icon"></lucide-icon>
                <input id="nomeCompleto" type="text" formControlName="nomeCompleto" placeholder="Dr. Nome Sobrenome">
              </div>
              <span class="error-msg" *ngIf="basicForm.get('nomeCompleto')?.touched && basicForm.get('nomeCompleto')?.invalid">
                Nome completo é obrigatório
              </span>
            </div>

            <div class="form-row">
              <div class="form-group semester-group" *ngIf="!basicForm.get('isFormado')?.value">
                <label for="semestre">Semestre</label>
                <div class="input-wrap">
                  <lucide-icon name="calendar" class="input-icon"></lucide-icon>
                  <select id="semestre" formControlName="semestre">
                    <option value="" disabled selected>Selecione</option>
                    <option *ngFor="let sem of semestres" [value]="sem">{{ sem }}º Semestre</option>
                  </select>
                </div>
                <span class="error-msg" *ngIf="basicForm.get('semestre')?.touched && basicForm.get('semestre')?.invalid">
                  Obrigatório
                </span>
              </div>

              <div class="form-group checkbox-group" style="display: flex; align-items: center; margin-top: 1rem;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                  <input type="checkbox" formControlName="isFormado" style="margin-right: 8px;">
                  Já sou formado
                </label>
              </div>

              <div class="form-group school-group">
                <label for="faculdade">Faculdade de Medicina</label>
                <div class="input-wrap">
                  <lucide-icon name="book-open" class="input-icon"></lucide-icon>
                  <input id="faculdade" type="text" formControlName="faculdade" 
                         (focus)="showSchools = true"
                         (blur)="hideSchoolsList()"
                         placeholder="Ex: USP, Santa Casa, etc.">
                </div>
                
                <!-- Autocomplete Dropdown -->
                <div class="autocomplete-dropdown glass" *ngIf="showSchools && filteredSchools.length > 0">
                  <div class="autocomplete-item" 
                       *ngFor="let school of filteredSchools"
                       (mousedown)="selectSchool(school)">
                    {{ school }}
                  </div>
                </div>
                
                <span class="error-msg" *ngIf="basicForm.get('faculdade')?.touched && basicForm.get('faculdade')?.invalid">
                  Faculdade é obrigatória
                </span>
              </div>
            </div>
          </form>
        </div>

        <!-- Step 2: Handle selection -->
        <div class="step-content" *ngIf="step === 2">
          <div class="header-section">
            <h2>Escolha seu handle único 🆔</h2>
            <p>Seu handle (ex: &#64;pedro.med) será usado para buscas, conexões e conquistas na rede MedStudy.</p>
          </div>

          <form [formGroup]="handleForm" class="onboarding-form">
            <div class="form-group">
              <label for="handle">Seu Handle Único</label>
              <div class="input-wrap handle-input-wrap">
                <span class="handle-at">&#64;</span>
                <input id="handle" type="text" formControlName="handle" placeholder="nome.sobrenome">
                
                <!-- Handle verification badges -->
                <div class="verification-indicator">
                  <span class="badge checking" *ngIf="isCheckingHandle()">
                    <lucide-icon name="refresh-cw" class="spin-icon"></lucide-icon> Verificando
                  </span>
                  <span class="badge success" *ngIf="handleForm.get('handle')?.valid && isHandleAvailable() === true">
                    <lucide-icon name="check-circle"></lucide-icon> Disponível
                  </span>
                  <span class="badge error" *ngIf="handleForm.get('handle')?.valid && isHandleAvailable() === false">
                    <lucide-icon name="alert-triangle"></lucide-icon> Em uso
                  </span>
                </div>
              </div>

              <!-- Handle errors -->
              <span class="error-msg text-error" *ngIf="handleForm.get('handle')?.touched && handleForm.get('handle')?.hasError('required')">
                O handle é obrigatório
              </span>
              <span class="error-msg text-error" *ngIf="handleForm.get('handle')?.hasError('pattern')">
                Apenas letras, números, underline (_) ou ponto (.)
              </span>
              <span class="error-msg text-error" *ngIf="handleForm.get('handle')?.hasError('minlength')">
                Mínimo de 3 caracteres
              </span>
            </div>
          </form>
        </div>

        <!-- Step 3: Avatar Preset -->
        <div class="step-content" *ngIf="step === 3">
          <div class="header-section">
            <h2>Escolha seu Avatar 🩺</h2>
            <p>Escolha o ícone que melhor te representa. Você poderá alterá-lo depois.</p>
          </div>

          <!-- Specialty grid -->
          <div class="specialties-grid scrollable avatar-grid">
            <div class="avatar-option-card" 
                 *ngFor="let item of getAllPresets()"
                 [class.active]="selectedAvatarId === item.id"
                 (click)="selectedAvatarId = item.id"
                 [title]="item.name">
              <app-avatar [presetId]="item.id" size="md"></app-avatar>
              <div class="check-indicator" *ngIf="selectedAvatarId === item.id">
                <lucide-icon name="check"></lucide-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="onboarding-actions">
          <button class="btn btn-secondary glass" 
                  *ngIf="step > 1" 
                  (click)="prevStep()">
            Voltar
          </button>
          <div class="spacer"></div>
          <button class="btn btn-primary" 
                  [disabled]="isNextDisabled()"
                  (click)="nextStep()">
            <span *ngIf="step < 3">Próximo</span>
            <span *ngIf="step === 3 && !savingProfile()">Concluir Cadastro 🎉</span>
            <span *ngIf="step === 3 && savingProfile()">Salvando...</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  step = 1;
  showSchools = false;
  selectedCategory = 'Clínica Médica';
  selectedAvatarId = 'clinica_geral';

  // Forms
  basicForm!: FormGroup;
  handleForm!: FormGroup;

  // Signal properties from NgRx store
  profileSignal = this.store.selectSignal(selectProfile);
  loadingSignal = this.store.selectSignal(selectLoading);
  handleCheckingSignal = this.store.selectSignal(selectHandleChecking);
  handleAvailabilitySignal = this.store.selectSignal(selectHandleAvailability);

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

  ngOnInit() {
    this.basicForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      isFormado: [false],
      semestre: ['', Validators.required],
      faculdade: ['', Validators.required]
    });

    this.basicForm.get('isFormado')?.valueChanges.subscribe(isFormado => {
      const semestreCtrl = this.basicForm.get('semestre');
      if (isFormado) {
        semestreCtrl?.clearValidators();
        semestreCtrl?.setValue('');
      } else {
        semestreCtrl?.setValidators([Validators.required]);
      }
      semestreCtrl?.updateValueAndValidity();
    });

    this.handleForm = this.fb.group({
      handle: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z0-9_.]+$')
      ]]
    });

    // Autocomplete filter
    this.basicForm.get('faculdade')?.valueChanges.subscribe(val => {
      if (!val) {
        this.filteredSchools = [];
      } else {
        const lowerVal = val.toLowerCase();
        this.filteredSchools = this.schoolsList.filter(s => s.toLowerCase().includes(lowerVal));
      }
    });

    // Debounced handle validation on-the-fly
    this.handleForm.get('handle')?.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(handle => {
      if (this.handleForm.get('handle')?.valid && handle) {
        this.store.dispatch(ProfileActions.checkHandle({ handle }));
      }
    });
  }

  showOnboarding(): boolean {
    // If loading the profile, hide modal
    if (this.loadingSignal() && !this.profileSignal()) {
      return false;
    }
    // Show onboarding only if user is logged in but doesn't have a profile yet
    return !this.profileSignal();
  }

  savingProfile(): boolean {
    return this.loadingSignal();
  }

  isCheckingHandle(): boolean {
    return this.handleCheckingSignal();
  }

  isHandleAvailable(): boolean | null {
    const res = this.handleAvailabilitySignal();
    return res ? res.disponivel : null;
  }

  getStepTitle(): string {
    switch (this.step) {
      case 1: return 'Informações Básicas';
      case 2: return 'Identidade Única';
      case 3: return 'Sua Especialidade';
      default: return '';
    }
  }

  getAllPresets(): AvatarPreset[] {
    return AVATAR_PRESETS;
  }

  selectSchool(school: string) {
    this.basicForm.get('faculdade')?.setValue(school);
    this.showSchools = false;
  }

  hideSchoolsList() {
    setTimeout(() => {
      this.showSchools = false;
    }, 200);
  }

  isNextDisabled(): boolean {
    if (this.step === 1) {
      return this.basicForm.invalid;
    }
    if (this.step === 2) {
      return this.handleForm.invalid || this.isHandleAvailable() !== true;
    }
    return false;
  }

  nextStep() {
    if (this.step < 3) {
      this.step++;
    } else {
      // Save profile!
      const profileData = {
        nomeCompleto: this.basicForm.value.nomeCompleto,
        isFormado: this.basicForm.value.isFormado,
        semestre: this.basicForm.value.isFormado ? null : Number(this.basicForm.value.semestre),
        faculdade: this.basicForm.value.faculdade,
        handle: this.handleForm.value.handle,
        avatarPresetId: this.selectedAvatarId
      };
      this.store.dispatch(ProfileActions.saveProfile({ profile: profileData }));
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }
}
