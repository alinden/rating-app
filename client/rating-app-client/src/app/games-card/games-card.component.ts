import { Component, OnInit, Input } from '@angular/core';

import { ClientService } from '../client.service';

import { Game } from '../game';
import { User } from '../user';
import { WithId } from '../with-id';
import { LeagueWithGames } from '../league-with-games';

@Component({
  selector: 'app-games-card',
  templateUrl: './games-card.component.html',
  styleUrls: ['./games-card.component.css']
})
export class GamesCardComponent implements OnInit {
  @Input() leagueWithGames: LeagueWithGames;

  @Input() winnerId: number;
  @Input() loserId: number;

  mode: String = 'list';

  enterAddMode(): void {
    this.mode = 'add';
  }

  enterListMode(): void {
    this.mode = 'list';
  }

  enterDetailsMode(): void {
    this.mode = 'details';
  }

  saveGame(): void {
    this.client.addGame(this.leagueWithGames.league.id, this.winnerId, this.loserId);
    this.enterListMode();
  }

  keepScore(): void {
    alert('keep score');
  }

  constructor(
    private client: ClientService,
  ) { }


  ngOnInit() {
  }

}
