import { League } from './league';
import { RatedUser } from './rated-user';
import { WithId } from './with-id';

export class LeagueWithRatings {
  league: WithId<League>;
  ratedUsers: RatedUser[];
}
