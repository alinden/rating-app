import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { StandingsComponent } from './standings/standings.component';
import { KeepScoreComponent } from './keep-score/keep-score.component';

const routes: Routes = [
  { path: 'standings', component: StandingsComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'keep-score/:leagueId', component: KeepScoreComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
