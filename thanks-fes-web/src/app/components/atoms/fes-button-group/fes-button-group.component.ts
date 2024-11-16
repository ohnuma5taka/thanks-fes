import { ColorMode } from '@/app/core/models/color.model';
import { jsonUtil } from '@/app/core/utils/json.util';
import { SelectOption } from '@/app/components/atoms/fes-select/fes-select.component';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

export type GroupButton<T> = SelectOption<T> & {
  icon?: string;
  width?: number;
  disabled?: boolean;
};

@Component({
  selector: 'fes-button-group',
  templateUrl: './fes-button-group.component.html',
  styleUrls: ['./fes-button-group.component.scss'],
})
export class FesButtonGroupComponent<T> {
  @Input() elementId: string;
  @Input() buttons: GroupButton<T>[];
  @Input() value: T;
  @Input() wrap = false;
  @Input() wrapColumn: number;
  @Input() buttonGroupWidth: number;
  @Input() buttonHeight = 36;
  @Input() fontSize = 14;
  @Input() colorMode?: ColorMode;
  @Input() noBorder = false;
  @Input() borderRadius = 4;
  @Input() textWrap = false;
  @Output() change = new EventEmitter<T>();
  @ViewChild('buttonGroupRef') buttonGroupRef: ElementRef;

  constructor(private changeDetectionRef: ChangeDetectorRef) {}

  relativeButtonWidth = 0;

  ngOnInit() {
    this.colorMode = this.colorMode || 'primary';
  }

  ngAfterViewChecked() {
    if (this.relativeButtonWidth) return;
    const contentWidth =
      this.buttonGroupWidth || +this.buttonGroupRef.nativeElement.clientWidth;
    const columns = this.wrapColumn || this.buttons.length;
    const adjustOffset = this.wrap ? 0.25 : 0; // subtract 0.25px for adjust layout in case of wrapping
    this.relativeButtonWidth = contentWidth / columns - adjustOffset;
    this.changeDetectionRef.detectChanges();
  }

  getClass(button: GroupButton<T>) {
    return [
      this.colorMode,
      button.value === this.value ? 'active' : '',
      button.disabled ? 'disabled' : '',
    ].join(' ');
  }

  _change(button: GroupButton<T>) {
    if (button.disabled) return;
    if (jsonUtil.equals([button.value], [this.value])) return;
    this.change.emit(button.value);
  }
}
