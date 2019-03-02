import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { MonthTotal } from '../month-total';

@Component({
  selector: 'app-month-total',
  templateUrl: './month-total.component.html',
  styleUrls: ['./month-total.component.css']
})
export class MonthTotalComponent implements OnInit {
  @Input() monthTotal: MonthTotal;

  @Output() userSelected = new EventEmitter<number>();

  ngOnInit() {
  }

  selectUser(userId: number) {
    this.userSelected.emit(userId);
  }

}
