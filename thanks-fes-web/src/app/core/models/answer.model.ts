export type Answer = {
  panelistId: number;
  questionId: number;
  answer: string;
  elapsedSecond: number;
};

export type TeamAnswer = {
  team: string;
  correctText?: string;
  correct: number;
};

export type GetAnswerCountRequest = {
  questionId: number;
};

export type GetCorrectRequest = {
  questionId: number;
  panelistId: number;
};

export type GetTeamAnswersRequest = {
  questionId: number;
};

export type PostAnswerTeamRequest = {
  questionId: number;
  teamAnswers: TeamAnswer[];
};

export type UpdateQuestionAnswerRequest = {
  id: number;
  answer: string;
};

export type AnswerCount = { [k: string]: number };
