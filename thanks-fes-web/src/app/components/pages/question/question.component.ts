import { Component } from '@angular/core';
import { StepWebsocket } from '@/app/core/ws/step.ws';
import { FesStep, Step } from '@/app/core/models/step.model';
import { QuestionApi } from '@/app/core/api/question.api';
import { ResultApi } from '@/app/core/api/result.api';
import { WebsocketResponseData } from '@/app/core/services/ws.service';
import { AnswerApi } from '@/app/core/api/answer.api';
import {
  AnswerCount,
  GetAnswerCountRequest,
} from '@/app/core/models/answer.model';
import { stringUtil } from '@/app/core/utils/string.util';
import { sleep } from '@/app/core/utils/time.util';
import { Result } from '@/app/core/models/result.model';
import { PanelistApi } from '@/app/core/api/panelist.api';
import { Period } from '@/app/core/models/period.model';
import { PeriodApi } from '@/app/core/api/period.api';
import { last } from 'lodash';

@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent {
  isNumber = stringUtil.isNumber;
  periodNumber = 1;
  periods: Period[] = [];
  questionNumber = 1;
  step: Step = '';
  questionStarted = false;
  questionAnswer = '';
  answerCount: AnswerCount = {} as AnswerCount;
  results: Result[];

  get period() {
    return this.periods.find((x) => x.number === this.periodNumber);
  }

  get questions() {
    return this.period?.questions || [];
  }

  get question() {
    return this.questions.find((x) => x.index === this.questionNumber);
  }

  get horizontalLayout() {
    return (
      this.question.optionFormat === '画像' ||
      (this.question.questionFormat !== '文字' &&
        this.question.file?.width > this.question.file?.height)
    );
  }

  get optionResources() {
    return this.question.options.map((x, i) => ({
      iconSrc: `/assets/images/option-icon${i + 1}.png`,
      imageSrc: `/assets/questions/${this.question.id}/${x.value}.png`,
    }));
  }

  constructor(
    private periodApi: PeriodApi,
    private questionApi: QuestionApi,
    private answerApi: AnswerApi,
    private resultApi: ResultApi,
    private panelistApi: PanelistApi,
    private stepWebsocket: StepWebsocket
  ) {}

  async ngOnInit() {
    this.clearAnswers();
    this.fetchPeriods();
    this.connectWebsocket();
  }

  async stepWebsocketCallback(res: WebsocketResponseData<FesStep>) {
    this.step = res.data.step;
    this.periodNumber = res.data.periodNumber;
    this.questionNumber = res.data.questionNumber;
    if (this.step === 'タイトル') this.displayTitle('thanks-fes-title');
    if (this.step === '問題開始') {
      this.questionAnswer = '';
      this.answerCount = {} as AnswerCount;
      this.questionStarted = false;
    }
    if (this.step === '解答開始') {
      await sleep(1);
      this.questionStarted = true;
      if (this.period.panelistType === 'チーム') this.fetchTeams();
    }
    if (this.step === '解答結果') this.getAnswerCount();
    if (this.step === '解答開示') this.getAnswer();
    if (this.step === 'ピリオドランキング') this.fetchPeriodResults();
    if (this.step === '総合チームランキングタイトル')
      this.displayTitle('total-team-ranking-title');
    if (this.step === '総合チームランキング') this.fetchTeamResults();
    if (this.step === '総合個人ランキングタイトル')
      this.displayTitle('total-panelist-ranking-title');
    if (this.step === '総合個人ランキング') this.fetchPanelistResults();
  }

  async displayTitle(id: string) {
    await sleep(1);
    const titleImage = document.getElementById(id);
    if (titleImage) titleImage.classList.add('display');
  }

  connectWebsocket() {
    this.stepWebsocket.callback = this.stepWebsocketCallback.bind(this);
    this.stepWebsocket.connect();
  }

  async clearAnswers() {
    this.answerApi.clearAll();
  }

  async fetchPeriods() {
    this.periods = await this.periodApi.getAll();
  }

  async getAnswer() {
    this.questionAnswer = await this.questionApi.getAnswer(this.question.id);
  }

  async fetchTeams() {
    const teams = await this.panelistApi.getTeams();
    this.question.options = teams.map((x) => ({
      value: `${x}チーム`,
      imageOriginX: 0,
      imageOriginY: 0,
      imageScale: 0,
    }));
  }

  async getAnswerCount() {
    if (this.period.panelistType === 'チーム') {
      const body = { questionId: this.question.id };
      const teamAnswers = await this.answerApi.getTeamAnswers(body);
      this.answerCount = teamAnswers.reduce(
        (ret, x) => ({ ...ret, [`${x.team}チーム`]: x.correct }),
        {} as AnswerCount
      );
    } else {
      const body: GetAnswerCountRequest = { questionId: this.question.id };
      this.answerCount = await this.answerApi.getAnswerCount(body);
    }
  }

  async displayResults() {
    const count = this.results.length;
    if (!count) return;
    const totalSecond = 11700;
    const lastSecond = 2500;
    const _seconds = [...Array(count - 1)].map(
      (_, i) => Math.log(i + 1) / Math.log(count + 1)
    );
    const total = _seconds.reduce((ret, x) => ret + x, 0);
    const sleepSeconds = _seconds.map(
      (x) => (x / total) * (totalSecond - lastSecond)
    );
    if (count === 1) await sleep(totalSecond - lastSecond);
    for (let i = 0; i < count - 1; i++) {
      await sleep(sleepSeconds[i]);
      const index = this.results.length - i - 1;
      this.results[index].displayed = true;
    }
    await sleep(lastSecond);
    this.results[0].displayed = true;
  }

  async fetchPeriodResults() {
    this.results = undefined;
    if (this.period.panelistType === '個人') {
      const results = await this.resultApi.getPanelistPeriodResults(
        this.periodNumber
      );
      this.results = results.slice(0, 10);
    } else {
      this.results = await this.resultApi.getTeamPeriodResults(
        this.periodNumber
      );
    }
    this.displayResults();
  }

  async fetchTeamResults() {
    this.results = undefined;
    this.results = await this.resultApi.getTeamResults();
    this.displayResults();
  }

  async fetchPanelistResults() {
    this.results = undefined;
    const results = await this.resultApi.getPanelistResults();
    this.results = results.slice(0, 10);
    this.displayResults();
  }
}
