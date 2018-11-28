import { Game } from './game';
import { WithId } from './with-id';
import { User } from './user';

export class RatedGame {
  winner: WithId<User>;
  winner_rating: string;
  loser: WithId<User>;
  loser_rating: string;
}
