import { Period } from '@/app/core/models/period.model';
import { PeriodStep, QuestionStep, Step } from '@/app/core/models/step.model';

const questionStep: QuestionStep[] = [
  '問題開始',
  '動画再生',
  '解答開始',
  '解答結果',
  '解答開示',
];

export const createSteps = (periods: Period[]): Step[] => {
  const periodSteps: PeriodStep[] = periods
    .map((period, i) => [
      'ピリオド開始',
      'ピリオド説明',
      ...period.questions.reduce(
        (ret, question) => [
          ...ret,
          ...questionStep.filter(
            (x) => x !== '動画再生' || question.questionFormat === '動画'
          ),
        ],
        []
      ),
      'ピリオド終了',
      ...(period.awardCount > 0 ? ['ピリオドランキング', 'ピリオド成績'] : []),
    ])
    .reduce((ret, x) => [...ret, ...x], []);
  return [
    'タイトル',
    'オープニング',
    ...periodSteps,
    '総合チームランキングタイトル',
    '総合チームランキング',
    '総合チーム成績',
    '総合個人ランキングタイトル',
    '総合個人ランキング',
    '総合個人成績',
  ];
};
