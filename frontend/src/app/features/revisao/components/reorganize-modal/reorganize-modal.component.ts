import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RevisionActions } from '@store/revision/revision.actions';
import { selectRedistributionDraft, selectIsRedistributing } from '@store/revision/revision.reducer';
import { Observable } from 'rxjs';
import { RedistributionDraftResponse } from '@core/models/revision.model';

@Component({
  selector: 'app-reorganize-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reorganize-modal.component.html',
  styleUrls: ['./reorganize-modal.component.scss']
})
export class ReorganizeModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  
  private store = inject(Store);
  
  draft$: Observable<RedistributionDraftResponse | null> = this.store.select(selectRedistributionDraft);
  isRedistributing$: Observable<boolean> = this.store.select(selectIsRedistributing);
  
  maxDate: string = '';

  ngOnInit(): void {
    // Initial preview without maxDate
    this.preview();
  }

  preview(): void {
    this.store.dispatch(RevisionActions.previewRedistribution({
      request: this.maxDate ? { maxDate: this.maxDate } : {}
    }));
  }

  onMaxDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.maxDate = input.value;
    this.preview();
  }

  apply(draftId: string): void {
    this.store.dispatch(RevisionActions.applyRedistribution({ draftId }));
    this.closeModal();
  }

  closeModal(): void {
    this.store.dispatch(RevisionActions.clearRedistributionDraft());
    this.close.emit();
  }
}
