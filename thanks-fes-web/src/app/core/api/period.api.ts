import { Period } from '@/app/core/models/period.model';
import { Question } from '@/app/core/models/question.model';
import { ApiService } from '@/app/core/services/api.service';
import { assetUtil } from '@/app/core/utils/asset.util';
import { Injectable } from '@angular/core';

@Injectable()
export class PeriodApi {
  constructor(private apiService: ApiService) {}

  async getOpeningPeriod() {
    return await this.apiService.get<Period>('/periods/0');
  }

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
                const answerFound = !!(
                  await assetUtil.getAssetDimension(x.file.answerPath)
                ).width;
                if (dimension.width) {
                  const aspect = dimension.width / dimension.height;
                  const padding = (12 + 96) * 2;
                  const offset = padding + 150;
                  if (dimension.height < dimension.width) {
                    const maxWidth = window.innerWidth - offset;
                    const maxHeight = window.innerHeight - padding - 104 * 2;
                    const scaledWidth =
                      dimension.width * (maxHeight / dimension.height);
                    if (scaledWidth > maxWidth) {
                      dimension.width = maxWidth;
                      dimension.height = dimension.width / aspect;
                    } else {
                      dimension.height = maxHeight;
                      dimension.width = dimension.height * aspect;
                    }
                  } else {
                    dimension.height = window.innerHeight - offset;
                    dimension.width = dimension.height * aspect;
                  }
                }
                x.file = {
                  ...x.file,
                  ...dimension,
                  answerPath: answerFound ? x.file.answerPath : '',
                };
              }
              return x;
            })
        ),
      }))
    );
  }
}
