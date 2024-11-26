import { Period } from '@/app/core/models/period.model';
import { Question } from '@/app/core/models/question.model';
import { ApiService } from '@/app/core/services/api.service';
import { assetUtil } from '@/app/core/utils/asset.util';
import { Injectable } from '@angular/core';

@Injectable()
export class PeriodApi {
  constructor(private apiService: ApiService) {}

  async getAll() {
    const periods = await this.apiService.get<Period[]>('/periods');
    return await Promise.all(
      periods.map(async (x) => ({
        ...x,
        questions: await Promise.all(
          x.questions
            .map((x) => new Question(x))
            .map(async (x) => {
              if (x.file) {
                const dimension = await assetUtil.getAssetDimension(
                  x.file.questionPath
                );
                const answerFileExist = await assetUtil.isExist(
                  x.file.answerPath
                );
                x.file = {
                  ...x.file,
                  ...dimension,
                  answerPath: answerFileExist ? x.file.answerPath : '',
                };
              }
              return x;
            })
        ),
      }))
    );
  }
}
