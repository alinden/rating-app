import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

import { RatedUser } from '../rated-user';
import { League } from '../league';

@Component({
  selector: 'app-rating-history-dialog',
  templateUrl: './rating-history-dialog.component.html',
  styleUrls: ['./rating-history-dialog.component.css']
})
export class RatingHistoryDialogComponent implements OnInit {

  ratedUser: RatedUser;
  league: League;

  constructor(
    private dialogRef: MatDialogRef<RatingHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    this.ratedUser = data.ratedUser;
    this.league = data.league;
  }

  ngOnInit() {
  }

}
