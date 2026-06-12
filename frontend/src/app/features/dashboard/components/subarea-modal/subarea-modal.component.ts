import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { AnalyticsService } from '@core/services/analytics.service';
import { PerformanceThemeService } from '@core/services/performance-theme.service';
import { AreaAnalytics } from '@store/dashboard/dashboard.actions';
import { ModalLayoutComponent } from '@shared/components/modal-layout/modal-layout.component';


/**
 * Angular component for the Subarea Modal feature.
 * @description Handles the presentation logic and user interactions for the Subarea Modal view.
 */
@Component({
  selector: 'app-subarea-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, LucideAngularModule, ModalLayoutComponent],
  templateUrl: './subarea-modal.component.html',
  styleUrls: ['./subarea-modal.component.scss']
})
export class SubareaModalComponent implements OnInit {
  topics: any[] = [];
  loading = true;
  perfTheme = inject(PerformanceThemeService);
  private analyticsService = inject(AnalyticsService);

  constructor(
    public dialogRef: MatDialogRef<SubareaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { area: AreaAnalytics }
  ) {}

  ngOnInit() {
    this.analyticsService.getTopicAnalytics().subscribe(allTopics => {
      this.topics = allTopics.filter(t => t.grandeArea === this.data.area.grandeArea);
      this.loading = false;
    });
  }
}
