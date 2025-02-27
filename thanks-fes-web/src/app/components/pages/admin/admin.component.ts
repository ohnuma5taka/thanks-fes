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
import { env } from '@/environments/env';
import { StoreService } from '@/app/core/services/store.service';
import { Question } from '@/app/core/models/question.model';
import { SelectOption } from '@/app/components/atoms/fes-select/fes-select.component';
import { readConstant } from '@/app/core/constants/read.constant';
import { mediaUtil } from '@/app/core/utils/media.util';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  registeredCounts: RegisteredPanelistCount[] = [];
  period: Period;
  questions: Question[] = [];
  question: Question;
  options: SelectOption<string>[] = [];
  periodNumber = 0;
  questionNumber = 0;
  periods: Period[] = [];
  stepIndex = 0;
  steps: Step[] = [];
  teamAnswers: TeamAnswer[] = [];
  stepHistories: FesStep[] = [];
  answer = '';
  isSp = mediaUtil.isSp;

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

  get noPanelistAnswer() {
    return (
      this.question &&
      !this.question.answer &&
      this.period.panelistType === '個人' &&
      this.step === '解答結果'
    );
  }

  get noTeamAnswer() {
    return (
      this.question &&
      !this.question.answer &&
      this.period.panelistType === 'チーム' &&
      this.step === '解答開始'
    );
  }

  get readItems() {
    if (!this.period) return [];
    return this.step === 'タイトル'
      ? readConstant.titleItems
      : this.step === 'オープニング'
      ? [...this.period.readItems, ...readConstant.openingItems]
      : this.step === 'ピリオド開始' || this.step === 'ピリオド説明'
      ? [
          ...(this.periodNumber === 1
            ? readConstant.periodFirstItems
            : readConstant.periodContinueItems),
          ...this.period.readItems,
        ]
      : this.step === '問題開始'
      ? [
          ...(this.questionNumber === 1
            ? readConstant.questionFirstItems
            : readConstant.questionContinueItems),
          ...(this.question.questionFormat === '動画'
            ? readConstant.questionVideoLeadItems
            : [
                ...this.question.readItems,
                ...readConstant.questionReadyGoItems,
              ]),
        ]
      : this.step === '動画再生'
      ? [...readConstant.questionVideoWaitItems, ...this.question.readItems]
      : this.step === '解答開始'
      ? readConstant.questionAnswerCheckItems
      : this.step === '解答結果'
      ? readConstant.questionOpenAnswerItems
      : this.step === '解答開示'
      ? readConstant.questionAnswerItems
      : this.step === 'ピリオド終了'
      ? !this.period.awardCount
        ? readConstant.periodEndNoAwardItems
        : this.period.panelistType === '個人'
        ? readConstant.periodEndPersonalItems
        : readConstant.periodEndTeamItems
      : [];
  }

  constructor(
    private store: StoreService,
    private periodApi: PeriodApi,
    private questionApi: QuestionApi,
    private panelistApi: PanelistApi,
    private answerApi: AnswerApi,
    private stepWebsocket: StepWebsocket,
    private panelistWebsocket: PanelistWebsocket
  ) {}

  async ngOnInit() {
    await Promise.all([
      this.fetchPeriods(),
      this.fetchRegisteredCount(),
      this.connectWebsocket(),
    ]);
    const fesStep = await this.store.getters.fesStep();
    [...Array(fesStep.stepIndex || 0)].forEach((_) => this.next());
    this.sendStep();
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
    const body: UpdateQuestionAnswerRequest = {
      questionId: this.question.id,
      answer: this.answer,
    };
    await this.questionApi.updateAnswer(this.question.id, body);
    this.question.answer = '1';
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
    this.question.answer = '1';
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
      this.step === '総合チームランキングタイトル' ||
      this.step === '総合ランキングタイトル'
    ) {
      this.periodNumber += 1;
      this.questionNumber = 0;
    }
    if (this.step === '問題開始') this.questionNumber += 1;
  }

  back() {
    const previousStep = this.stepHistories.pop();
    this.periodNumber = previousStep.periodNumber;
    this.questionNumber = previousStep.questionNumber;
    this.stepIndex = previousStep.stepIndex;
    this.sendStep();
    if (this.step === '問題開始')
      this.answerApi.deleteQuestionAnswer(this.question.id);
  }

  backToInit() {
    if (env.mode === 'prod') {
      if (!window.confirm('最初に戻ります')) return;
    } else {
      this.answerApi.deleteAll();
    }
    this.stepIndex = 0;
    this.periodNumber = 0;
    this.questionNumber = 0;
    this.sendStep();
  }

  skip() {
    if (!window.confirm('ピリオド終了までスキップします')) return;
    this.stepIndex += this.steps.slice(this.stepIndex).indexOf('ピリオド終了');
    this.questionNumber = this.questions.length;
    this.sendStep();
  }

  sendStep() {
    this.period = this.periods.find((x) => x.number === this.periodNumber);
    this.questions = this.period?.questions || [];
    this.question = this.questions.find((x) => x.index === this.questionNumber);
    this.options =
      this.question?.options.map((x) => ({
        label: x.value,
        value: x.value,
      })) || [];
    if (
      this.question &&
      !this.question.answer &&
      this.period.panelistType === 'チーム'
    ) {
      this.fetchTeams();
    }
    const fesStep: FesStep = {
      periodNumber: this.periodNumber,
      questionNumber: this.questionNumber,
      step: this.step,
      stepIndex: this.stepIndex,
    };
    this.stepWebsocket.send(fesStep);
    this.store.setters.fesStep(fesStep);
  }
}
