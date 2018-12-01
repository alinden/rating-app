import { Component, OnInit, Input } from '@angular/core';

import { RatedGame } from '../rated-game';

@Component({
  selector: 'app-rated-game-card-item',
  templateUrl: './rated-game-card-item.component.html',
  styleUrls: ['./rated-game-card-item.component.css']
})
export class RatedGameCardItemComponent implements OnInit {
  @Input() ratedGame: RatedGame;
  winnerRatingChange: number;
  loserRatingChange: number;

  constructor() { }

  ngOnInit() {
    this.winnerRatingChange = this.ratedGame.winner_rating.entity.new_rating -
      this.ratedGame.winner_rating.entity.previous_rating;

    this.loserRatingChange = this.ratedGame.loser_rating.entity.new_rating -
      this.ratedGame.loser_rating.entity.previous_rating;
  }

}
