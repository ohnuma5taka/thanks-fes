import { jsonUtil } from '@/app/core/utils/json.util';
import { sleep } from '@/app/core/utils/time.util';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatSelect } from '@angular/material/select';

export type SelectOptionGroup<T> = {
  label: string;
  value?: string;
  options?: SelectOption<T>[];
};

export type SelectOption<T> = {
  label: string;
  disabled?: boolean;
  value: T;
};

@Component({
  selector: 'fes-select',
  templateUrl: './fes-select.component.html',
  styleUrls: ['./fes-select.component.scss'],
})
export class FesSelectComponent<T> {
  @Input() elementId: string;
  @Input() label = '';
  @Input() value: T;
  @Input() placeholder = '';
  @Input() optionGroups?: SelectOptionGroup<T>[] = [];
  @Input() options?: SelectOption<T>[] = [];
  @Input() clearable = false;
  @Input() disabled = false;
  @Output() select = new EventEmitter<T>();
  @ViewChild('selectRef') selectRef: MatSelect;

  constructor() {}

  get valued() {
    return typeof this.value === 'object' &&
      this.value !== null &&
      'value' in this.value
      ? this.value['value']
      : this.value;
  }

  ngOnInit() {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      await sleep(1); // wait until dom element drawing is finished
      this.selectRef.options.forEach((data) => {
        if (jsonUtil.equals(data.value, this.value)) data.select();
        else data.deselect();
      });
    }
  }

  _select(v: T) {
    this.select.emit(v);
  }

  clear(e: Event) {
    e.stopPropagation();
    this._select('' as T);
  }
}
