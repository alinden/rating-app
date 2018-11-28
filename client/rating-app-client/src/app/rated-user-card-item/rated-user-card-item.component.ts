import { Component, OnInit, Input } from '@angular/core';

import { RatedUser } from '../rated-user';

@Component({
  selector: 'app-rated-user-card-item',
  templateUrl: './rated-user-card-item.component.html',
  styleUrls: ['./rated-user-card-item.component.css']
})
export class RatedUserCardItemComponent implements OnInit {
  @Input() ratedUser: RatedUser;

  constructor() { }

  ngOnInit() {
  }

}
