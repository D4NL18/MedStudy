import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectTopicAnalytics, selectAnalyticsLoading } from '@store/analytics/analytics.selectors';
import { loadTopicAnalytics } from '@store/analytics/analytics.actions';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';


/**
 * Angular component for the Analise Tema feature.
 * @description Handles the presentation logic and user interactions for the Analise Tema view.
 */
@Component({
  selector: 'app-analise-tema',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './analise-tema.component.html',
  styleUrl: './analise-tema.component.scss'
})
export class AnaliseTemaComponent implements OnInit {
  private store = inject(Store);
  
  topics = this.store.selectSignal(selectTopicAnalytics);
  loading = this.store.selectSignal(selectAnalyticsLoading);

  pageIndex = signal(0);
  pageSize = signal(10);

  paginatedTopics = computed(() => {
    const all = this.topics() || [];
    const start = this.pageIndex() * this.pageSize();
    return all.slice(start, start + this.pageSize());
  });

  ngOnInit() {
    this.store.dispatch(loadTopicAnalytics());
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  getAccClass(acc: number | undefined | null) {
    if (acc === undefined || acc === null) return 'bg-gray-500';
    if (acc >= 80) return 'bg-high';
    if (acc >= 70) return 'bg-mid';
    return 'bg-low';
  }
}
