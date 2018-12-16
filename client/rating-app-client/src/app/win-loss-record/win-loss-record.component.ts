import { Component, OnInit, Input } from '@angular/core';

import { WinLossRecord } from '../win-loss-record';

@Component({
  selector: 'app-win-loss-record',
  templateUrl: './win-loss-record.component.html',
  styleUrls: ['./win-loss-record.component.css']
})
export class WinLossRecordComponent implements OnInit {
  @Input() winLossRecord: WinLossRecord;
  winPercentage: number;

  constructor() { }

  ngOnInit() {
    this.winPercentage =
      (this.winLossRecord.wins * 100) / this.winLossRecord.losses;
  }

}
