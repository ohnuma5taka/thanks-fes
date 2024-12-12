import { UpdateQuestionAnswerRequest } from '@/app/core/models/answer.model';
import { ApiService } from '@/app/core/services/api.service';
import { Injectable } from '@angular/core';

@Injectable()
export class QuestionApi {
  constructor(private apiService: ApiService) {}

  async getAnswer(questionId: string) {
    return await this.apiService.get<string>(`/questions/${questionId}/answer`);
  }

  async updateAnswer(questionId: string, body: UpdateQuestionAnswerRequest) {
    return await this.apiService.put<undefined>(
      `/questions/${questionId}/answer`,
      body
    );
  }
}
