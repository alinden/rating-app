import { Game } from './game';
import { League } from './league';
import { WithId } from './with-id';
import { User } from './user';
import { RatedUser } from './rated-user';

export class LiveGame<S> {
  summary: string;
  players: RatedUser[];
  state: S;
}
