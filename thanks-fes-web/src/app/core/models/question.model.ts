import { Option } from '@/app/core/models/option.model';
import { ReadItem } from '@/app/core/models/read-item.model';

export type QuestionFormat = '' | '文字' | '画像' | '動画';

export type Question = {
  id: string;
  period: number;
  index: number;
  questionFormat: QuestionFormat;
  optionFormat: QuestionFormat;
  text: string;
  readText: string;
  readItems: ReadItem[];
  second: number;
  answer: string;
  point: number;
  options: Option[];
  timerFilePath?: string;
  file?: {
    width: number;
    height: number;
    questionPath: string;
    questionPreviewPath: string;
    answerPath: string;
  };
};

export type QuestionAnswerData = {
  id: number;
  answer: string;
};
