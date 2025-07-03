import { Period } from '@/app/core/models/period.model';
import { ReadItemTag } from '@/app/core/models/read-item.model';
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
      periods.map(async (period) => {
        period.readItems = period.readText
          .split('\n')
          .map((text) => ({ tag: 'lady' as ReadItemTag, text }));
        period.questions = await Promise.all(
          period.questions.map(async (question) => {
            question.readItems = question.readText
              .split('\n')
              .map((text) => ({ tag: 'lady' as ReadItemTag, text }));
            question.options = question.options.map((option) => ({
              ...option,
              transform: option.imageScale
                ? `translate(${(option.imageOriginX - 0.5) * 100}%, ${
                    (option.imageOriginY - 0.5) * 100
                  }%) scale(${option.imageScale})`
                : '',
            }));
            question.timerFilePath = `/assets/videos/timer/${question.second}.mp4`;
            if (question.questionFormat !== '文字') {
              const ext = question.questionFormat === '動画' ? '.mp4' : '.png';
              const file = {
                questionPath: `/assets/questions/${question.id}/question${ext}`,
                questionPreviewPath: `/assets/questions/${question.id}/question_preview${ext}`,
                answerPath: `/assets/questions/${question.id}/answer${ext}`,
                width: 0,
                height: 0,
              };
              const dimension = await assetUtil.getAssetDimension(
                file.questionPath
              );
              const answerFound = !!(
                await assetUtil.getAssetDimension(file.answerPath)
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
              question.file = {
                ...file,
                ...dimension,
                answerPath: answerFound ? file.answerPath : '',
              };
            }
            return question;
          })
        );
        return period;
      })
    );
  }
}
