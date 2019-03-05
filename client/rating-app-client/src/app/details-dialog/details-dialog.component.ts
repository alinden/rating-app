import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

import { RatedGame } from '../rated-game';
import { League } from '../league';

@Component({
  selector: 'app-details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.css']
})
export class DetailsDialogComponent implements OnInit {

  ratedGame: RatedGame;
  league: League;
  dateStr: string;

  constructor(
    private dialogRef: MatDialogRef<DetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    this.ratedGame = data.ratedGame;
    this.league = data.league;
    console.log('this.league');
    console.log(this.league);
    this.dateStr = this.showDate(data.ratedGame.date_played);
  }

  ngOnInit() { }

  showDate(date: Date): string {
    // date is a string
    date = new Date(date);
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleString('en-US', options);
  }
}
