import { Directive, ElementRef, HostListener, Renderer2, Input } from '@angular/core';


/**
 * Angular directive for Ripple.
 * @description Applies custom behavior or transformation to a host element.
 */
@Directive({
  selector: '[appRipple]',
  standalone: true
})
export class RippleDirective {
  @Input() appRippleDisabled: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    this.renderer.setStyle(this.el.nativeElement, 'overflow', 'hidden');
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.appRippleDisabled) return;

    const element = this.el.nativeElement;
    const circle = this.renderer.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    const rect = element.getBoundingClientRect();
    
    // Position the ripple at the click center
    const x = event.clientX - rect.left - radius;
    const y = event.clientY - rect.top - radius;

    this.renderer.setStyle(circle, 'width', `${diameter}px`);
    this.renderer.setStyle(circle, 'height', `${diameter}px`);
    this.renderer.setStyle(circle, 'left', `${x}px`);
    this.renderer.setStyle(circle, 'top', `${y}px`);
    this.renderer.addClass(circle, 'ripple-effect');

    const rippleElement = element.querySelector('.ripple-effect');
    if (rippleElement) {
      this.renderer.removeChild(element, rippleElement);
    }

    this.renderer.appendChild(element, circle);

    setTimeout(() => {
      this.renderer.removeChild(element, circle);
    }, 600); // 600ms matching the CSS animation
  }
}
