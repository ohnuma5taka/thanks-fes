import { Option } from '@/app/core/models/option.model';

export type QuestionFormat = '' | '文字' | '画像' | '動画';

export class Question {
  id: number;
  period: number;
  index: number;
  questionFormat: QuestionFormat;
  optionFormat: QuestionFormat;
  text: string;
  second: number;
  answer: string;
  options: Option[];
  timerFilePath?: string;
  file?: {
    width: number;
    height: number;
    questionPath: string;
    answerPath: string;
  };

  constructor(params: Question) {
    this.id = params.id;
    this.period = params.period;
    this.index = params.index;
    this.questionFormat = params.questionFormat;
    this.optionFormat = params.optionFormat;
    this.text = params.text.replace(/\\n/g, '<br>');
    this.second = params.second;
    this.answer = params.answer;
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
        questionPath: `/assets/questions/${this.id}/question${ext}`,
        answerPath: `/assets/questions/${this.id}/answer${ext}`,
        width: 0,
        height: 0,
      };
    }
  }
}

export type QuestionAnswerData = {
  id: number;
  answer: string;
};
