import { League } from './league';
import { WinLossRecord } from './win-loss-record';
import { WithId } from './with-id';

export class Stats {
  leagueIdAndWinLossRecords: LeagueIdAndWinLossRecords[];
}

export class LeagueIdAndWinLossRecords {
  leagueId: number;
  winLossRecords: WinLossRecord[];
}
