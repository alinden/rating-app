import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { WithId } from '../with-id';
import { User } from '../user';
import { UserService } from '../user.service';
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

  users: WithId<User>[] = [];
  leagueWithGames: LeagueWithGames;
  leagueName: string = '';
  playerName: string = '';

  winLossRecords: WinLossRecord[];

  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private statsService: StatsService,
    private gameService: GameService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
    this.sub = this.route.params.subscribe(params => {
      if (params['leagueName']) {
        this.leagueName = params['leagueName'];
      }
      if (params['playerName']) {
        this.playerName = params['playerName'];
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
        if (this.playerName && this.users.length) {
          const player = this.users.find((user) => {
            return user.entity.name === this.playerName;
          });
          if (player) {
            this.statsService.getConditionalStandings(
              this.leagueWithGames.league.id, player.id
            ).subscribe(winLossRecords => {
              this.winLossRecords = winLossRecords;
            });
          }
        } else {
          this.statsService.getStats().subscribe(stats => {
            const winLossRecordsByLeagueId = new Map();
            for (const leagueIdAndWinLossRecords of stats.leagueIdAndWinLossRecords) {
              winLossRecordsByLeagueId.set(leagueIdAndWinLossRecords[0],
                leagueIdAndWinLossRecords[1]);
            }
            this.winLossRecords = winLossRecordsByLeagueId.get(this.leagueWithGames.league.id);
          });
        }
      });
    });
  }
}
