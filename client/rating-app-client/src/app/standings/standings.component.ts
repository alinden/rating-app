import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatGridList } from '@angular/material';

import { ClientService } from '../client.service';
import { GameService } from '../game.service';
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
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent implements OnInit {
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
    private gameService: GameService,
    private statsService: StatsService,
    ) {
      this.setMonthNames();
    }


  ngOnInit() {
    this.gameService.getLeaguesWithGames().subscribe((leaguesWithGames) => {
      console.log('ngOnInit');
      console.log('leaguesWithGames');
      console.log(leaguesWithGames);
      this.leagueWithGames = leaguesWithGames[0];
    });
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
