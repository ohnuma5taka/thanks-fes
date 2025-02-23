import { Question } from '@/app/core/models/question.model';
import { ReadItem } from '@/app/core/models/read-item.model';

export type PanelistType = '' | '個人' | 'チーム';

export type Period = {
  number: number;
  title: string;
  description: string;
  readText: string;
  readItems: ReadItem[];
  panelistType: PanelistType;
  awardCount: number;
  questions: Question[];
};
