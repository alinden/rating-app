import { Component, OnInit, Input } from '@angular/core';

import { RatedGame } from '../rated-game';

@Component({
  selector: 'app-rated-game-card-item',
  templateUrl: './rated-game-card-item.component.html',
  styleUrls: ['./rated-game-card-item.component.css']
})
export class RatedGameCardItemComponent {
  @Input() ratedGame: RatedGame;
}
