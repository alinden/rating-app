import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ActivatedRoute } from '@angular/router';

import { DataRefreshRequiredService } from '../data-refresh-required.service';
import { LeagueService } from '../league.service';
import { RatingService } from '../rating.service';

import { League } from '../league';
import { LeagueWithRatings } from '../league-with-ratings';
import { RatingHistoryDialogComponent } from '../rating-history-dialog/rating-history-dialog.component';
import { RatedUser } from '../rated-user';
import { WithId } from '../with-id';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent implements OnInit {
  league: WithId<League> = null;
  leagueName: string = '';
  leagueWithRatings: LeagueWithRatings;
  leagues: WithId<League>[] = [];

  private dataRefreshSub: any;
  private urlSub: any;

  dataVersion: number = 0;

  constructor(
    private dataRefreshRequiredService: DataRefreshRequiredService,
    private dialog: MatDialog,
    private leagueService: LeagueService,
    private ratingService: RatingService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.urlSub = this.route.params.subscribe(params => {
      if (params['leagueName']) {
        this.leagueName = params['leagueName'];
      }
      this.refreshData();
    });
    this.dataRefreshSub = this.dataRefreshRequiredService.dataChangeCounter.subscribe((value) => {
      if (this.dataVersion !== value) {
        this.dataVersion = value;
        this.refreshData();
      }
    });
  }

  refreshData() {
    this.leagueService.getLeagues().subscribe((leagues) => {
      this.leagues = leagues;
      if (this.leagueName) {
        this.league = this.leagues.find((league) => {
          return league.entity.name === this.leagueName;
        });
        if (this.league) {
          this.ratingService.getLeagueWithRatings(this.league.id).subscribe((leagueWithRatings) => {
            this.leagueWithRatings = leagueWithRatings;
          });
        }
      }
    });
  }

  openRatingDetails(ratedUser: RatedUser) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      ratedUser: ratedUser,
      league: this.league.entity,
    };
    this.dialog.open(RatingHistoryDialogComponent, dialogConfig);
  }
}
