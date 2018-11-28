import { Component, Input, OnInit } from '@angular/core';

import { League } from '../league';
import { WithId } from '../with-id';

import { ClientService } from '../client.service';

@Component({
  selector: 'app-leagues-card-item',
  templateUrl: './leagues-card-item.component.html',
  styleUrls: ['./leagues-card-item.component.css']
})
export class LeaguesCardItemComponent implements OnInit {
  @Input() league: WithId<League>;

  constructor(
    private client: ClientService,
  ) { }

  ngOnInit() {
  }

}
