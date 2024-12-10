import { Component } from '@angular/core';
import { StepWebsocket } from '@/app/core/ws/step.ws';
import { PanelistApi } from '@/app/core/api/panelist.api';
import { RegisteredPanelistCount } from '@/app/core/models/panelist.model';
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
import { Period } from '@/app/core/models/period.model';
import { PeriodApi } from '@/app/core/api/period.api';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  registeredCounts: RegisteredPanelistCount[] = [];
  periodNumber = 0;
  questionNumber = 0;
  periods: Period[] = [];
  stepIndex = 0;
  steps: Step[] = [];
  teamAnswers: TeamAnswer[] = [];
  stepHistories: FesStep[] = [];
  teamAnswerSubmitted = false;
  answerSubmitted = false;
  answer = '';

  get period() {
    return this.periods.find((x) => x.number === this.periodNumber);
  }

  get questions() {
    return this.period?.questions || [];
  }

  get question() {
    return this.questions.find((x) => x.index === this.questionNumber);
  }

  get answerOptions() {
    return this.question.options.map((x) => ({
      label: x.value,
      value: x.value,
    }));
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
      : this.questions.slice(-1)[0].period < this.periodNumber
      ? '終了'
      : !this.periodNumber
      ? '開始前'
      : this.periodNumber;
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
      : `Q${this.questionNumber}(${this.period.panelistType})：${
          this.question?.text || ''
        }`;
  }

  get totalRegisteredCount() {
    return this.registeredCounts.reduce((ret, x) => ret + x.count, 0);
  }

  constructor(
    private periodApi: PeriodApi,
    private questionApi: QuestionApi,
    private panelistApi: PanelistApi,
    private answerApi: AnswerApi,
    private stepWebsocket: StepWebsocket,
    private panelistWebsocket: PanelistWebsocket
  ) {}

  ngOnInit() {
    this.fetchPeriods();
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

  async fetchPeriods() {
    this.periods = await this.periodApi.getAll();
    this.steps = createSteps(this.periods);
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
      periodNumber: this.periodNumber,
      questionNumber: this.questionNumber,
      step: this.step,
      stepIndex: this.stepIndex,
    };
    this.stepHistories.push(currentStep);
    this.stepIndex += 1;
    if (
      this.step === 'ピリオド開始' ||
      this.step === '総合チームランキングタイトル'
    ) {
      this.periodNumber += 1;
      this.questionNumber = 0;
    }
    if (this.step === '問題開始') this.questionNumber += 1;
    const fesStep: FesStep = {
      periodNumber: this.periodNumber,
      questionNumber: this.questionNumber,
      step: this.step,
      stepIndex: this.stepIndex,
    };
    this.stepWebsocket.send(fesStep);

    if (
      this.question &&
      !this.question.answer &&
      this.period.panelistType === '個人'
    )
      this.answerSubmitted = false;

    if (
      this.question &&
      !this.question.answer &&
      this.period.panelistType === 'チーム'
    ) {
      this.teamAnswerSubmitted = false;
      this.fetchTeams();
    }
  }

  back() {
    const previousStep = this.stepHistories.pop();
    this.periodNumber = previousStep.periodNumber;
    this.questionNumber = previousStep.questionNumber;
    this.stepIndex = previousStep.stepIndex;
    this.stepWebsocket.send(previousStep);
  }

  async clearAnswers() {
    this.answerApi.clearAll();
  }

  skip() {
    if (!window.confirm('ピリオド終了までスキップします')) return;
    const fesStep: FesStep = {
      periodNumber: this.periodNumber,
      questionNumber: this.questionNumber,
      step: 'ピリオド終了',
      stepIndex: this.stepIndex,
    };
    this.stepWebsocket.send(fesStep);
    this.stepIndex += this.steps.slice(this.stepIndex).indexOf('ピリオド終了');
    this.questionNumber = this.questions.length;
  }
}
