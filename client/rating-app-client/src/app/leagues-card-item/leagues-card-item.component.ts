import { Component, Input } from '@angular/core';

import { League } from '../league';
import { WithId } from '../with-id';

@Component({
  selector: 'app-leagues-card-item',
  templateUrl: './leagues-card-item.component.html',
  styleUrls: ['./leagues-card-item.component.css']
})
export class LeaguesCardItemComponent {
  @Input() league: WithId<League>;
}
