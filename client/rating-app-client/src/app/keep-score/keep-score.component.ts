import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { League } from '../league';
import { RatedUser } from '../rated-user';
import { WithId } from '../with-id';
import { LiveGame } from '../live-game';
import { GameType } from '../game-type';
import { CricketState, C } from '../cricket-state';
import { DartShot } from '../dart-shot';
import { ClientService } from '../client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-keep-score',
  templateUrl: './keep-score.component.html',
  styleUrls: ['./keep-score.component.css']
})
export class KeepScoreComponent implements OnInit {
  leagueId: number;
  liveGame: LiveGame<any>;
  gameType: GameType;
  league: WithId<League>;
  rules: string;
  private sub: any;

  saveGame() {
    this.client.addGame(
      this.league.id,
      this.liveGame.winner.id,
      this.liveGame.loser.id
    );
    this.router.navigate(['/games']);
  }

  cancelGame() {
    console.log('cance');
  }

  recordShot(shot: DartShot) {
    if (!this.liveGame.isOver) {
      console.log('recordShot');
      console.log(JSON.stringify(shot));

      // get relevant data from game state
      let shots: C[];
      let scores: number[];
      let miss = false;
      switch (shot.value) {
        case 20: {
          shots = this.liveGame.state.twenties;
          scores = this.liveGame.state.twentyScores;
          break;
        }
        case 19: {
          shots = this.liveGame.state.nineteens;
          scores = this.liveGame.state.nineteenScores;
          break;
        }
        case 18: {
          shots = this.liveGame.state.eightteens;
          scores = this.liveGame.state.eightteenScores;
          break;
        }
        case 17: {
          shots = this.liveGame.state.seventeens;
          scores = this.liveGame.state.seventeenScores;
          break;
        }
        case 16: {
          shots = this.liveGame.state.sixteens;
          scores = this.liveGame.state.sixteenScores;
          break;
        }
        case 15: {
          shots = this.liveGame.state.fifteens;
          scores = this.liveGame.state.fifteenScores;
          break;
        }
        case 25: {
          shots = this.liveGame.state.bullseyes;
          scores = this.liveGame.state.bullseyeScores;
          break;
        }
        default: {
          miss = true;
        }
      }

      // record closing/ points
      if (!miss) {
        console.log('not a miss');
        const playerShotsBefore: number = shots[this.liveGame.state.turnIndex];
        console.log('playerShots before');
        console.log(JSON.stringify(playerShotsBefore));
        const playerShotsAfter = Math.min(3, playerShotsBefore + shot.count);
        console.log('playerShots after');
        console.log(JSON.stringify(playerShotsAfter));
        shots[this.liveGame.state.turnIndex] = playerShotsAfter;
        const shotsUsed = playerShotsAfter - playerShotsBefore;
        console.log('shotsUsed');
        console.log(shotsUsed);
        const remainingCount = shot.count - shotsUsed;
        console.log('remainingCount');
        console.log(remainingCount);
        const shotScore = shot.value * remainingCount;
        if (playerShotsAfter === C.Closed) {
          console.log('player shots closed - recording possible points');
          if (this.liveGame.players.length === 2) {
            // add score to player if other players hasn't closed
            const otherPlayerIndex = (this.liveGame.state.turnIndex + 1) % 2;
            const otherPlayerClosed = (shots[otherPlayerIndex] === C.Closed);
            if (!otherPlayerClosed) {
              scores[this.liveGame.state.turnIndex] += shotScore;
              this.liveGame.state.scores[this.liveGame.state.turnIndex] += shotScore;
            }
          } else {
            console.log('multiplayer cricket scoring not implemented yet');
          }
        } else {
          console.log('player shots not closed yet');
        }
      }

      // check if the game is over
      const playerClosedEverything = (
        (this.liveGame.state.twenties[this.liveGame.state.turnIndex] === C.Closed) &&
        (this.liveGame.state.nineteens[this.liveGame.state.turnIndex] === C.Closed) &&
        (this.liveGame.state.eightteens[this.liveGame.state.turnIndex] === C.Closed) &&
        (this.liveGame.state.seventeens[this.liveGame.state.turnIndex] === C.Closed) &&
        (this.liveGame.state.sixteens[this.liveGame.state.turnIndex] === C.Closed) &&
        (this.liveGame.state.fifteens[this.liveGame.state.turnIndex] === C.Closed) &&
        (this.liveGame.state.bullseyes[this.liveGame.state.turnIndex] === C.Closed)
      );
      const playerScore = this.liveGame.state.scores[this.liveGame.state.turnIndex];
      let playerIsWinning = true;
      for (let i = 0; i++; i < this.liveGame.players.length) {
        if (i !== this.liveGame.state.turnIndex) {
          playerIsWinning = playerIsWinning && (this.liveGame.state.scores[i] < playerScore);
        }
      }
      if (playerIsWinning && playerClosedEverything) {
        this.liveGame.isOver = true;
        this.liveGame.winner = this.liveGame.players[this.liveGame.state.turnIndex].user;
        this.liveGame.loser = this.liveGame.players[((this.liveGame.state.turnIndex + 1) % 2)].user;
      }

      // decrement shotsRemaining and switch turns if time
      if (this.liveGame.state.shotsRemaining === 1) {
        this.liveGame.state.turnIndex =
          (this.liveGame.state.turnIndex + 1) % this.liveGame.players.length;
        this.liveGame.state.shotsRemaining = 3;
      } else {
        this.liveGame.state.shotsRemaining = this.liveGame.state.shotsRemaining - 1;
      }
    }
  }

  startGame(gameType: GameType, players: RatedUser[]) {
    const numPlayers = players.length;
    const state = {
      turnIndex: 0,
      shotsRemaining: 3,
      scores: Array.from({ length : numPlayers },  k => 0),
      fifteens: Array.from({ length : numPlayers },  k => C.Zero),
      fifteenScores: Array.from({ length : numPlayers },  k => 0),
      sixteens: Array.from({ length : numPlayers },  k => C.Zero),
      sixteenScores: Array.from({ length : numPlayers },  k => 0),
      seventeens: Array.from({ length : numPlayers },  k => C.Zero),
      seventeenScores: Array.from({ length : numPlayers },  k => 0),
      eightteens: Array.from({ length : numPlayers },  k => C.Zero),
      eightteenScores: Array.from({ length : numPlayers },  k => 0),
      nineteens: Array.from({ length : numPlayers },  k => C.Zero),
      nineteenScores: Array.from({ length : numPlayers },  k => 0),
      twenties: Array.from({ length : numPlayers },  k => C.Zero),
      twentyScores: Array.from({ length : numPlayers },  k => 0),
      bullseyes: Array.from({ length : numPlayers },  k => C.Zero),
      bullseyeScores: Array.from({ length : numPlayers },  k => 0),
    } as CricketState;
    this.liveGame = {
      players: players,
      isOver: false,
      state: state,
      winner: null,
      loser: null
    };
  }

  constructor(
    private route: ActivatedRoute,
    private client: ClientService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const leagueAndPlayers = JSON.parse(params['leagueAndPlayers']);
      this.leagueId = leagueAndPlayers['league'];
      const playerIds = leagueAndPlayers['players'];
      this.rules = 'cricket';
      this.gameType = GameType.Cricket;
      this.league = this.client.getLeagueById(this.leagueId);
      const players = playerIds.map((id) =>
        this.client.getRatedUserById(id, this.leagueId)
      );
      this.startGame(GameType.Cricket, players);
    });
  }
}
