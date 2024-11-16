import { FesButtonGroupComponent } from '@/app/components/atoms/fes-button-group/fes-button-group.component';
import { FesButtonComponent } from '@/app/components/atoms/fes-button/fes-button.component';
import { FesChipComponent } from '@/app/components/atoms/fes-chip/fes-chip.component';
import { FesConfirmDialogComponent } from '@/app/components/atoms/fes-confirm-dialog/fes-confirm-dialog.component';
import { FesInputComponent } from '@/app/components/atoms/fes-input/fes-input.component';
import { FesLabelValueComponent } from '@/app/components/atoms/fes-label-value/fes-label-value.component';
import { FesSelectComponent } from '@/app/components/atoms/fes-select/fes-select.component';
import { FesTextareaComponent } from '@/app/components/atoms/fes-textarea/fes-textarea.component';
import { MaterialModule } from '@/app/components/material.module';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FesLoadingComponent } from '@/app/components/atoms/fes-loading/fes-loading.component';
import { QuestionComponent } from '@/app/components/pages/question/question.component';
import { PanelistComponent } from '@/app/components/pages/panelist/panelist.component';
import { AdminComponent } from '@/app/components/pages/admin/admin.component';

const components: (any[] | Type<any>)[] = [
  AdminComponent,
  QuestionComponent,
  PanelistComponent,
  FesButtonComponent,
  FesButtonGroupComponent,
  FesChipComponent,
  FesConfirmDialogComponent,
  FesInputComponent,
  FesLabelValueComponent,
  FesLoadingComponent,
  FesSelectComponent,
  FesTextareaComponent,
];

@NgModule({
  declarations: components,
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule],
  exports: components,
})
export class ComponentModule {}
