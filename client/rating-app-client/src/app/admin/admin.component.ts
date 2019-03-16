import { Component, OnInit, ViewChild } from '@angular/core';

import { MediaChange, MediaObserver } from '@angular/flex-layout';

import { MatGridList } from '@angular/material';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
 @ViewChild('grid') grid: MatGridList;

  gridColsByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 1,
    xs: 1
  };

  gridRowHeightByBreakpoint = {
    xl: 'fit',
    lg: 'fit',
    md: 'fit',
    sm: '540px',
    xs: '540px'
  };

  constructor(
    private mediaObserver: MediaObserver
  ) { }

  ngOnInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.grid.cols = this.gridColsByBreakpoint[change.mqAlias];
      this.grid.rowHeight = this.gridRowHeightByBreakpoint[change.mqAlias];
    });
  }
}
