import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPreloadingStrategy } from '@/app/app-preloading.strategy';
import { QuestionComponent } from '@/app/components/pages/question/question.component';
import { PanelistComponent } from '@/app/components/pages/panelist/panelist.component';
import { AdminComponent } from '@/app/components/pages/admin/admin.component';

export enum PageEnum {
  home = '',
  question = 'question',
  panelist = 'panelist',
  admin = 'admin',
}

const routes: Routes = [
  {
    path: PageEnum.question,
    component: QuestionComponent,
  },
  {
    path: PageEnum.panelist,
    component: PanelistComponent,
  },
  {
    path: PageEnum.admin,
    component: AdminComponent,
  },
  { path: '**', redirectTo: PageEnum.home },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: false,
      onSameUrlNavigation: 'reload',
      preloadingStrategy: AppPreloadingStrategy,
    }),
  ],
  exports: [RouterModule],
  providers: [AppPreloadingStrategy],
})
export class AppRoutingModule {}
