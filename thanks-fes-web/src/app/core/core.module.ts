import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '@/app/core/services/api.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PanelistApi } from '@/app/core/api/panelist.api';
import { ApiInterceptor } from '@/app/core/api/common/api.interceptor';
import { StoreService } from '@/app/core/services/store.service';
import { SnackbarService } from '@/app/core/services/snackbar.service';
import { QuestionApi } from '@/app/core/api/question.api';
import { AnswerApi } from '@/app/core/api/answer.api';
import { ResultApi } from '@/app/core/api/result.api';
import { StepWebsocket } from '@/app/core/ws/step.ws';
import { PanelistWebsocket } from '@/app/core/ws/panelist.ws';

@NgModule({
  imports: [HttpClientModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    ApiService,
    StoreService,
    SnackbarService,
    AnswerApi,
    PanelistApi,
    QuestionApi,
    ResultApi,
    StepWebsocket,
    PanelistWebsocket,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
