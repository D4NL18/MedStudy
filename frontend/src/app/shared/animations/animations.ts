import { trigger, transition, style, animate, state } from '@angular/animations';


/**
 * Animations.
 * @description Provides animations functionality.
 */
export const fastFade = trigger('fastFade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('150ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('150ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0 }))
  ])
]);

export const slideInModal = trigger('slideInModal', [
  transition(':enter', [
    style({ transform: 'translateY(20px)', opacity: 0 }),
    animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(20px)', opacity: 0 }))
  ])
]);
