import { DartShot } from './dart-shot';

export class CricketState {
  turnIndex: number;
  isOver: boolean;
  shotsRemaining: number;
  numPlayers: number;
  scores: number[];
  fifteens: C[];
  fifteenScores: number[];
  sixteens: C[];
  sixteenScores: number[];
  seventeens: C[];
  seventeenScores: number[];
  eightteens: C[];
  eightteenScores: number[];
  nineteens: C[];
  nineteenScores: number[];
  twenties: C[];
  twentyScores: number[];
  bullseyes: C[];
  bullseyeScores: number[];

  constructor(numPlayers: number) {
    this.turnIndex = 0;
    this.isOver = false;
    this.shotsRemaining = 3;
    this.numPlayers = numPlayers;
    this.scores = Array.from({ length : numPlayers },  k => 0);
    this.fifteens = Array.from({ length : numPlayers },  k => C.Zero);
    this.fifteenScores = Array.from({ length : numPlayers },  k => 0);
    this.sixteens = Array.from({ length : numPlayers },  k => C.Zero);
    this.sixteenScores = Array.from({ length : numPlayers },  k => 0);
    this.seventeens = Array.from({ length : numPlayers },  k => C.Zero);
    this.seventeenScores = Array.from({ length : numPlayers },  k => 0);
    this.eightteens = Array.from({ length : numPlayers },  k => C.Zero);
    this.eightteenScores = Array.from({ length : numPlayers },  k => 0);
    this.nineteens = Array.from({ length : numPlayers },  k => C.Zero);
    this.nineteenScores = Array.from({ length : numPlayers },  k => 0);
    this.twenties = Array.from({ length : numPlayers },  k => C.Zero);
    this.twentyScores = Array.from({ length : numPlayers },  k => 0);
    this.bullseyes = Array.from({ length : numPlayers },  k => C.Zero);
    this.bullseyeScores = Array.from({ length : numPlayers },  k => 0);
  }

  updateMarksAndScores(shot: DartShot, turnIndex: number, marksAfter: number, scoresAfter: number) {
    switch (shot.value) {
      case 20: {
        this.twenties[turnIndex] = marksAfter;
        this.twentyScores[turnIndex] = scoresAfter;
        break;
      }
      case 19: {
        this.nineteens[turnIndex] = marksAfter;
        this.nineteenScores[turnIndex] = scoresAfter;
        break;
      }
      case 18: {
        this.eightteens[turnIndex] = marksAfter;
        this.eightteenScores[turnIndex] = scoresAfter;
        break;
      }
      case 17: {
        this.seventeens[turnIndex] = marksAfter;
        this.seventeenScores[turnIndex] = scoresAfter;
        break;
      }
      case 16: {
        this.sixteens[turnIndex] = marksAfter;
        this.sixteenScores[turnIndex] = scoresAfter;
        break;
      }
      case 15: {
        this.fifteens[turnIndex] = marksAfter;
        this.fifteenScores[turnIndex] = scoresAfter;
        break;
      }
      case 25: {
        this.bullseyes[turnIndex] = marksAfter;
        this.bullseyeScores[turnIndex] = scoresAfter;
        break;
      }
    }
    this.scores[turnIndex] =
      this.twentyScores[turnIndex] * 20 +
      this.nineteenScores[turnIndex] * 19 +
      this.eightteenScores[turnIndex] * 18 +
      this.seventeenScores[turnIndex] * 17 +
      this.sixteenScores[turnIndex] * 16  +
      this.fifteenScores[turnIndex]  * 15 +
      this.bullseyeScores[turnIndex] * 25;
  }

