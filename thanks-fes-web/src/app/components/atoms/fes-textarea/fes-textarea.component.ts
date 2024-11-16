import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'fes-textarea',
  templateUrl: './fes-textarea.component.html',
  styleUrls: ['./fes-textarea.component.scss'],
})
export class FesTextareaComponent {
  @Input() elementId: string;
  @Input() dense = false;
  @Input() value = '';
  @Input() disabled = false;
  @Input() placeholder = '';
  @Input() autosize = false;
  @Output() emitInput = new EventEmitter<string>();
  @Output() submit = new EventEmitter<string>();
  @Output() blur = new EventEmitter();
  @ViewChild('textareaRef') textareaRef: ElementRef;
  constructor() {}

  passwordShowing = false;
  imeComposing = false;

  ngOnInit() {}

  ngAfterViewInit() {
    this.textareaRef.nativeElement.addEventListener(
      'input',
      (e: InputEvent) => {
        const imeTypes = [
          'insertCompositionText',
          'deleteCompositionText',
          'insertFromComposition',
          'deleteByComposition',
        ];
        this.imeComposing = imeTypes.includes(e.inputType);
      }
    );
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

  _blur() {
    this.blur.emit();
  }
}
