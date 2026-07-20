import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { AVATAR_PRESETS, AvatarPreset } from '@core/constants/avatar-presets';
import { ProfileActions } from '@store/profile/profile.actions';
import { selectProfile, selectLoading, selectHandleAvailability, selectHandleChecking } from '@store/profile/profile.reducer';
import { debounceTime, distinctUntilChanged, take } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';


/**
 * Angular component for the Onboarding feature.
 * @description Handles the presentation logic and user interactions for the Onboarding view.
 */
@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule, AvatarComponent, ButtonComponent],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private actions$ = inject(Actions);

  step = 1;
  showSchools = false;
  selectedCategory = 'Clínica Médica';
  selectedAvatarId = 'clinica_geral';

  selectedFile: File | null = null;
  selectedFilePreview: string | null = null;

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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('A imagem deve ter no máximo 10MB.');
        return;
      }
      this.selectedFile = file;
      this.selectedAvatarId = '';
      
      const reader = new FileReader();
      reader.onload = e => this.selectedFilePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }
  
  clearSelectedFile() {
    this.selectedFile = null;
    this.selectedFilePreview = null;
    this.selectedAvatarId = 'clinica_geral';
  }

  selectAvatar(id: string) {
    this.selectedFile = null;
    this.selectedFilePreview = null;
    this.selectedAvatarId = id;
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
        avatarPresetId: this.selectedAvatarId || 'clinica_geral'
      };
      
      this.store.dispatch(ProfileActions.saveProfile({ profile: profileData }));

      if (this.selectedFile) {
        this.actions$.pipe(
          ofType(ProfileActions.saveProfileSuccess),
          take(1)
        ).subscribe(() => {
          this.store.dispatch(ProfileActions.uploadProfilePicture({ file: this.selectedFile! }));
        });
      }
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }
}
