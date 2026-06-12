import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';


/**
 * Offline Page.
 * @description Provides offline page functionality.
 */
@Component({
  selector: 'app-offline-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './offline-page.html',
  styleUrls: ['./offline-page.scss']
})
export class OfflinePageComponent {}
