import { Game } from './game';
import { WithId } from './with-id';
import { Rating } from './rating';

export class GameWithRatings {
  game: WithId<Game>;
  winner_rating: WithId<Rating>;
  loser_rating: WithId<Rating>;
}
