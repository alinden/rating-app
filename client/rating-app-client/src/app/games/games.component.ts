import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material";
import { ActivatedRoute } from '@angular/router';

import { GameService } from '../game.service';
import { DataRefreshRequiredService } from '../data-refresh-required.service';
import { RatedGame } from '../rated-game';
import { LeagueWithGames } from '../league-with-games';
import { DetailsDialogComponent } from '../details-dialog/details-dialog.component';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

  leagueWithGames: LeagueWithGames;
  leagueName: string = '';

  private urlSub: any;
  private dataRefreshSub: any;

  dataVersion: number = 0;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private dialog: MatDialog,
    private dataRefreshRequiredService: DataRefreshRequiredService,
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
    this.gameService.getLeaguesWithGames().subscribe((leaguesWithGames) => {
      if (this.leagueName) {
        this.leagueWithGames = leaguesWithGames.find((x) => {
          return x.league.entity.name === this.leagueName;
        });
      }
      if (!this.leagueWithGames) {
        this.leagueWithGames = leaguesWithGames[0];
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
