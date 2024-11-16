import { Component } from '@angular/core';
import { StepWebsocket } from '@/app/core/ws/step.ws';
import { Question, QuestionAnswer } from '@/app/core/models/question.model';
import { FesStep, Step } from '@/app/core/models/step.model';
import { QuestionApi } from '@/app/core/api/question.api';
import { ResultApi } from '@/app/core/api/result.api';
import { WebsocketResponseData } from '@/app/core/services/ws.service';
import { AnswerApi } from '@/app/core/api/answer.api';
import {
  AnswerCount,
  GetAnswerCountRequest,
  TeamAnswer,
} from '@/app/core/models/answer.model';
import { stringUtil } from '@/app/core/utils/string.util';
import { sleep } from '@/app/core/utils/time.util';
import { Result } from '@/app/core/models/result.model';
import { PanelistApi } from '@/app/core/api/panelist.api';

@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent {
  isNumber = stringUtil.isNumber;
  period = 1;
  questions: Question[] = [];
  questionNumber = 1;
  step: Step = 'タイトル';
  questionStarted = false;
  questionAnswer: QuestionAnswer = '';
  answerCount: AnswerCount = {} as AnswerCount;
  results: Result[] = [];
  teamAnswers: TeamAnswer[] = [];

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

  get optionResources() {
    return this.question.options.map((x, i) => ({
      icon: `/assets/images/common/option-icon${i + 1}.png`,
      image: `/assets/images/${this.period}-${this.questionNumber}/${x.text}.png`,
    }));
  }

  constructor(
    private questionApi: QuestionApi,
    private answerApi: AnswerApi,
    private resultApi: ResultApi,
    private panelistApi: PanelistApi,
    private stepWebsocket: StepWebsocket
  ) {}

  async ngOnInit() {
    this.clearAnswers();
    this.fetchQuestions();
    this.connectWebsocket();
  }

  async ngAfterViewInit() {
    await sleep(1);
    const titleLogoImage = document.getElementById('thanks-fes-title');
    if (titleLogoImage) titleLogoImage.classList.add('display');
  }

  getImageSrc(optionLabel: string) {
    return `/assets/images/${this.period}-${this.questionNumber}/${optionLabel}.png`;
  }

  async stepWebsocketCallback(res: WebsocketResponseData<FesStep>) {
    this.step = res.data.step;
    this.period = res.data.period;
    this.questionNumber = res.data.question;
    if (this.step === '問題開始') {
      this.questionAnswer = '';
      this.answerCount = {} as AnswerCount;
      this.questionStarted = false;
    }
    if (this.step === '解答開始') {
      await sleep(1);
      this.questionStarted = true;
      this.fetchTeams();
    }
    if (this.step === '解答結果') this.getAnswerCount();
    if (this.step === '解答開示') this.getAnswer();
    if (this.step === 'ピリオド終了') this.answerDummy();
    if (this.step === 'ピリオドランキング') this.fetchPanelistPeriodResults();
    if (this.step === '総合チームランキング') this.fetchTeamResults();
    if (this.step === '総合個人ランキング') this.fetchPanelistResults();
  }

  connectWebsocket() {
    this.stepWebsocket.callback = this.stepWebsocketCallback.bind(this);
    this.stepWebsocket.connect();
  }

  async clearAnswers() {
    this.answerApi.clearAll();
  }

  async fetchQuestions() {
    const questions = await this.questionApi.getAll();
    this.questions = questions.map((question) => ({
      ...question,
      filePath: question.file
        ? `/assets/images/${question.period}-${question.index}/${question.file}`
        : '',
      options: question.options.map((x) => ({
        ...x,
        transform: `translate(${202.5 - x.imageOriginX}px, ${
          144 - x.imageOriginY
        }px) scale(${x.imageScale})`,
      })),
    }));
  }

  async getAnswer() {
    this.questionAnswer = await this.questionApi.getAnswer(this.question.id);
  }

  async fetchTeams() {
    const teams = await this.panelistApi.getTeams();
    this.teamAnswers = teams.map((team) => ({ team, correct: 0 }));
  }

  async getAnswerCount() {
    console.log(
      !this.question.answer && this.question.panelistType === 'チーム',
      this.question.answer,
      this.question.panelistType
    );

    if (!this.question.answer && this.question.panelistType === 'チーム') {
      const body = { questionId: this.question.id };
      this.teamAnswers = await this.answerApi.getTeamAnswers(body);
    } else {
      const body: GetAnswerCountRequest = { questionId: this.question.id };
      this.answerCount = await this.answerApi.getAnswerCount(body);
    }
  }

  async answerDummy() {
    this.answerApi.answerDummy(this.period);
  }

  async displayResults() {
    if (!this.results.length) return;
    const lastSec = 3000;
    const constSec = 500;
    const c =
      (2 * ((11700 - lastSec) / this.results.length - constSec)) /
      (this.results.length - 3);
    for (let i of [...Array(this.results.length - 1).keys()]) {
      await sleep(constSec + c * i);
      const index = this.results.length - i - 1;
      this.results[index].displayed = true;
    }
    await sleep(lastSec);
    this.results[0].displayed = true;
  }

  async fetchPanelistPeriodResults() {
    this.results = [];
    const results = await this.resultApi.getPanelistPeriodResults(this.period);
    this.results = results.slice(0, 10).map((x) => ({
      ...x,
      correctText: x.correct.toFixed(0),
    }));
    this.displayResults();
  }

  async fetchTeamResults() {
    this.results = [];
    const results = await this.resultApi.getTeamResults();
    this.results = results.map((x) => ({
      ...x,
      correctText: x.correct.toFixed(1),
    }));
    this.displayResults();
  }

  async fetchPanelistResults() {
    this.results = [];
    const results = await this.resultApi.getPanelistResults();
    this.results = results.slice(0, 10).map((x) => ({
      ...x,
      correctText: x.correct.toFixed(0),
    }));
    this.displayResults();
  }
}
