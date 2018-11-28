import { Component, OnInit } from '@angular/core';

import { ClientService } from '../client.service';

import { Rating } from '../rating';
import { LeagueWithRatings } from '../league-with-ratings';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent implements OnInit {
  constructor(public client: ClientService) { }

  ngOnInit() {
    if (!this.client.initialized) {
      this.client.loadAllData();
    }
  }

}
