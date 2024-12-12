import { Period } from '@/app/core/models/period.model';
import { PeriodStep, QuestionStep, Step } from '@/app/core/models/step.model';

const questionSteps: QuestionStep[] = [
  '問題開始',
  '動画再生',
  '解答開始',
  '解答結果',
  '解答開示',
];

const teamRankingSteps: Step[] = [
  '総合チームランキングタイトル',
  '総合チームランキング',
  '総合チーム成績',
];

export const createSteps = (periods: Period[]): Step[] => {
  const periodSteps: PeriodStep[] = periods
    .map((period, i) => [
      'ピリオド開始',
      'ピリオド説明',
      ...period.questions.reduce(
        (ret, question) => [
          ...ret,
          ...questionSteps.filter(
            (x) => x !== '動画再生' || question.questionFormat === '動画'
          ),
        ],
        []
      ),
      'ピリオド終了',
      ...(period.awardCount ? ['ピリオドランキング', 'ピリオド成績'] : []),
    ])
    .reduce((ret, x) => [...ret, ...x], []);
  return [
    '',
    'タイトル',
    'オープニング',
    ...periodSteps,
    ...(periods.some((x) => x.panelistType === 'チーム' && x.awardCount)
      ? teamRankingSteps
      : []),
    '総合ランキングタイトル',
    '総合ランキング',
    '総合成績',
    '景品発表',
    '提供',
    'エンディング',
  ];
};
