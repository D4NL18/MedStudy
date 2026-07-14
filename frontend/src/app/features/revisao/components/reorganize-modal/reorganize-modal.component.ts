import { Component, EventEmitter, OnInit, Output, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { RevisionActions } from '@store/revision/revision.actions';
import { selectRedistributionDraft, selectIsRedistributing } from '@store/revision/revision.reducer';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { RedistributionDraftResponse } from '@core/models/revision.model';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LucideAngularModule, CheckCircle } from 'lucide-angular';

@Component({
  selector: 'app-reorganize-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxChartsModule, LucideAngularModule],
  templateUrl: './reorganize-modal.component.html',
  styleUrls: ['./reorganize-modal.component.scss']
})
export class ReorganizeModalComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  
  private store = inject(Store);
  private actions$ = inject(Actions);
  private dateSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  
  draft$: Observable<RedistributionDraftResponse | null> = this.store.select(selectRedistributionDraft);
  isRedistributing$: Observable<boolean> = this.store.select(selectIsRedistributing);
  
  maxDate: string = '';
  showSuccess = false;
  CheckCircle = CheckCircle;

  colorScheme: any = {
    domain: ['#f87171', '#4ade80'] // Tailwind red-400 for Before, green-400 for After
  };

  chartData$: Observable<any[]> = this.draft$.pipe(
    map(draft => {
      if (!draft || !draft.dailyLoads) return [];
      return draft.dailyLoads.map(load => ({
        name: this.formatDate(load.date),
        series: [
          { name: 'Antes', value: load.originalCount },
          { name: 'Depois', value: load.newCount }
        ]
      }));
    })
  );

  ngOnInit(): void {
    this.store.dispatch(RevisionActions.clearRedistributionDraft());
    
    this.dateSubject.pipe(
      debounceTime(400),
      takeUntil(this.destroy$)
    ).subscribe(newDate => {
      this.maxDate = newDate;
      this.preview();
    });

    this.actions$.pipe(
      ofType(RevisionActions.applyRedistributionSuccess),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.showSuccess = true;
      setTimeout(() => this.closeModal(), 2000);
    });
  }

  ngOnDestroy(): void {
    this.dateSubject.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private formatDate(dateStr: string): string {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }
    return dateStr;
  }

  getChartWidth(dailyLoads: any[] | undefined): number {
    const numDays = dailyLoads ? dailyLoads.length : 0;
    // Base width (modal width) is ~700px. If we have more than 14 days, give each day 50px space so it scrolls.
    return Math.max(700, numDays * 50);
  }

  preview(): void {
    if (!this.maxDate) return;
    this.store.dispatch(RevisionActions.previewRedistribution({
      request: { targetEndDate: this.maxDate }
    }));
  }

  onMaxDateChange(newDate: string): void {
    this.dateSubject.next(newDate);
  }

  applyDraft(): void {
    import('rxjs').then(({ take }) => {
      this.draft$.pipe(take(1)).subscribe(draft => {
        if (draft && draft.draftId) {
          this.store.dispatch(RevisionActions.applyRedistribution({ draftId: draft.draftId }));
        }
      });
    });
  }

  closeModal(): void {
    this.store.dispatch(RevisionActions.clearRedistributionDraft());
    this.close.emit();
  }
}
