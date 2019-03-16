import { League } from './league';
import { RatedUser } from './rated-user';
import { WithId } from './with-id';

export class RatingHistory {
  /** league name */
  name: string;
  /** data */
  series: RatingHistoryRecord[];
}

export class RatingHistoryRecord {
  /** rating */
  value: number;
  /** ISO timestamp string. "2016-09-20T01:51:53.101Z" e.g. */
  name: string;
}

