import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '@core/services/analytics.service';
import { LucideAngularModule } from 'lucide-angular';


/**
 * Angular component for the Top Errors Ranking feature.
 * @description Handles the presentation logic and user interactions for the Top Errors Ranking view.
 */
@Component({
  selector: 'app-top-errors-ranking',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './top-errors-ranking.component.html',
  styleUrls: ['./top-errors-ranking.component.scss']
})
export class TopErrorsRankingComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);
  
  errors = signal<any[]>([]);
  loading = signal(true);
  period = signal('LAST_60_DAYS');

  ngOnInit() {
    this.loadData();
  }

  setPeriod(p: string) {
    this.period.set(p);
    this.loadData();
  }

  private loadData() {
    this.loading.set(true);
    this.analyticsService.getTopErrors(this.period()).subscribe(data => {
      this.errors.set(data);
      this.loading.set(false);
    });
  }
}
