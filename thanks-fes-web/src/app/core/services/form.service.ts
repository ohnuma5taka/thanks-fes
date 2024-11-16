import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export type ValidationType =
  | 'required'
  | 'requiredTrue'
  | 'email'
  | 'pattern'
  | 'min'
  | 'max'
  | 'minlength'
  | 'maxlength'
  | 'matchSource'
  | 'match'
  | 'compose';

export type ValidationItem = {
  type: ValidationType;
  param?: any;
};

export type FormControlValidation = ValidationItem & {
  validations?: ValidationItem[];
  errorMessage: string;
};

export type FormControlConfig = {
  [key: string]: {
    initialValue?: any;
    validations: FormControlValidation[];
  };
};

export type FormValidation = {
  [key: string]: string;
};

@Injectable()
export class FormService {
  constructor(private formBuilder: FormBuilder) {}
  formGroup: FormGroup;
  _formValidation = {} as FormValidation;
  errorMessageMap: { [key: string]: Map<ValidationType, string> };

  get formValidation(): FormValidation {
    Object.keys(this.formGroup.controls).forEach((key) => {
      const control = this.formGroup.controls[key];
      const errorMessage =
        control.invalid && (control.touched || control.dirty) && control.errors
          ? this.errorMessageMap[key].get(
              Object.keys(control.errors)[0] as ValidationType
            )
          : '';
      this._formValidation[key] = errorMessage || '';
    });
    return this._formValidation;
  }

  init(config: FormControlConfig) {
    this.formGroup = this.formBuilder.group(
      Object.keys(config)
        .filter((key) => config[key])
        .reduce(
          (ret, key) =>
            Object.assign(ret, {
              [key]: new FormControl(
                config[key].initialValue,
                this.getValidations(config[key].validations)
              ),
            }),
          {}
        )
    );
    this.errorMessageMap = Object.keys(config).reduce(
      (ret, key) =>
        Object.assign(ret, {
          [key]: new Map(
            config[key].validations.map((validation) => [
              validation.type,
              validation.errorMessage,
            ])
          ),
        }),
      {}
    );
    return this.formGroup;
  }

  getValidations(validations: FormControlValidation[]): any {
    return validations
      .map((validation: FormControlValidation) => {
        switch (validation.type) {
          case 'required':
            return Validators.required;
          case 'requiredTrue':
            return Validators.requiredTrue;
          case 'pattern':
            return Validators.pattern(validation.param as RegExp);
          case 'min':
            return Validators.min(validation.param as number);
          case 'max':
            return Validators.max(validation.param as number);
          case 'minlength':
            return Validators.minLength(validation.param as number);
          case 'maxlength':
            return Validators.maxLength(validation.param as number);
          case 'matchSource':
            return this.matchValidator(validation.param as string, true);
          case 'match':
            return this.matchValidator(validation.param as string);
          case 'compose':
            return Validators.compose(
              this.getValidations(
                validation.validations as FormControlValidation[]
              )
            );
          default:
            return null;
        }
      })
      .filter((x) => !!x);
  }

  matchValidator(matchTo: string, reverse?: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.parent && reverse) {
        const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
        if (c) {
          c.updateValueAndValidity();
        }
        return null;
      }
      return !!control.parent &&
        !!control.parent.value &&
        control.value === (control.parent?.controls as any)[matchTo].value
        ? null
        : { match: true };
    };
  }
}
