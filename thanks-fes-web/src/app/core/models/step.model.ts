export type Step =
  | ''
  | 'タイトル'
  | '名前登録'
  | '登録完了'
  | 'オープニング'
  | PeriodStep
  | '総合チームランキングタイトル'
  | '総合チームランキング'
  | '総合チーム成績'
  | '総合ランキングタイトル'
  | '総合ランキング'
  | '総合成績'
  | '景品発表'
  | '提供'
  | 'エンディング';

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
  periodNumber: number;
  questionNumber: number;
  step: Step;
  stepIndex: number;
};
