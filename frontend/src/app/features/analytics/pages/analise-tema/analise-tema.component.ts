import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectTopicAnalytics, selectAnalyticsLoading } from '../../../../store/analytics/analytics.selectors';
import { loadTopicAnalytics } from '../../../../store/analytics/analytics.actions';

@Component({
  selector: 'app-analise-tema',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analise-tema.component.html',
  styleUrl: './analise-tema.component.scss'
})
export class AnaliseTemaComponent implements OnInit {
  private store = inject(Store);
  
  topics = this.store.selectSignal(selectTopicAnalytics);
  loading = this.store.selectSignal(selectAnalyticsLoading);

  ngOnInit() {
    this.store.dispatch(loadTopicAnalytics());
  }

  getAccClass(acc: number | undefined | null) {
    if (acc === undefined || acc === null) return 'bg-gray-500';
    if (acc >= 80) return 'bg-high';
    if (acc >= 70) return 'bg-mid';
    return 'bg-low';
  }
}
