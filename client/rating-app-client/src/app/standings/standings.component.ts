import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GameService } from '../game.service';
import { StatsService } from '../stats.service';
import { LeagueWithGames } from '../league-with-games';

import { WinLossRecord } from '../win-loss-record';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent implements OnInit {

  leagueWithGames: LeagueWithGames;
  leagueName: string = '';

  winLossRecords: WinLossRecord[];

  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private statsService: StatsService,
    private gameService: GameService,
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['leagueName']) {
        this.leagueName = params['leagueName'];
      }
      this.gameService.getLeaguesWithGames().subscribe((leaguesWithGames) => {
        if (this.leagueName) {
          this.leagueWithGames = leaguesWithGames.find((x) => {
            return x.league.entity.name === this.leagueName;
          });
        }
        if (!this.leagueWithGames) {
          this.leagueWithGames = leaguesWithGames[0];
        }
        this.statsService.getStats().subscribe(stats => {
          const winLossRecordsByLeagueId = new Map();
          for (const leagueIdAndWinLossRecords of stats.leagueIdAndWinLossRecords) {
            winLossRecordsByLeagueId.set(leagueIdAndWinLossRecords[0],
              leagueIdAndWinLossRecords[1]);
          }
          this.winLossRecords = winLossRecordsByLeagueId.get(this.leagueWithGames.league.id);
          console.log('set this.winLossRecords to');
          console.log(this.winLossRecords);
        });
      });
    });
  }
}
