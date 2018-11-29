import { Game } from './game';
import { WithId } from './with-id';
import { User } from './user';

export class RatedUser {
  user: WithId<User>;
  rating: number;
}
