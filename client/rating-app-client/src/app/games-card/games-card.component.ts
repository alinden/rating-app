import { Component, OnInit, Input } from '@angular/core';

import { ClientService } from '../client.service';
import { UserService } from '../user.service';
import { StatsService } from '../stats.service';

import { Game } from '../game';
import { User } from '../user';
import { League } from '../league';
import { WithId } from '../with-id';
import { LeagueWithGames } from '../league-with-games';
import { WinLossRecord } from '../win-loss-record';
import { MonthTotal } from '../month-total';

@Component({
  selector: 'app-games-card',
  templateUrl: './games-card.component.html',
  styleUrls: ['./games-card.component.css']
})
export class GamesCardComponent implements OnInit {
  @Input() leagueWithGames: LeagueWithGames;
  @Input() winnerId: number;
  @Input() loserId: number;

  monthNames: string[] = [];

  selectedUser: WithId<User>;
  conditionalWinLossRecords: WinLossRecord[];
  conditionalMonths: MonthTotal[];

  mode: 'list' | 'add' | 'standings' | 'months' | 'conditional-standings' | 'conditional-months'  = 'list';

  enterAddMode(): void {
    this.mode = 'add';
  }

  enterListMode(): void {
    this.mode = 'list';
  }

  enterStandingsMode(): void {
    this.mode = 'standings';
  }

  enterMonthsMode(): void {
    this.mode = 'months';
  }

  enterConditionalStandingsMode(): void {
    this.mode = 'conditional-standings';
  }

  enterConditionalMonthsMode(): void {
    this.mode = 'conditional-months';
  }


  saveGame(): void {
    this.client.addGame(this.leagueWithGames.league.id, this.winnerId, this.loserId);
    this.enterListMode();
  }

  isCricket(): boolean {
    return this.leagueWithGames.league.id === 3;
  }

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
    private client: ClientService,
    private userService: UserService,
    private statsService: StatsService,
    ) {
      this.setMonthNames();
    }


  ngOnInit() {
  }

  onStandingsUserSelected(selectedUserId) {
    const leagueId = this.leagueWithGames.league.id;
    this.userService.getUser(selectedUserId).subscribe(user => {
      this.selectedUser = user;
      this.statsService.getConditionalStandings(leagueId, selectedUserId).subscribe(winLossRecords => {
        this.conditionalWinLossRecords = winLossRecords;
        this.enterConditionalStandingsMode();
      });
    });
  }

  onMonthsUserSelected(selectedUserId) {
    const leagueId = this.leagueWithGames.league.id;
    this.userService.getUser(selectedUserId).subscribe(user => {
      this.selectedUser = user;
      this.statsService.getConditionalMonths(leagueId, selectedUserId).subscribe(monthTotals => {
        this.conditionalMonths = monthTotals;
        this.enterConditionalMonthsMode();
      });
    });
  }
}
