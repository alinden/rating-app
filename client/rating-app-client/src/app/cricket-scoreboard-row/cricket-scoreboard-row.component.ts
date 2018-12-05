import { SimpleChanges, Component, OnInit, Input, OnChanges } from '@angular/core';

import { C, CricketState } from '../cricket-state';

@Component({
  selector: 'app-cricket-scoreboard-row',
  templateUrl: './cricket-scoreboard-row.component.html',
  styleUrls: ['./cricket-scoreboard-row.component.css']
})
export class CricketScoreboardRowComponent implements OnChanges {
  @Input() scores: number[];
  @Input() shots: C[];
  @Input() turnIndex: number;
  activePlayer = 0;
  leftActive = true;
  rightActive = false;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    console.log('onChanges');
    const newActivePlayer = this.turnIndex;
    if (newActivePlayer !== this.activePlayer) {
      this.activePlayer = newActivePlayer;
      if (newActivePlayer === 0) {
        console.log('setting left to active');
        this.leftActive = true;
        this.rightActive = false;
      } else {
        console.log('setting right to active');
        this.leftActive = true;
        this.rightActive = false;
      }
    }
  }

}
