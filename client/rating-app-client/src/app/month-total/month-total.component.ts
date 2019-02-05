import { Component, OnInit, Input } from '@angular/core';

import { MonthTotal } from '../month-total';

@Component({
  selector: 'app-month-total',
  templateUrl: './month-total.component.html',
  styleUrls: ['./month-total.component.css']
})
export class MonthTotalComponent implements OnInit {
  @Input() monthTotal: MonthTotal;

  ngOnInit() {
    console.log('init');
    console.log('this.monthTotal');
    console.log(this.monthTotal);
  }

}
