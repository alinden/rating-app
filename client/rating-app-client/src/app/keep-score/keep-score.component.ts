import { Component, OnInit, Input } from '@angular/core';
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
  @Input() playerOneId: number;
  @Input() playerTwoId: number;

  leagueId: number;
  liveGame: LiveGame<any>;
  gameType: GameType;
  league: WithId<League>;
  rules: string;
  mode: string;
  shotHistory: DartShot[] = [];

  private sub: any;

  enterGameMode() {
    this.mode = 'game';
  }

  enterLagMode() {
    this.mode = 'lag';
  }

  recordLag() {
    const playerOne = this.client.getRatedUserById(this.playerOneId, this.leagueId);
    const playerTwo = this.client.getRatedUserById(this.playerTwoId, this.leagueId);
    this.startGame([playerOne, playerTwo]);
    this.enterGameMode();
  }

  nextTurn() {
    const shotsSkipped = 3 - this.liveGame.state.shotsRemaining;
    this.liveGame.state.shotsRemaining = 3;
    this.liveGame.state.turnIndex = (this.liveGame.state.turnIndex + 1) % 2;
    this.shotHistory.push({ value: -1, count: shotsSkipped });
    console.log(this.liveGame.state);
  }

  undo() {
    const prevShot = this.shotHistory.pop();
    const prevShotsRemaining = this.liveGame.state.shotsRemaining;
    const prevTurnIndex = this.liveGame.state.turnIndex;
    let newTurnIndex;
    let newShotsRemaining;
    if (prevShot.value === -1) {
      // prevShot was a "Next Turn", that skipped prevShot.count shots.
      newShotsRemaining = 3 - prevShot.count;
      newTurnIndex = (prevTurnIndex + 1) % 2;
    } else {
      // prevShot was not a "Next Turn".
      if (prevShotsRemaining === 3) {
        // Undoing at start of new turn - rewind to last shot of previous turn.
        newShotsRemaining = 1;
        newTurnIndex = (prevTurnIndex + 1) % 2;
      } else {
        // Undoing mid-turn - add one to shot counter.
        newShotsRemaining = prevShotsRemaining + 1;
        newTurnIndex = prevTurnIndex;
      }
      const [marks, scores] = this.getMarksAndScores(prevShot);
      const marksBefore = marks[newTurnIndex];
      const scoresBefore = scores[newTurnIndex];
      let marksAfter = marksBefore;
      let scoresAfter = scoresBefore;
      if (marksBefore === 3) {
        // Player had closed that number - undo points first.
        const numberOfScores = scoresBefore / prevShot.value;
        if (numberOfScores > prevShot.count) {
          // Player has points in that number from before the dart being undone.
          scoresAfter = (numberOfScores - prevShot.count) * prevShot.value;
        } else {
          // Player only scored on this number in the dart begin undone.
          scoresAfter = 0;
          marksAfter = 3 - (prevShot.count - numberOfScores);
        }
      } else {
        // Player has not closed that number.
        marksAfter = marksBefore - prevShot.count;
      }
      this.updateMarksAndScores(prevShot, newTurnIndex, marksAfter, scoresAfter);
    }
    // Update game state.
    this.liveGame.isOver = false;
    this.liveGame.state.shotsRemaining = newShotsRemaining;
    this.liveGame.state.turnIndex = newTurnIndex;
  }

  saveGame() {
    this.client.addGame(
      this.league.id,
      this.liveGame.winner.id,
      this.liveGame.loser.id
    );
    this.router.navigate(['/games']);
  }

  updateMarksAndScores(shot: DartShot, turnIndex: number, marksAfter: number, scoresAfter: number) {
    switch (shot.value) {
      case 20: {
        this.liveGame.state.twenties[turnIndex] = marksAfter;
        this.liveGame.state.twentyScores[turnIndex] = scoresAfter;
        break;
      }
      case 19: {
        this.liveGame.state.nineteens[turnIndex] = marksAfter;
        this.liveGame.state.nineteenScores[turnIndex] = scoresAfter;
        break;
      }
      case 18: {
        this.liveGame.state.eightteens[turnIndex] = marksAfter;
        this.liveGame.state.eightteenScores[turnIndex] = scoresAfter;
        break;
      }
      case 17: {
        this.liveGame.state.seventeens[turnIndex] = marksAfter;
        this.liveGame.state.seventeenScores[turnIndex] = scoresAfter;
        break;
      }
      case 16: {
        this.liveGame.state.sixteens[turnIndex] = marksAfter;
        this.liveGame.state.sixteenScores[turnIndex] = scoresAfter;
        break;
      }
      case 15: {
        this.liveGame.state.fifteens[turnIndex] = marksAfter;
        this.liveGame.state.fifteenScores[turnIndex] = scoresAfter;
        break;
      }
      case 25: {
        this.liveGame.state.bullseyes[turnIndex] = marksAfter;
        this.liveGame.state.bullseyeScores[turnIndex] = scoresAfter;
        break;
      }
    }
    this.liveGame.state.scores[turnIndex] =
      this.liveGame.state.twentyScores[turnIndex] +
      this.liveGame.state.nineteenScores[turnIndex] +
      this.liveGame.state.eightteenScores[turnIndex] +
      this.liveGame.state.seventeenScores[turnIndex] +
      this.liveGame.state.sixteenScores[turnIndex] +
      this.liveGame.state.fifteenScores[turnIndex] +
      this.liveGame.state.bullseyeScores[turnIndex];
  }

  getMarksAndScores(shot: DartShot) {
    let marks: C[];
    let scores: number[];
    let miss = false;
    switch (shot.value) {
      case 20: {
        marks = this.liveGame.state.twenties;
        scores = this.liveGame.state.twentyScores;
        break;
      }
      case 19: {
        marks = this.liveGame.state.nineteens;
        scores = this.liveGame.state.nineteenScores;
        break;
      }
      case 18: {
        marks = this.liveGame.state.eightteens;
        scores = this.liveGame.state.eightteenScores;
        break;
      }
      case 17: {
        marks = this.liveGame.state.seventeens;
        scores = this.liveGame.state.seventeenScores;
        break;
      }
      case 16: {
        marks = this.liveGame.state.sixteens;
        scores = this.liveGame.state.sixteenScores;
        break;
      }
      case 15: {
        marks = this.liveGame.state.fifteens;
        scores = this.liveGame.state.fifteenScores;
        break;
      }
      case 25: {
        marks = this.liveGame.state.bullseyes;
        scores = this.liveGame.state.bullseyeScores;
        break;
      }
      default: {
        miss = true;
      }
    }
    return [marks, scores];
  }

  recordShot(shot: DartShot) {
    if (!this.liveGame.isOver) {

      // get relevant data from game state
      const [marks, scores] = this.getMarksAndScores(shot);

      const playerMarksBefore: number = marks[this.liveGame.state.turnIndex];
      const playerMarksAfter = Math.min(3, playerMarksBefore + shot.count);
      marks[this.liveGame.state.turnIndex] = playerMarksAfter;
      const marksUsed = playerMarksAfter - playerMarksBefore;
      const remainingCount = shot.count - marksUsed;
      const shotScore = shot.value * remainingCount;
      if (playerMarksAfter === C.Closed) {
        if (this.liveGame.players.length === 2) {
          // add score to player if other players hasn't closed
          const otherPlayerIndex = (this.liveGame.state.turnIndex + 1) % 2;
          const otherPlayerClosed = (marks[otherPlayerIndex] === C.Closed);
          if (!otherPlayerClosed) {
            scores[this.liveGame.state.turnIndex] += shotScore;
            this.liveGame.state.scores[this.liveGame.state.turnIndex] += shotScore;
          }
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

      this.shotHistory.push(shot);
    }
  }

  startGame(players: RatedUser[]) {
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
      this.leagueId = +params['leagueId'];
    });
    if (!this.client.initialized) {
      this.client.loadAllData();
      this.league = this.client.getLeagueById(this.leagueId);
    } else {
      this.league = this.client.getLeagueById(this.leagueId);
    }
    this.enterLagMode();
  }
}
