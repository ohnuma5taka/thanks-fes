import { Component } from '@angular/core';
import NoSleep from 'nosleep.js';
import { StepWebsocket } from '@/app/core/ws/step.ws';
import { locationUtil } from '@/app/core/utils/location.util';
import { StoreService } from '@/app/core/services/store.service';
import { PanelistApi } from '@/app/core/api/panelist.api';
import { Panelist } from '@/app/core/models/panelist.model';
import { FesStep, Step } from '@/app/core/models/step.model';
import { QuestionApi } from '@/app/core/api/question.api';
import { AnswerApi } from '@/app/core/api/answer.api';
import { WebsocketResponseData } from '@/app/core/services/ws.service';
import { Answer } from '@/app/core/models/answer.model';
import { questionOptions } from '@/app/core/constants/question.constant';
import { ResultApi } from '@/app/core/api/result.api';
import { Result } from '@/app/core/models/result.model';
import { sleep } from '@/app/core/utils/time.util';
import { Period } from '@/app/core/models/period.model';
import { PeriodApi } from '@/app/core/api/period.api';

export type PanelistQueryParam = {
  name: string;
  team: string;
};

@Component({
  selector: 'panelist',
  templateUrl: './panelist.component.html',
  styleUrls: ['./panelist.component.scss'],
})
export class PanelistComponent {
  panelist: Panelist = new Panelist();
  panelistNameError = false;
  periodNumber = 0;
  questionNumber = 0;
  periods: Period[] = [];
  selectedAnswer = '';
  questionAnswer = '';
  step: Step = 'タイトル';
  timer: NodeJS.Timeout;
  questionOptions = questionOptions;
  remainedSecond = 0;
  panelistPeriodResult: Result;
  panelistResult: Result;
  teamResult: Result;

  get period() {
    return this.periods.find((x) => x.number === this.periodNumber);
  }

  get questions() {
    return this.period.questions;
  }

  get question() {
    return this.questions.find((x) => x.index === this.questionNumber);
  }

  constructor(
    private store: StoreService,
    private periodApi: PeriodApi,
    private questionApi: QuestionApi,
    private panelistApi: PanelistApi,
    private answerApi: AnswerApi,
    private resultApi: ResultApi,
    private stepWebsocket: StepWebsocket
  ) {}

  ngOnInit() {
    const panelist = this.store.getters.panelist();
    if (panelist.id) {
      this.panelist = new Panelist(panelist);
      this.step = 'オープニング';
    } else {
      const urlQuery = locationUtil.urlQuery() as PanelistQueryParam;
      this.panelist.name = urlQuery.name;
      this.panelist.team = urlQuery.team;
    }
    this.fetchPeriods();
    this.connectWebsocket();
  }

  keepScreenAlive() {
    const noSleep = new NoSleep();
    noSleep.enable();
    document.getElementById('wake-lock-overlay').remove();
    this.step = 'オープニング';
  }

  stepWebsocketCallback(res: WebsocketResponseData<FesStep>) {
    if (!this.panelist.id) return;
    this.step = res.data.step;
    this.periodNumber = res.data.periodNumber;
    this.questionNumber = res.data.questionNumber;
    if (this.step === '解答開始') {
      this.questionAnswer = '';
      this.selectedAnswer = '';
      clearInterval(this.timer);
      this.remainedSecond = this.question.second;
      this.timer = setInterval(() => {
        this.remainedSecond = Math.max(0, this.remainedSecond - 0.01);
        if (!this.remainedSecond) clearInterval(this.timer);
      }, 10);
    }
    if (
      this.step === '解答結果' &&
      !this.selectedAnswer &&
      this.question.answer
    )
      this.submit();
    if (this.step === '解答開示') this.fetchAnswer();
    if (this.step === 'ピリオド成績') this.fetchPanelistPeriodResult();
    if (this.step === '総合チーム成績') this.fetchTeamResult();
    if (this.step === '総合個人成績') this.fetchPanelistResult();
  }

  connectWebsocket() {
    this.stepWebsocket.callback = this.stepWebsocketCallback.bind(this);
    this.stepWebsocket.connect();
  }

  async fetchPeriods() {
    this.periods = await this.periodApi.getAll();
  }

  async createPanelist() {
    try {
      const panelist = await this.panelistApi.create(this.panelist);
      this.store.setters.panelist(panelist);
      this.panelist = panelist;
    } catch (e) {
      this.panelistNameError = true;
    }
  }

  async answer(answer: string) {
    if (this.selectedAnswer || !this.remainedSecond) return;
    clearInterval(this.timer);
    this.selectedAnswer = answer;
    this.submit();
  }

  async submit() {
    const body: Answer = {
      panelistId: this.panelist.id,
      questionId: this.question.id,
      answer: this.selectedAnswer,
      elapsedSecond: +(this.question.second - this.remainedSecond).toFixed(2),
    };
    this.answerApi.answer(body);
  }

  async fetchAnswer() {
    this.questionAnswer = await this.questionApi.getAnswer(this.question.id);
    if (!this.questionAnswer) {
      const body = {
        questionId: this.question.id,
        panelistId: this.panelist.id,
      };
      const correct = await this.answerApi.getCorrect(body);
      this.questionAnswer = `${correct}`;
      if (correct) this.selectedAnswer = `${correct}`;
    }
  }

  async fetchPanelistPeriodResult() {
    this.panelistPeriodResult = await this.resultApi.getPanelistPeriodResult(
      this.panelist.id,
      this.periodNumber
    );
  }

  async fetchPanelistResult() {
    this.panelistResult = await this.resultApi.getPanelistResult(
      this.panelist.id
    );
  }

  async fetchTeamResult() {
    this.teamResult = await this.resultApi.getTeamResult(this.panelist.team);
  }
}