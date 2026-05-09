import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sentinel',
  standalone: true,
  templateUrl: './sentinel.component.html',
  styleUrl: './sentinel.component.scss'
})
export class SentinelComponent implements OnInit, OnDestroy {
  @ViewChild('sentinel', { static: true }) sentinel!: ElementRef;
  @Output() intersect = new EventEmitter<void>();
  @Input() disabled = false;

  private observer?: IntersectionObserver;

  ngOnInit() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.disabled) {
        this.intersect.emit();
      }
    }, {
      root: null,
      threshold: 0.1
    });

    this.observer.observe(this.sentinel.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
