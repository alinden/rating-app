import { League } from './league';
import { WinLossRecord } from './win-loss-record';
import { MonthTotal } from './month-total';
import { WithId } from './with-id';

export class Stats {
  leagueIdAndWinLossRecords: [number, WinLossRecord[]];
  leagueIdAndMonthTotals: [number, MonthTotal[]];
}
