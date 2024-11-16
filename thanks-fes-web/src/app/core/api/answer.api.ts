import {
  Answer,
  AnswerCount,
  PostAnswerTeamRequest,
  GetAnswerCountRequest,
  TeamAnswer,
  GetTeamAnswersRequest,
  GetCorrectRequest,
} from '@/app/core/models/answer.model';
import { ApiService } from '@/app/core/services/api.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AnswerApi {
  constructor(private apiService: ApiService) {}

  async answer(body: Answer) {
    return await this.apiService.post<undefined>('/answers/new', body);
  }

  async getAnswerCount(body: GetAnswerCountRequest) {
    return await this.apiService.get<AnswerCount>(`/answers/count`, body);
  }

  async getCorrect(body: GetCorrectRequest) {
    return await this.apiService.get<number>(`/answers/correct`, body);
  }

  async getTeamAnswers(body: GetTeamAnswersRequest) {
    return await this.apiService.get<TeamAnswer[]>('/answers/teams', body);
  }

  async answerTeams(body: PostAnswerTeamRequest) {
    return await this.apiService.post<undefined>('/answers/teams', body);
  }

  async answerDummy(period: number) {
    return await this.apiService.post<undefined>(
      `/answers/periods/${period}/dummy`
    );
  }

  async clearAll() {
    return await this.apiService.delete<undefined>('/answers');
  }
}
