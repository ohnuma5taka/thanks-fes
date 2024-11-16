import { Component, Input } from '@angular/core';

@Component({
  selector: 'fes-label-value',
  templateUrl: './fes-label-value.component.html',
  styleUrls: ['./fes-label-value.component.scss'],
})
export class FesLabelValueComponent<T> {
  @Input() elementId: string;
  @Input() label: string;
  @Input() value: string;
  @Input() width: number;
}
