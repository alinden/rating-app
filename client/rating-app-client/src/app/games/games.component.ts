import { Component, OnInit } from '@angular/core';

import { ClientService } from '../client.service';

import { Game } from '../game';
import { LeagueWithGames } from '../league-with-games';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  constructor(
    public client: ClientService,
  ) { }

  ngOnInit() {
    if (!this.client.initialized) {
      this.client.loadAllData();
    }
  }

}
