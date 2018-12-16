import { User } from './user';
import { WithId } from './with-id';

export class WinLossRecord {
  user: WithId<User>;
  wins: number;
  losses: number;
}
