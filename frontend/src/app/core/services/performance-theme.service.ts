import { Injectable } from '@angular/core';

export type PerformanceLevel = 'LOW' | 'MEDIUM' | 'HIGH';

@Injectable({
  providedIn: 'root'
})
export class PerformanceThemeService {

  /**
   * Returns the color associated with a performance rate.
   * < 70%: Danger (Red)
   * 70% - 85%: Warning (Yellow)
   * > 85%: Success (Green)
   */
  getColor(rate: number): string {
    if (rate < 70) return '#EF4444'; // Error/Red
    if (rate < 85) return '#F59E0B'; // Warning/Amber
    return '#10B981'; // Success/Emerald
  }

  /**
   * Returns the CSS class name for a performance level.
   */
  getClass(rate: number): string {
    if (rate < 70) return 'text-error';
    if (rate < 85) return 'text-warning';
    return 'text-success';
  }

  /**
   * Returns the performance level label.
   */
  getLevel(rate: number): PerformanceLevel {
    if (rate < 70) return 'LOW';
    if (rate < 85) return 'MEDIUM';
    return 'HIGH';
  }
}
