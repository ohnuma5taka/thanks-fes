import { ReadItem } from '@/app/core/models/read-item.model';

const periodFirstItems: ReadItem[] = [
  {
    tag: 'lady',
    text: 'それでは早速最初のピリオドに移ります',
  },
];

const periodContinueItems: ReadItem[] = [
  {
    tag: 'lady',
    text: 'それでは続いてのピリオドです',
  },
];

const questionFirstItems: ReadItem[] = [
  {
    tag: 'lady',
    text: 'それでは早速問題です',
  },
];

const questionContinueItems: ReadItem[] = [
  {
    tag: 'lady',
    text: 'それでは続いての問題です',
  },
];

const questionReadyGoItems: ReadItem[] = [
  {
    tag: 'two',
    text: 'Ready Go！',
  },
];

const questionAnswerCheckItems: ReadItem[] = [
  {
    tag: 'lady',
    text: '(アイムアップまで待つ)',
  },
  {
    tag: 'lady',
    text: 'それでは皆さんの解答見てみましょう',
  },
  {
    tag: 'lady',
    text: 'Answer Check！',
  },
];

const questionOpenAnswerItems: ReadItem[] = [
  {
    tag: 'lady',
    text: '正解はこちら',
  },
];

const questionAnswerItems: ReadItem[] = [
  {
    tag: 'lady',
    text: '正解は〇〇でした',
  },
];

const questionVideoLeadItems: ReadItem[] = [
  {
    tag: 'lady',
    text: 'こちらは動画問題になっています',
  },
  {
    tag: 'lady',
    text: 'まずはこちらをご覧下さい',
  },
];

const questionVideoWaitItems: ReadItem[] = [
  {
    tag: 'lady',
    text: '(再生終了まで待つ)',
  },
];

const periodEndPersonalItems: ReadItem[] = [
  {
    tag: 'lady',
    text: 'ここでピリオド終了の鐘が鳴りました',
  },
  {
    tag: 'lady',
    text: 'この問題の正解者の中で一番回答が速かった方が優勝となります',
  },
  {
    tag: 'lady',
    text: 'それではランキングを見てみましょう',
  },
];

const periodEndTeamItems: ReadItem[] = [
  {
    tag: 'lady',
    text: 'ここでピリオド終了の鐘が鳴りました',
  },
  {
    tag: 'lady',
    text: 'このピリオドでの最もポイントの高いチームが優勝となります',
  },
  {
    tag: 'lady',
    text: 'それではランキングを見てみましょう',
  },
];

const periodEndNoAwardItems: ReadItem[] = [
  {
    tag: 'lady',
    text: 'ここでピリオド終了の鐘が鳴りました',
  },
  {
    tag: 'lady',
    text: 'ここでピリオド終了となります',
  },
];

export const readConstant = {
  periodFirstItems,
  periodContinueItems,
  questionFirstItems,
  questionContinueItems,
  questionReadyGoItems,
  questionAnswerCheckItems,
  questionAnswerItems,
  questionOpenAnswerItems,
  questionVideoLeadItems,
  questionVideoWaitItems,
  periodEndPersonalItems,
  periodEndTeamItems,
  periodEndNoAwardItems,
};
