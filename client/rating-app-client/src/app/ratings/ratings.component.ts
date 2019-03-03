import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RatingService } from '../rating.service';
import { StatsService } from '../stats.service';

import { Game } from '../game';
import { User } from '../user';
import { League } from '../league';
import { WithId } from '../with-id';
import { LeagueWithRatings } from '../league-with-ratings';
import { WinLossRecord } from '../win-loss-record';
import { MonthTotal } from '../month-total';


@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent implements OnInit {
  leagueWithRatings: LeagueWithRatings;
  leagueName: string = '';

  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private ratingService: RatingService,
    ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['leagueName']) {
        this.leagueName = params['leagueName'];
      }
      this.ratingService.getLeaguesWithRatings().subscribe((leaguesWithRatings) => {
        if (this.leagueName) {
          this.leagueWithRatings = leaguesWithRatings.find((x) => {
            return x.league.entity.name === this.leagueName;
          });
        }
        if (!this.leagueWithRatings) {
          this.leagueWithRatings = leaguesWithRatings[0];
        }
      });
    });
  }
}
