import { ModalLayoutComponent } from '@shared/components/modal-layout/modal-layout.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { CompetitionActions } from '@store/competition/competition.actions';
import { 
  selectCompetitions, 
  selectLoading, 
  selectCreating, 
  selectLeaderboards,
  selectError
} from '@store/competition/competition.reducer';
import { selectProfile } from '@store/profile/profile.reducer';
import { 
  Competition, 
  CompetitionType, 
  MetricType, 
  CompetitionStatus, 
  ParticipantStatus 
} from '@core/models/competition.model';
import { SocialService, SocialProfile } from '@core/services/social.service';
import { ToastService } from '@core/services/toast.service';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';

@Component({
  selector: 'app-competicoes',
  standalone: true,
  imports: [ButtonComponent, ModalLayoutComponent, 
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    NgxChartsModule,
    AvatarComponent
  ],
  templateUrl: './competicoes.component.html',
  styleUrl: './competicoes.component.scss'
})
export class CompeticoesComponent implements OnInit {
  private store = inject(Store);
  private socialService = inject(SocialService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  private wasCreating = false;

  // Selectors from Store
  competitions = this.store.selectSignal(selectCompetitions);
  loading = this.store.selectSignal(selectLoading);
  creating = this.store.selectSignal(selectCreating);
  leaderboards = this.store.selectSignal(selectLeaderboards);
  profile = this.store.selectSignal(selectProfile);

  // Component Signals
  activeTab = signal<'active' | 'duels' | 'invites'>('active');
  friends = signal<SocialProfile[]>([]);
  selectedCompetitionId = signal<string | null>(null);
  showCreateModal = signal<boolean>(false);

  // Form Group
  competitionForm!: FormGroup;

  // Selected friends for the competition
  selectedFriendIds = signal<string[]>([]);

  // Chart configuration
  colorScheme: Color = {
    name: 'premiumDark',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#a855f7', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6']
  };

  // helper computed properties
  myUserId = computed(() => this.profile()?.userId || '');

  activeGroups = computed(() => 
    this.competitions().filter(c => 
      c.competitionType === CompetitionType.GROUP && 
      this.isMeAccepted(c)
    )
  );

  activeDuels = computed(() => 
    this.competitions().filter(c => 
      (c.competitionType === CompetitionType.DUEL_TIME || c.competitionType === CompetitionType.DUEL_TARGET) && 
      this.isMeAccepted(c)
    )
  );

  pendingInvites = computed(() => 
    this.competitions().filter(c => 
      this.isMeInvited(c)
    )
  );

  selectedCompetition = computed(() => {
    const id = this.selectedCompetitionId();
    if (!id) return null;
    return this.competitions().find(c => c.id === id) || null;
  });

  selectedLeaderboard = computed(() => {
    const id = this.selectedCompetitionId();
    if (!id) return [];
    return this.leaderboards()[id] || [];
  });

  podium = computed(() => {
    const list = this.selectedLeaderboard();
    if (!list || list.length === 0) return [];
    
    // Sorted by position
    const sorted = [...list].sort((a, b) => a.position - b.position);
    
    // We want to arrange them visually: 2nd place on left, 1st place in middle, 3rd place on right.
    const result = [];
    const first = sorted.find(x => x.position === 1);
    const second = sorted.find(x => x.position === 2);
    const third = sorted.find(x => x.position === 3);

    if (second) result.push({ ...second, podiumClass: 'second' });
    if (first) result.push({ ...first, podiumClass: 'first' });
    if (third) result.push({ ...third, podiumClass: 'third' });

    return result;
  });

  chartData = computed(() => {
    const list = this.selectedLeaderboard();
    if (!list || list.length === 0) return [];
    return list.map(item => ({
      name: item.name,
      value: item.score
    }));
  });

  constructor() {
    effect(() => {
      const isCreating = this.creating();
      if (isCreating) {
        this.wasCreating = true;
      } else if (this.wasCreating && this.showCreateModal()) {
        const error = this.store.selectSignal(selectError)();
        if (!error) {
          this.showCreateModal.set(false);
        }
        this.wasCreating = false;
      }
    });

    // Side-effect to auto-load leaderboard when a competition is selected
    effect(() => {
      const id = this.selectedCompetitionId();
      if (id) {
        this.store.dispatch(CompetitionActions.loadLeaderboard({ id }));
      }
    });

    // Auto-select first active competition if available
    effect(() => {
      const activeG = this.activeGroups();
      const activeD = this.activeDuels();
      const currentSelected = this.selectedCompetitionId();
      
      if (!currentSelected) {
        if (this.activeTab() === 'active' && activeG.length > 0) {
          this.selectedCompetitionId.set(activeG[0].id);
        } else if (this.activeTab() === 'duels' && activeD.length > 0) {
          this.selectedCompetitionId.set(activeD[0].id);
        }
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(CompetitionActions.loadCompetitions());
    this.loadFriends();
    this.initForm();
  }

  initForm() {
    this.competitionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      competitionType: [CompetitionType.GROUP, Validators.required],
      metricType: [MetricType.TOTAL_QUESTIONS, Validators.required],
      targetValue: [null],
      startDate: [new Date().toISOString().substring(0, 10), Validators.required],
      endDate: [new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10), Validators.required]
    });

    // Handle conditional validation for DUEL_TARGET
    this.competitionForm.get('competitionType')?.valueChanges.subscribe(type => {
      const targetControl = this.competitionForm.get('targetValue');
      if (type === CompetitionType.DUEL_TARGET) {
        targetControl?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        targetControl?.clearValidators();
        targetControl?.setValue(null);
      }
      targetControl?.updateValueAndValidity();
    });
  }

  loadFriends() {
    this.socialService.getFriends().subscribe({
      next: (friends) => this.friends.set(friends),
      error: () => this.toastService.error('Erro ao buscar lista de amigos.')
    });
  }

  isMeAccepted(c: Competition): boolean {
    const myId = this.myUserId();
    if (!myId) return false;
    const participant = c.participants.find(p => p.userId === myId);
    return participant?.status === ParticipantStatus.ACCEPTED;
  }

  isMeInvited(c: Competition): boolean {
    const myId = this.myUserId();
    if (!myId) return false;
    const participant = c.participants.find(p => p.userId === myId);
    return participant?.status === ParticipantStatus.INVITED;
  }

  changeTab(tab: 'active' | 'duels' | 'invites') {
    this.activeTab.set(tab);
    this.selectedCompetitionId.set(null);
    
    // Auto-select first card in the new tab
    if (tab === 'active' && this.activeGroups().length > 0) {
      this.selectedCompetitionId.set(this.activeGroups()[0].id);
    } else if (tab === 'duels' && this.activeDuels().length > 0) {
      this.selectedCompetitionId.set(this.activeDuels()[0].id);
    }
  }

  selectCompetition(id: string) {
    this.selectedCompetitionId.set(id);
  }

  toggleFriendSelection(friendId: string) {
    const current = this.selectedFriendIds();
    if (current.includes(friendId)) {
      this.selectedFriendIds.set(current.filter(id => id !== friendId));
    } else {
      this.selectedFriendIds.set([...current, friendId]);
    }
  }

  openCreateModal() {
    this.showCreateModal.set(true);
    this.selectedFriendIds.set([]);
    this.initForm();
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  onCreateSubmit() {
    if (this.competitionForm.invalid) {
      this.toastService.error('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const value = this.competitionForm.value;
    const friendIds = this.selectedFriendIds();

    if (friendIds.length === 0) {
      this.toastService.error('Você precisa convidar pelo menos 1 amigo.');
      return;
    }

    if (value.competitionType !== CompetitionType.GROUP && friendIds.length > 1) {
      this.toastService.error('Duelos 1v1 suportam apenas 1 oponente.');
      return;
    }

    const request = {
      ...value,
      invitedFriendIds: friendIds
    };

    this.store.dispatch(CompetitionActions.createCompetition({ request }));
  }

  acceptInvite(id: string, event: Event) {
    event.stopPropagation();
    this.store.dispatch(CompetitionActions.acceptInvite({ id }));
  }

  declineInvite(id: string, event: Event) {
    event.stopPropagation();
    if (confirm('Deseja realmente recusar este convite?')) {
      this.store.dispatch(CompetitionActions.declineInvite({ id }));
    }
  }

  getMetricLabel(type: MetricType): string {
    return type === MetricType.TOTAL_QUESTIONS ? 'Questões Feitas' : 'Questões Corretas';
  }

  getTypeLabel(type: CompetitionType): string {
    if (type === CompetitionType.GROUP) return 'Grupo';
    if (type === CompetitionType.DUEL_TIME) return 'Duelo de Tempo';
    return 'Duelo de Meta';
  }

  getCompetitionStatusLabel(status: CompetitionStatus): string {
    if (status === CompetitionStatus.PENDING) return 'Aguardando Início';
    if (status === CompetitionStatus.ACTIVE) return 'Em Andamento';
    return 'Concluído';
  }
}
