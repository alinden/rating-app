import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';
import { GameService } from '../game.service';
import { DataRefreshRequiredService } from '../data-refresh-required.service';
import { StatsService } from '../stats.service';

import { Game } from '../game';
import { User } from '../user';
import { League } from '../league';
import { WithId } from '../with-id';
import { LeagueWithGames } from '../league-with-games';
import { WinLossRecord } from '../win-loss-record';
import { MonthTotal } from '../month-total';

@Component({
  selector: 'app-months',
  templateUrl: './months.component.html',
  styleUrls: ['./months.component.css']
})
export class MonthsComponent implements OnInit {

  users: WithId<User>[] = [];
  leagueWithGames: LeagueWithGames;
  leagueName: string = '';
  playerName: string = '';

  monthNames: string[] = [];
  monthTotals: MonthTotal[];

  private urlSub: any;
  private dataRefreshSub: any;

  dataVersion: number = 0;

  setMonthNames(): void {
    const monthNames = [];
    let now;
    for (let i = 0; i <= 11; i++) {
      now = new Date(Date.now());
      now.setMonth(now.getMonth() - i);
      const monthName = now.toLocaleString( 'en-us', { month: 'short' });
      monthNames.push(monthName);
    }
    this.monthNames = monthNames.reverse();
  }

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private statsService: StatsService,
    private userService: UserService,
    private dataRefreshRequiredService: DataRefreshRequiredService,
    ) {
      this.setMonthNames();
    }

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
            this.statsService.getConditionalMonths(
              this.leagueWithGames.league.id, player.id
            ).subscribe(monthTotals => {
              this.monthTotals = monthTotals;
            });
          }
        } else {
          this.statsService.getStats().subscribe(stats => {
            const monthTotalsByLeagueId = new Map();
            for (const leagueIdAndMonthTotals of stats.leagueIdAndMonthTotals) {
              monthTotalsByLeagueId.set(leagueIdAndMonthTotals[0],
                leagueIdAndMonthTotals[1]);
            }
            this.monthTotals = monthTotalsByLeagueId.get(this.leagueWithGames.league.id);
          });
        }
      });
    });
  }

}
