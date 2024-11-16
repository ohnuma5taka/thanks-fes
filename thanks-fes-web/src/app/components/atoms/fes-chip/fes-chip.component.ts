import { Component, Input } from '@angular/core';

export type ChipMode = 'success' | 'alert' | 'warn' | '';

@Component({
  selector: 'fes-chip',
  templateUrl: './fes-chip.component.html',
  styleUrls: ['./fes-chip.component.scss'],
})
export class FesChipComponent {
  @Input() elementId: string;
  @Input() label: string;
  @Input() mode: ChipMode = '';
  @Input() outlined = false;
  @Input() height = 20;

  get _class() {
    return [this.outlined ? 'outlined' : '', this.mode].join(' ');
  }

  get fontSize() {
    return this.height * 0.55;
  }
}
