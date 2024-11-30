import {
  CreatePanelistRequest,
  GetPanelistIdRequest,
  Panelist,
  RegisteredPanelistCount,
} from '@/app/core/models/panelist.model';
import { ApiService } from '@/app/core/services/api.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PanelistApi {
  constructor(private apiService: ApiService) {}

  async getId(body: GetPanelistIdRequest) {
    return await this.apiService.get<number>('/panelists/id', body);
  }

  async create(body: CreatePanelistRequest) {
    return await this.apiService.post<Panelist>('/panelists/new', body);
  }

  async getTeams() {
    return await this.apiService.get<string[]>('/panelists/teams');
  }

  async getRegisteredCount() {
    return await this.apiService.get<RegisteredPanelistCount[]>(
      '/panelists/registered-count'
    );
  }
}
