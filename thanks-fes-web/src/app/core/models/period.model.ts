import { Question } from '@/app/core/models/question.model';

export type PanelistType = '' | '個人' | 'チーム';

export class Period {
  number: number;
  title: string;
  description: string;
  panelistType: PanelistType;
  point: number;
  awardCount: number;
  questions: Question[];
}