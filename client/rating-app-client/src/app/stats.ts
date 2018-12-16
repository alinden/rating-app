import { League } from './league';
import { WinLossRecord } from './win-loss-record';
import { WithId } from './with-id';

export class Stats {
  leagueIdAndWinLossRecords: [number, WinLossRecord[]];
}
