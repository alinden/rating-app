import { WithId } from './with-id';
import { User } from './user';
import { Rating } from './rating';

export class RatedGame {
  winner: WithId<User>;
  winner_rating: WithId<Rating>;
  loser: WithId<User>;
  loser_rating: WithId<Rating>;
  date_played: Date;
}
