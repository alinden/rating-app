import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataRefreshRequiredService } from '../data-refresh-required.service';
import { LeagueService } from '../league.service';
import { StatsService } from '../stats.service';
import { UserService } from '../user.service';

import { WithId } from '../with-id';
import { User } from '../user';
import { League } from '../league';

import { WinLossRecord } from '../win-loss-record';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent implements OnInit {
  league: WithId<League> = null;
  leagueName: string = '';
  leagues: WithId<League>[] = [];
  playerName: string = '';
  users: WithId<User>[] = [];
  winLossRecords: WinLossRecord[];

  private dataRefreshSub: any;
  private urlSub: any;

  dataVersion: number = 0;

  constructor(
    private dataRefreshRequiredService: DataRefreshRequiredService,
    private leagueService: LeagueService,
    private route: ActivatedRoute,
    private statsService: StatsService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.urlSub = this.route.params.subscribe(params => {
      if (params['leagueName']) {
        this.leagueName = params['leagueName'];
      }
      if (params['playerName']) {
        this.playerName = params['playerName'];
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
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.leagueService.getLeagues().subscribe((leagues) => {
        this.leagues = leagues;
        if (this.leagueName) {
          this.league = leagues.find((league) => {
            return league.entity.name === this.leagueName;
          });
        }
        if (this.playerName && this.users.length) {
          const player = this.users.find((user) => {
            return user.entity.name === this.playerName;
          });
          if (player) {
            this.statsService.getConditionalStandings(
              this.league.id, player.id
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
            this.winLossRecords = winLossRecordsByLeagueId.get(this.league.id);
          });
        }
      });
    });
  }
}
