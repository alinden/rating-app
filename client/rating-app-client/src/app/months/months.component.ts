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
  selector: 'app-months',
  templateUrl: './months.component.html',
  styleUrls: ['./months.component.css']
})
export class MonthsComponent implements OnInit {

  monthNames: string[] = [];

  constructor() { }

  ngOnInit() {
  }

}
