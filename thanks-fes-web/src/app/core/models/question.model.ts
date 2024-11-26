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

export type QuestionFormat = '' | '文字' | '画像' | '動画';

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

export class Question {
  id: number;
  qid: number;
  period: number;
  index: number;
  panelistType: QuestionPanelistType;
  questionFormat: QuestionFormat;
  optionFormat: QuestionFormat;
  text: string;
  second: number;
  answer: QuestionAnswer;
  point: number;
  options: QuestionOption[];
  timerFilePath?: string;
  file?: {
    width: number;
    height: number;
    questionPath: string;
    answerPath: string;
  };

  constructor(params: Question) {
    this.id = params.id;
    this.qid = params.qid;
    this.period = params.period;
    this.index = params.index;
    this.panelistType = params.panelistType;
    this.questionFormat = params.questionFormat;
    this.optionFormat = params.optionFormat;
    this.text = params.text.replace(/\\n/g, '<br>');
    this.second = params.second;
    this.answer = params.answer;
    this.point = params.point;
    this.options = params.options.map((x) => ({
      ...x,
      transform: `translate(${x.imageOriginX * 100 - 50}%, ${
        x.imageOriginY * 100 - 50
      }%) scale(${x.imageScale})`,
    }));
    this.timerFilePath = `/assets/videos/timer/${this.second}.mp4`;
    if (this.questionFormat !== '文字') {
      const ext = this.questionFormat === '動画' ? '.mp4' : '.png';
      this.file = {
        questionPath: `/assets/questions/${this.qid}/question${ext}`,
        answerPath: `/assets/questions/${this.qid}/answer${ext}`,
        width: 0,
        height: 0,
      };
    }
  }
}

export type QuestionAnswerData = {
  id: number;
  answer: QuestionAnswer;
};
