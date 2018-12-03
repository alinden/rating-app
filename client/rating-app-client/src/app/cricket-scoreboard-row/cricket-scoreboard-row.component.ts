import { Component, OnInit, Input } from '@angular/core';

import { C } from '../cricket-state';

@Component({
  selector: 'app-cricket-scoreboard-row',
  templateUrl: './cricket-scoreboard-row.component.html',
  styleUrls: ['./cricket-scoreboard-row.component.css']
})
export class CricketScoreboardRowComponent implements OnInit {
  @Input() scores: number[];
  @Input() shots: C[];

  constructor() { }

  ngOnInit() {
  }

}
