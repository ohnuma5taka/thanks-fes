import { Component } from '@angular/core';
import { StepWebsocket } from '@/app/core/ws/step.ws';
import { PanelistApi } from '@/app/core/api/panelist.api';
import { RegisteredPanelistCount } from '@/app/core/models/panelist.model';
import { Question, QuestionAnswer } from '@/app/core/models/question.model';
import { QuestionApi } from '@/app/core/api/question.api';
import { createSteps } from '@/app/core/constants/step.constant';
import { FesStep, Step } from '@/app/core/models/step.model';
import {
  UpdateQuestionAnswerRequest,
  TeamAnswer,
  PostAnswerTeamRequest,
} from '@/app/core/models/answer.model';
import { AnswerApi } from '@/app/core/api/answer.api';
import { PanelistWebsocket } from '@/app/core/ws/panelist.ws';
import { questionOptions } from '@/app/core/constants/question.constant';
import { SelectOption } from '@/app/components/atoms/fes-select/fes-select.component';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  registeredCounts: RegisteredPanelistCount[] = [];
  period = 0;
  questionNumber = 0;
  questions: Question[] = [];
  stepIndex = 0;
  steps: Step[] = [];
  teamAnswers: TeamAnswer[] = [];
  stepHistories: FesStep[] = [];
  teamAnswerSubmitted = false;
  answerSubmitted = false;
  answer: QuestionAnswer = '1';
  answerOptions: SelectOption<QuestionAnswer>[] = questionOptions.map(
    (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` as QuestionAnswer })
  );

  get questionIndex() {
    return this.questionNumber - 1;
  }

  get periodQuestions() {
    return this.questions.filter((x) => x.period === this.period);
  }

  get question() {
    return this.questions.find(
      (x) => x.period === this.period && x.index === this.questionNumber
    );
  }

  get step() {
    return this.steps[this.stepIndex];
  }

  get previousStep() {
    return this.stepHistories.slice(-1)[0]?.step || '×';
  }

  get nextStep() {
    return this.steps.length && this.stepIndex + 1 < this.steps.length
      ? this.steps[this.stepIndex + 1]
      : '×';
  }

  get periodLabel() {
    return !this.questions.length
      ? ''
      : this.questions.slice(-1)[0].period < this.period
      ? '終了'
      : !this.period
      ? '開始前'
      : this.period;
  }

  get questionLabel() {
    return !this.questions.length
      ? ''
      : this.periodLabel === '終了' ||
        this.step === 'ピリオドランキング' ||
        this.step === 'ピリオド成績'
      ? '終了'
      : !this.questionNumber
      ? '開始前'
      : `Q${this.questionNumber}(${
          this.question.panelistType
        })：${this.question.text.replace(/<br>/g, '')}`;
  }

  get totalRegisteredCount() {
    return this.registeredCounts.reduce((ret, x) => ret + x.count, 0);
  }

  constructor(
    private questionApi: QuestionApi,
    private panelistApi: PanelistApi,
    private answerApi: AnswerApi,
    private stepWebsocket: StepWebsocket,
    private panelistWebsocket: PanelistWebsocket
  ) {}

  ngOnInit() {
    this.fetchQuestions();
    this.fetchRegisteredCount();
    this.connectWebsocket();
  }

  panelistWebsocketCallback(data: RegisteredPanelistCount[]) {
    this.registeredCounts = data;
  }

  connectWebsocket() {
    this.stepWebsocket.connect();
    this.panelistWebsocket.callback = this.panelistWebsocketCallback.bind(this);
    this.panelistWebsocket.connect();
  }

  async fetchRegisteredCount() {
    this.registeredCounts = await this.panelistApi.getRegisteredCount();
  }

  async fetchQuestions() {
    this.questions = await this.questionApi.getAll();
    this.steps = createSteps(this.questions);
  }

  async fetchTeams() {
    const teams = await this.panelistApi.getTeams();
    this.teamAnswers = teams.map((team) => ({
      team,
      correctText: '',
      correct: 0,
    }));
  }

  async registerAnswer() {
    this.answerSubmitted = true;
    const body: UpdateQuestionAnswerRequest = {
      id: this.question.id,
      answer: this.answer,
    };
    await this.questionApi.updateAnswer(this.question.id, body);
  }

  async answerTeam() {
    const body: PostAnswerTeamRequest = {
      questionId: this.question.id,
      teamAnswers: this.teamAnswers.map((teamAnswer) => ({
        team: teamAnswer.team,
        correct: +teamAnswer.correctText,
      })),
    };
    await this.answerApi.answerTeams(body);
    this.teamAnswerSubmitted = true;
  }

  next() {
    const currentStep: FesStep = {
      period: this.period,
      question: this.questionNumber,
      step: this.step,
      stepIndex: this.stepIndex,
    };
    this.stepHistories.push(currentStep);
    this.stepIndex += 1;
    if (
      this.step === 'ピリオド開始' ||
      this.step === '総合チームランキングタイトル'
    ) {
      this.period += 1;
      this.questionNumber = 0;
    }
    if (this.step === '問題開始') this.questionNumber += 1;
    const fesStep: FesStep = {
      period: this.period,
      question: this.questionNumber,
      step: this.step,
      stepIndex: this.stepIndex,
    };
    this.stepWebsocket.send(fesStep);

    if (
      this.question &&
      !this.question.answer &&
      this.question.panelistType === '個人'
    )
      this.answerSubmitted = false;

    if (
      this.question &&
      !this.question.answer &&
      this.question.panelistType === 'チーム'
    ) {
      this.teamAnswerSubmitted = false;
      this.fetchTeams();
    }
  }

  back() {
    const previousStep = this.stepHistories.pop();
    this.period = previousStep.period;
    this.questionNumber = previousStep.question;
    this.stepIndex = previousStep.stepIndex;
    this.stepWebsocket.send(previousStep);
  }

  skip() {
    if (!window.confirm('ピリオド終了までスキップします')) return;
    this.stepIndex += this.steps.slice(this.stepIndex).indexOf('ピリオド終了');
    this.questionNumber = this.periodQuestions.length + 1;
    const fesStep: FesStep = {
      period: this.period,
      question: this.questionNumber,
      step: 'ピリオド終了',
      stepIndex: this.stepIndex,
    };
    this.stepWebsocket.send(fesStep);
  }
}
