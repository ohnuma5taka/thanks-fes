import { Result } from '@/app/core/models/result.model';
import { ApiService } from '@/app/core/services/api.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ResultApi {
  constructor(private apiService: ApiService) {}

  async getPanelistResults() {
    return await this.apiService.get<Result[]>('/result/panelists');
  }

  async getPanelistResult(panelistId: number) {
    return await this.apiService.get<Result>(`/result/panelists/${panelistId}`);
  }

  async getPanelistPeriodResults(period: number) {
    return await this.apiService.get<Result[]>(
      `/result/panelists/periods/${period}`
    );
  }

  async getPanelistPeriodResult(panelistId: number, period: number) {
    return await this.apiService.get<Result>(
      `/result/panelists/${panelistId}/periods/${period}`
    );
  }

  async getTeamPeriodResults(period: number) {
    return await this.apiService.get<Result[]>(
      `/result/teams/periods/${period}`
    );
  }

  async getTeamPeriodResult(team: string, period: number) {
    return await this.apiService.get<Result>(
      `/result/teams/${team}/periods/${period}`
    );
  }

  async getTeamResults() {
    return await this.apiService.get<Result[]>('/result/teams');
  }

  async getTeamResult(team: string) {
    return await this.apiService.get<Result>(`/result/teams/${team}`);
  }
}
