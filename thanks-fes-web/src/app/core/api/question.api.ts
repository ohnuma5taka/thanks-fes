import { UpdateQuestionAnswerRequest } from '@/app/core/models/answer.model';
import { ApiService } from '@/app/core/services/api.service';
import { Injectable } from '@angular/core';

@Injectable()
export class QuestionApi {
  constructor(private apiService: ApiService) {}

  async getAnswer(id: number) {
    return await this.apiService.get<string>(`/questions/${id}/answer`);
  }

  async updateAnswer(id: number, body: UpdateQuestionAnswerRequest) {
    return await this.apiService.put<undefined>(
      `/questions/${id}/answer`,
      body
    );
  }
}
