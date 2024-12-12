export type Answer = {
  panelistId: number;
  questionId: string;
  answer: string;
  elapsedSecond: number;
};

export type TeamAnswer = {
  team: string;
  correctText?: string;
  correct: number;
};

export type GetAnswerCountRequest = {
  questionId: string;
};

export type GetScoreRequest = {
  questionId: string;
  panelistId: number;
};

export type GetTeamAnswersRequest = {
  questionId: string;
};

export type PostAnswerTeamRequest = {
  questionId: string;
  teamAnswers: TeamAnswer[];
};

export type UpdateQuestionAnswerRequest = {
  questionId: string;
  answer: string;
};

export type AnswerCount = { [k: string]: number };
