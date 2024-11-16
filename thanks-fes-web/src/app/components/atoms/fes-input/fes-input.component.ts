import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'fes-input',
  templateUrl: './fes-input.component.html',
  styleUrls: ['./fes-input.component.scss'],
})
export class FesInputComponent {
  @Input() elementId: string;
  @Input() label = '';
  @Input() value = '';
  @Input() type: 'text' | 'password' | 'number' = 'text';
  @Input() placeholder = '';
  @Input() prefixIcon = '';
  @Input() prefixText = '';
  @Input() suffixIcon = '';
  @Input() suffixText = '';
  @Input() tooltip = '';
  @Input() clearable = false;
  @Input() disabled = false;
  @Output() emitInput = new EventEmitter<string>();
  @Output() submit = new EventEmitter<string>();
  @ViewChild('inputRef') inputRef: ElementRef;
  constructor() {}

  passwordShowing = false;
  imeComposing = false;

  ngOnInit() {}

  ngAfterViewInit() {
    this.inputRef.nativeElement.addEventListener('input', (e: InputEvent) => {
      const imeTypes = [
        'insertCompositionText',
        'deleteCompositionText',
        'insertFromComposition',
        'deleteByComposition',
      ];
      this.imeComposing = imeTypes.includes(e.inputType);
    });
  }

  checkMdiIcon(icon: string) {
    return icon.startsWith('mdi');
  }

  _input(v: string) {
    this.emitInput.emit(v);
  }

  _submit(v: string) {
    if (this.imeComposing) {
      this.imeComposing = false;
      return;
    }
    this.submit.emit(v);
  }

  clear(e: Event) {
    e.stopPropagation();
    this._input('');
  }
}
