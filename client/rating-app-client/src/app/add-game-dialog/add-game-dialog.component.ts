import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

import { League } from '../league';
import { User } from '../user';
import { WithId } from '../with-id';

import { Game } from '../game';
import { GameService } from '../game.service';
import { StatsService } from '../stats.service';
import { UserService } from '../user.service';
import { LeagueWithGames } from '../league-with-games';
import { Router } from '@angular/router';

import { WinLossRecord } from '../win-loss-record';

@Component({
  selector: 'app-add-game-dialog',
  templateUrl: './add-game-dialog.component.html',
  styleUrls: ['./add-game-dialog.component.css']
})
export class AddGameDialogComponent implements OnInit {
  users: WithId<User>[] = [];
  league: WithId<League>;

  winner: WithId<User>;
  loser: WithId<User>;

  constructor(
    private gameService: GameService,
    private dialogRef: MatDialogRef<AddGameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    this.users = data.users;
    this.league = data.league;
  }

  ngOnInit() { }

  close() {
    this.dialogRef.close();
  }

  saveGame() {
    const newGame = {
        'league_id': this.league.id,
        'winner_id': this.winner.id,
        'loser_id': this.loser.id,
      } as Game;
    this.dialogRef.close({ newGame: newGame });
  }

}
