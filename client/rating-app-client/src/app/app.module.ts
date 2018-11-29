import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatOptionModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule, MatTableModule, MatCardModule, MatPaginatorModule, MatSortModule, MatGridListModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GamesComponent } from './games/games.component';
import { RatingsComponent } from './ratings/ratings.component';
import { AdminComponent } from './admin/admin.component';
import { AppNavComponent } from './app-nav/app-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { UsersCardComponent } from './users-card/users-card.component';
import { UsersCardItemComponent } from './users-card-item/users-card-item.component';
import { LeaguesCardComponent } from './leagues-card/leagues-card.component';
import { LeaguesCardItemComponent } from './leagues-card-item/leagues-card-item.component';
import { RatedUserCardItemComponent } from './rated-user-card-item/rated-user-card-item.component';
import { RatedGameCardItemComponent } from './rated-game-card-item/rated-game-card-item.component';
import { GamesCardComponent } from './games-card/games-card.component';
import { RatingsCardComponent } from './ratings-card/ratings-card.component';
import { KeepScoreComponent } from './keep-score/keep-score.component';

@NgModule({
  declarations: [
    AppComponent,
    GamesComponent,
    RatingsComponent,
    AdminComponent,
    AppNavComponent,
    UsersCardComponent,
    LeaguesCardComponent,
    UsersCardItemComponent,
    LeaguesCardItemComponent,
    RatedUserCardItemComponent,
    RatedGameCardItemComponent,
    GamesCardComponent,
    RatingsCardComponent,
    KeepScoreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    LayoutModule,
    MatToolbarModule,
    MatCardModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