  getMarksAndScores(shot: DartShot) {
    let marks: C[];
    let scores: number[];
    let miss = false;
    switch (shot.value) {
      case 20: {
        marks = this.twenties;
        scores = this.twentyScores;
        break;
      }
      case 19: {
        marks = this.nineteens;
        scores = this.nineteenScores;
        break;
      }
      case 18: {
        marks = this.eightteens;
        scores = this.eightteenScores;
        break;
      }
      case 17: {
        marks = this.seventeens;
        scores = this.seventeenScores;
        break;
      }
      case 16: {
        marks = this.sixteens;
        scores = this.sixteenScores;
        break;
      }
      case 15: {
        marks = this.fifteens;
        scores = this.fifteenScores;
        break;
      }
      case 25: {
        marks = this.bullseyes;
        scores = this.bullseyeScores;
        break;
      }
      default: {
        miss = true;
      }
    }
    return [marks, scores];
  }

  isCurrentPlayerTheWinner(numPlayers: number) {
    const playerClosedEverything = (
      (this.twenties[this.turnIndex] === C.Closed) &&
      (this.nineteens[this.turnIndex] === C.Closed) &&
      (this.eightteens[this.turnIndex] === C.Closed) &&
      (this.seventeens[this.turnIndex] === C.Closed) &&
      (this.sixteens[this.turnIndex] === C.Closed) &&
      (this.fifteens[this.turnIndex] === C.Closed) &&
      (this.bullseyes[this.turnIndex] === C.Closed)
    );
    const playerScore = this.scores[this.turnIndex];
    let playerIsWinning = true;
    for (let i = 0; i < numPlayers; i++) {
      if (i !== this.turnIndex) {
        playerIsWinning = playerIsWinning && (this.scores[i] < playerScore);
      }
    }
    return (playerIsWinning && playerClosedEverything);
  }

  updateTurnIndexAndShotsRemaining(numPlayers) {
    // decrement shotsRemaining and switch turns if time
    if (this.shotsRemaining === 1) {
      this.turnIndex = (this.turnIndex + 1) % numPlayers;
      this.shotsRemaining = 3;
    } else {
      this.shotsRemaining = this.shotsRemaining - 1;
    }
  }

  run(shot: DartShot, numPlayers: number): void {
    if (!this.isOver) {
      shot.appliedCount = shot.count;
      const [marks, scores] = this.getMarksAndScores(shot);
      const playerMarksBefore: number = marks[this.turnIndex];
      const playerMarksAfter = Math.min(3, playerMarksBefore + shot.count);
      marks[this.turnIndex] = playerMarksAfter;
      const marksUsed = playerMarksAfter - playerMarksBefore;
      const remainingCount = shot.count - marksUsed;
      const shotScore = shot.value * remainingCount;
      if (playerMarksAfter === C.Closed) {
        if (numPlayers === 2) {
          // add score to player if other players hasn't closed
          const otherPlayerIndex = (this.turnIndex + 1) % 2;
          const otherPlayerClosed = (marks[otherPlayerIndex] === C.Closed);
          if (!otherPlayerClosed) {
            scores[this.turnIndex] += remainingCount;
            this.scores[this.turnIndex] += shotScore;
          } else {
            shot.appliedCount = marksUsed;
          }
        }
      }
      if (this.isCurrentPlayerTheWinner(numPlayers)) {
        this.isOver = true;
      }
      this.updateTurnIndexAndShotsRemaining(numPlayers);
    }
  }

  rewind(prevShot: DartShot, numPlayers: number) {
    const prevShotsRemaining = this.shotsRemaining;
    const prevTurnIndex = this.turnIndex;
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
        if (scoresBefore > prevShot.appliedCount) {
          // Player has points in that number from before the dart being undone.
          scoresAfter = scoresBefore - prevShot.appliedCount;
        } else {
          // Player only scored on this number in the dart being undone.
          scoresAfter = 0;
          marksAfter = 3 - (prevShot.appliedCount - scoresBefore);
        }
      } else {
        // Player has not closed that number.
        marksAfter = marksBefore - prevShot.appliedCount;
      }
      this.updateMarksAndScores(prevShot, newTurnIndex, marksAfter, scoresAfter);
    }
    // Update game state.
    this.isOver = false;
    this.shotsRemaining = newShotsRemaining;
    this.turnIndex = newTurnIndex;
  }


}

export enum C {
  Zero = 0,
  One,
  Two,
  Closed
}
