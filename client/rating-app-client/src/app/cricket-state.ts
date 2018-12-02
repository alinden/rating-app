export class CricketState {
  turnIndex: number;
  shotsRemaining: number;
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
}

export enum C {
  Zero = 0,
  One,
  Two,
  Closed
}
