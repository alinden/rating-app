import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { StandingsComponent } from './standings/standings.component';
import { GamesComponent } from './games/games.component';
import { AddGameComponent } from './add-game/add-game.component';
import { RatingsComponent } from './ratings/ratings.component';
import { MonthsComponent } from './months/months.component';
import { KeepScoreComponent } from './keep-score/keep-score.component';

const routes: Routes = [
  { path: 'Standings', component: StandingsComponent },
  { path: 'Standings/:leagueName', component: StandingsComponent },
  { path: 'Standings/:leagueName/:playerName', component: StandingsComponent },
  { path: 'Months', component: MonthsComponent},
  { path: 'Months/:leagueName', component: MonthsComponent},
  { path: 'Months/:leagueName/:playerName', component: MonthsComponent},
  { path: 'Ratings', component: RatingsComponent},
  { path: 'Ratings/:leagueName', component: RatingsComponent},
  { path: 'Ratings/:leagueName/:playerName', component: RatingsComponent},
  { path: 'Games', component: GamesComponent },
  { path: 'Games/:leagueName', component: GamesComponent },
  { path: 'Games/:leagueName/:playerName', component: GamesComponent },
  { path: 'rating-distribution', component: StandingsComponent},
  { path: 'Admin', component: AdminComponent },
  { path: 'keep-score/:leagueId', component: KeepScoreComponent },
  { path: 'add-game/:leagueName', component: AddGameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
