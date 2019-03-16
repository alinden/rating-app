import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

import { RatedUser } from '../rated-user';
import { RatingHistory } from '../rating-history';
import { League } from '../league';

@Component({
  selector: 'app-rating-history-dialog',
  templateUrl: './rating-history-dialog.component.html',
  styleUrls: ['./rating-history-dialog.component.css']
})
export class RatingHistoryDialogComponent {

  ratingHistory: RatingHistory[];
  ratedUser: RatedUser;
  league: League;

  colorScheme = {
    domain: [
      '#0336FF',
    ]
  };

  constructor(
    private dialogRef: MatDialogRef<RatingHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    this.ratedUser = data.ratedUser;
    for (const record of data.ratingHistory.series) {
      record.name = record.name.slice(0,16);
    }
    this.ratingHistory = [data.ratingHistory];
    this.league = data.league;
  }

}
