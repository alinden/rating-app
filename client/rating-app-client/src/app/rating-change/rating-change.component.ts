import { Component, OnInit, Input } from '@angular/core';

import { Rating } from '../rating';

@Component({
  selector: 'app-rating-change',
  templateUrl: './rating-change.component.html',
  styleUrls: ['./rating-change.component.css']
})
export class RatingChangeComponent implements OnInit {
  @Input() rating: Rating;
  change: number;
  isIncrease: boolean;

  constructor() { }

  ngOnInit() {
    const change = this.rating.new_rating - this.rating.previous_rating;
    this.isIncrease = change > 0;
    if (this.isIncrease) {
      this.change = change;
    } else {
      this.change = -change;
    }
  }

}
