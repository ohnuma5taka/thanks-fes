import { Question } from '@/app/core/models/question.model';
import { PeriodStep, QuestionStep, Step } from '@/app/core/models/step.model';

const questionStep: QuestionStep[] = [
  '問題開始',
  '動画再生',
  '解答開始',
  '解答結果',
  '解答開示',
];

const createPeriodSteps = (questions: Question[]): PeriodStep[] =>
  [
    'ピリオド開始',
    'ピリオド説明',
    ...questions.reduce(
      (ret, question) => [
        ...ret,
        ...questionStep.filter(
          (x) => x !== '動画再生' || question.questionFormat === '動画'
        ),
      ],
      []
    ),
    'ピリオド終了',
    ...(questions.some((x) => x.panelistType === '個人')
      ? ['ピリオドランキング', 'ピリオド成績']
      : []),
  ] as PeriodStep[];

export const createSteps = (questions: Question[]): Step[] => {
  const periodSteps: PeriodStep[] = questions
    .map((x) => x.period)
    .filter((x, i, self) => self.indexOf(x) === i)
    .map((period) =>
      createPeriodSteps(questions.filter((x) => x.period === period))
    )
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
