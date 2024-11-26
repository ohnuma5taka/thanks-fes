import { UpdateQuestionAnswerRequest } from '@/app/core/models/answer.model';
import { Question, QuestionAnswer } from '@/app/core/models/question.model';
import { ApiService } from '@/app/core/services/api.service';
import { assetUtil } from '@/app/core/utils/asset.util';
import { Injectable } from '@angular/core';

@Injectable()
export class QuestionApi {
  constructor(private apiService: ApiService) {}

  async getAll() {
    const questions = await this.apiService.get<Question[]>('/questions');
    return await Promise.all(
      questions
        .map((x) => new Question(x))
        .map(async (x) => {
          if (x.file) {
            const dimension = await assetUtil.getAssetDimension(
              x.file.questionPath
            );
            const answerFileExist = await assetUtil.isExist(x.file.answerPath);
            x.file = {
              ...x.file,
              ...dimension,
              answerPath: answerFileExist ? x.file.answerPath : '',
            };
          }
          return x;
        })
    );
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
