import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { GamesComponent } from './games/games.component';
import { RatingsComponent } from './ratings/ratings.component';

const routes: Routes = [
  { path: 'games', component: GamesComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'ratings', component: RatingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
