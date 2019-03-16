import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GameService } from '../game.service';
import { RatingService } from '../rating.service';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatGridList } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { League } from '../league';
import { RatedUser } from '../rated-user';
import { WithId } from '../with-id';
import { User } from '../user';
import { Rating } from '../rating';
import { Game } from '../game';
import { LiveGame } from '../live-game';
import { GameType } from '../game-type';
import { CricketState, C } from '../cricket-state';
import { LeagueWithRatings } from '../league-with-ratings';
import { DartShot } from '../dart-shot';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-keep-score',
  templateUrl: './keep-score.component.html',
  styleUrls: ['./keep-score.component.css']
})
export class KeepScoreComponent implements OnInit {
  @Input() playerOneId: number;
  @Input() playerTwoId: number;

  leagueId: number;
  liveGame: LiveGame<any>;
  gameType: GameType;
  league: WithId<League>;
  rules: string;
  mode: string;
  shotHistory: DartShot[] = [];
  users: WithId<User>[] = [];

  leagueWithRatings: LeagueWithRatings;

  private sub: any;

  enterGameMode() {
    this.mode = 'game';
  }

  enterLagMode() {
    this.mode = 'lag';
  }

  recordLag() {
    let playerOne = this.leagueWithRatings.ratedUsers.find((ratedUser) => {
      return ratedUser.user.id === this.playerOneId;
    });
    let playerTwo = this.leagueWithRatings.ratedUsers.find((ratedUser) => {
      return ratedUser.user.id === this.playerTwoId;
    });
    if (!playerOne) {
      const unratedPlayerOne = this.users.find((user) => {
        return user.id === this.playerOneId;
      });
      const newRating = {
        id: 0,
        entity: {
          league_id: 0,
          user_id: unratedPlayerOne.id,
          last_game_id: 0,
          new_rating: 1500,
          previous_rating: 1500,
        }
      } as WithId<Rating>;
      playerOne = {
        user: unratedPlayerOne,
        rating: newRating,
      } as RatedUser;
    }
    if (!playerTwo) {
      const unratedPlayerTwo = this.users.find((user) => {
        return user.id === this.playerTwoId;
      });
      const newRating = {
        id: 0,
        entity: {
          league_id: 0,
          user_id: unratedPlayerTwo.id,
          last_game_id: 0,
          new_rating: 1500,
          previous_rating: 1500,
        }
      } as WithId<Rating>;
      playerTwo = {
        user: unratedPlayerTwo,
        rating: newRating,
      } as RatedUser;
    }
    this.startGame([playerOne, playerTwo]);
    this.enterGameMode();
  }

  nextTurn() {
    const shotsSkipped = 3 - this.liveGame.state.shotsRemaining;
    this.liveGame.state.shotsRemaining = 3;
    const beforeTurnIndex = this.liveGame.state.turnIndex;
    const afterTurnIndex = (this.liveGame.state.turnIndex + 1) % 2;
    if (afterTurnIndex < beforeTurnIndex) {
      this.liveGame.state.turnCount++;
    }
    this.liveGame.state.turnIndex = afterTurnIndex;
    this.shotHistory.push({ value: -1, count: shotsSkipped , appliedCount: shotsSkipped});
  }

  undo() {
    if (!this.shotHistory.length) {
      // Can't undo at the beginning of the game.
      return;
    } else {
      const prevShot = this.shotHistory.pop();
      this.liveGame.state.rewind(prevShot, this.liveGame.players.length);
    }
  }

  saveGame() {
    if (this.liveGame.state.isOver) {
      this.liveGame.winner = this.liveGame.players[this.liveGame.state.turnIndex].user;
      this.liveGame.loser = this.liveGame.players[((this.liveGame.state.turnIndex + 1) % 2)].user;
      const newGame = {
        'league_id': this.leagueId,
        'winner_id': this.liveGame.winner.id,
        'loser_id': this.liveGame.loser.id,
      } as Game;
      this.gameService.addGame(newGame).subscribe(() => {
        this.router.navigate([`/Games/${this.leagueWithRatings.league.entity.name}`]);
      });
    }
  }

  recordShot(shot: DartShot) {
    if (!this.liveGame.state.isOver) {
      this.liveGame.state.run(shot, this.liveGame.players.length);
      this.shotHistory.push(shot);
      if (this.liveGame.state.isOver) {
        // Game ended on this turn.
        this.liveGame.winner = this.liveGame.players[this.liveGame.state.turnIndex].user;
        this.liveGame.loser = this.liveGame.players[((this.liveGame.state.turnIndex + 1) % 2)].user;
      }
    }
  }

  startGame(players: RatedUser[]) {
    const numPlayers = players.length;
    const state = new CricketState(numPlayers);
    this.liveGame = {
      players: players,
      state: state,
      winner: null,
      loser: null
    };
  }

  constructor(
    private route: ActivatedRoute,
    private mediaObserver: MediaObserver,
    private ratingService: RatingService,
    private gameService: GameService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.leagueId = +params['leagueId'];
      this.ratingService.getLeagueWithRatings(this.leagueId).subscribe((leagueWithRatings) => {
        this.leagueWithRatings = leagueWithRatings;
        this.userService.getUsers().subscribe((users) => {
          this.users = users;
          this.enterLagMode();
        });
      });
    });
  }
}
