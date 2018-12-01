import { Component, OnInit, ViewChild } from '@angular/core';

import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { MatGridList } from '@angular/material';

import { ClientService } from '../client.service';

import { Game } from '../game';
import { LeagueWithGames } from '../league-with-games';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
 @ViewChild('grid') grid: MatGridList;

  gridByBreakpoint = {
    xl: 3,
    lg: 2,
    md: 1,
    sm: 1,
    xs: 1
  };

  constructor(
    public client: ClientService,
    private observableMedia: ObservableMedia
  ) { }

  ngOnInit() {
    this.observableMedia.asObservable().subscribe((change: MediaChange) => {
      this.grid.cols = this.gridByBreakpoint[change.mqAlias];
    });

    if (!this.client.initialized) {
      this.client.loadAllData();
    }
  }
}
