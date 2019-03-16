import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatOptionModule,
  MatSelectModule,
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatTableModule,
  MatCardModule,
  MatPaginatorModule,
  MatSortModule,
  MatDialogModule,
  MatGridListModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import { NgxChartsModule } from '@swimlane/ngx-charts';

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
import { KeepScoreComponent } from './keep-score/keep-score.component';
import { RatingChangeComponent } from './rating-change/rating-change.component';
import { CricketScoreboardRowComponent } from './cricket-scoreboard-row/cricket-scoreboard-row.component';
import { WinLossRecordComponent } from './win-loss-record/win-loss-record.component';
import { RatingsDistributionComponent } from './ratings-distribution/ratings-distribution.component';
import { MonthTotalComponent } from './month-total/month-total.component';
import { StandingsComponent } from './standings/standings.component';
import { MonthsComponent } from './months/months.component';
import { DetailsDialogComponent } from './details-dialog/details-dialog.component';
import { AddGameDialogComponent } from './add-game-dialog/add-game-dialog.component';
import { RatingHistoryDialogComponent } from './rating-history-dialog/rating-history-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    GamesComponent,
    RatingsComponent,
    DetailsDialogComponent,
    AdminComponent,
    AppNavComponent,
    UsersCardComponent,
    LeaguesCardComponent,
    UsersCardItemComponent,
    LeaguesCardItemComponent,
    RatedUserCardItemComponent,
    RatedGameCardItemComponent,
    KeepScoreComponent,
    RatingChangeComponent,
    CricketScoreboardRowComponent,
    WinLossRecordComponent,
    RatingsDistributionComponent,
    MonthTotalComponent,
    StandingsComponent,
    MonthsComponent,
    AddGameDialogComponent,
    RatingHistoryDialogComponent
  ],
  imports: [
    NgxChartsModule,
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
    MatDialogModule,
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
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    DetailsDialogComponent,
    RatingHistoryDialogComponent,
    AddGameDialogComponent,
  ],
})
export class AppModule { }
