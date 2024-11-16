import { UpdateQuestionAnswerRequest } from '@/app/core/models/answer.model';
import { Question, QuestionAnswer } from '@/app/core/models/question.model';
import { ApiService } from '@/app/core/services/api.service';
import { Injectable } from '@angular/core';

@Injectable()
export class QuestionApi {
  constructor(private apiService: ApiService) {}

  async getAll() {
    const questions = await this.apiService.get<Question[]>('/questions');
    return questions.map((x) => ({
      ...x,
      text: x.text.replace(/\\n/g, '<br>'),
    }));
  }

  async getAnswer(id: number) {
    return await this.apiService.get<QuestionAnswer>(`/questions/${id}/answer`);
  }

  async updateAnswer(id: number, body: UpdateQuestionAnswerRequest) {
    return await this.apiService.put<undefined>(
      `/questions/${id}/answer`,
      body
    );
  }
}
