import { Game } from './game';
import { Rating } from './rating';
import { WithId } from './with-id';
import { User } from './user';

export class RatedUser {
  user: WithId<User>;
  rating: WithId<Rating>;
  minRating: number;
  maxRating: number;
}
