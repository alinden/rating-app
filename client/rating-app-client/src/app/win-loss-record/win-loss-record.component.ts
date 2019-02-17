import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { WinLossRecord } from '../win-loss-record';

@Component({
  selector: 'app-win-loss-record',
  templateUrl: './win-loss-record.component.html',
  styleUrls: ['./win-loss-record.component.css']
})
export class WinLossRecordComponent implements OnInit {
  @Input() winLossRecord: WinLossRecord;
  winPercentage: number;

  @Output() userSelected = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
    this.winPercentage =
      this.winLossRecord.wins / (this.winLossRecord.wins + this.winLossRecord.losses);
  }

  selectUser(userId: number) {
    this.userSelected.emit(userId);
  }



}
