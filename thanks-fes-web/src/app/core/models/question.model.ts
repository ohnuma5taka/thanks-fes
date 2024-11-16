import { SelectOption } from '@/app/components/atoms/fes-select/fes-select.component';
import { ColorMode } from '@/app/core/models/color.model';
import { QuestionStep } from '@/app/core/models/step.model';

export class Period {
  number: number;
  questions: Question[];
}

export class QuestionStatus {
  period: number;
  index: number;
  step: QuestionStep;
}

export type QuestionFormat = '' | '画像' | '文字';
export type QuestionPanelistType = '' | '個人' | 'チーム';

export type QuestionAnswer = '' | '1' | '2' | '3' | '4';

export type QuestionOption = {
  value: QuestionAnswer;
  text: string;
  imageOriginX: number;
  imageOriginY: number;
  imageScale: number;
  transform?: string;
};

export type Question = {
  id: number;
  period: number;
  index: number;
  panelistType: QuestionPanelistType;
  format: QuestionFormat;
  text: string;
  file: string;
  filePath?: string;
  second: number;
  answer: QuestionAnswer;
  point: number;
  options: QuestionOption[];
};

export type QuestionAnswerData = {
  id: number;
  answer: QuestionAnswer;
};
