import { Component, Input } from '@angular/core';

@Component({
  selector: 'fes-loading',
  templateUrl: './fes-loading.component.html',
  styleUrls: ['./fes-loading.component.scss'],
})
export class FesLoadingComponent {
  @Input() loading = false;
  @Input() size = 32;
  constructor() {}

  ngOnInit() {}
}
