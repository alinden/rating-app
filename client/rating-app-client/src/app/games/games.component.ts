import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material";
import { ActivatedRoute } from '@angular/router';

import { DataRefreshRequiredService } from '../data-refresh-required.service';
import { LeagueService } from '../league.service';
import { GameService } from '../game.service';

import { League } from '../league';
import { LeagueWithGames } from '../league-with-games';
import { DetailsDialogComponent } from '../details-dialog/details-dialog.component';
import { RatedGame } from '../rated-game';
import { WithId } from '../with-id';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  league: WithId<League> = null;
  leagueName: string = '';
  leagueWithGames: LeagueWithGames;
  leagues: WithId<League>[] = [];

  private dataRefreshSub: any;
  private urlSub: any;

  dataVersion: number = 0;

  constructor(
    private dataRefreshRequiredService: DataRefreshRequiredService,
    private dialog: MatDialog,
    private leagueService: LeagueService,
    private gameService: GameService,
    private route: ActivatedRoute,
  ) {}

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
          this.gameService.getLeagueWithGames(this.league.id).subscribe((leagueWithGames) => {
            this.leagueWithGames = leagueWithGames;
          });
        }
      }
    });
  }

  openGameDetails(ratedGame: RatedGame) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      ratedGame: ratedGame,
      league: this.leagueWithGames.league.entity,
    };

    this.dialog.open(DetailsDialogComponent, dialogConfig);
  }
}
