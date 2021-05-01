import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition(':enter', [
    style({opacity: 0}), animate('150ms', style({opacity: 1}))]
  ),
  transition(':leave',
    [style({opacity: 1}), animate('150ms', style({opacity: 0}))]
  )
]);

export const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({opacity: 0}), stagger('10ms', animate('150ms ease-out', style({opacity: 1})))],
      {optional: true}
    )
  ])
]);
