import { Component, OnInit, Input } from '@angular/core';

import { LeagueWithRatings } from '../league-with-ratings';

@Component({
  selector: 'app-ratings-card',
  templateUrl: './ratings-card.component.html',
  styleUrls: ['./ratings-card.component.css']
})
export class RatingsCardComponent implements OnInit {
  @Input() leagueWithRatings: LeagueWithRatings;

  mode: String = 'list';

  enterListMode(): void {
    this.mode = 'list';
  }

  enterDetailsMode(): void {
    this.mode = 'details';
  }

  constructor() { }

  ngOnInit() {
  }

}
