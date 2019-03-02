import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GameService } from '../game.service';
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

  leagueWithGames: LeagueWithGames;
  leagueName: string = '';

  monthNames: string[] = [];
  monthTotals: MonthTotal[];

  private sub: any;

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
    ) {
      this.setMonthNames();
    }

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
          const monthTotalsByLeagueId = new Map();
          for (const leagueIdAndMonthTotals of stats.leagueIdAndMonthTotals) {
            monthTotalsByLeagueId.set(leagueIdAndMonthTotals[0],
              leagueIdAndMonthTotals[1]);
          }
          this.monthTotals = monthTotalsByLeagueId.get(this.leagueWithGames.league.id);
        });
      });
    });
  }

}
