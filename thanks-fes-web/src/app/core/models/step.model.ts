export type Step =
  | 'タイトル'
  | 'オープニング'
  | PeriodStep
  | '総合チームランキングタイトル'
  | '総合チームランキング'
  | '総合チーム成績'
  | '総合個人ランキングタイトル'
  | '総合個人ランキング'
  | '総合個人成績';

export type PeriodStep =
  | 'ピリオド開始'
  | 'ピリオド説明'
  | QuestionStep
  | 'ピリオド終了'
  | 'ピリオドランキング'
  | 'ピリオド成績';

export type QuestionStep =
  | '問題開始'
  | '動画再生'
  | '解答開始'
  | '解答結果'
  | '解答開示';

export type FesStep = {
  period: number;
  question: number;
  step: Step;
  stepIndex: number;
};
