import { League } from './league';
import { RatedGame } from './rated-game';
import { WithId } from './with-id';

export class LeagueWithGames {
  league: WithId<League>;
  ratedGames: RatedGame[];
}
