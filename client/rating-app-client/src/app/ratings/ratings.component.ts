import { Component, OnInit, ViewChild } from '@angular/core';

import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatGridList } from '@angular/material';

import { ClientService } from '../client.service';

import { Rating } from '../rating';
import { LeagueWithRatings } from '../league-with-ratings';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent implements OnInit {
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
    private mediaObserver: MediaObserver
  ) { }

  ngOnInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.grid.cols = this.gridByBreakpoint[change.mqAlias];
    });

    if (!this.client.initialized) {
      this.client.loadAllData();
    }
  }
}
