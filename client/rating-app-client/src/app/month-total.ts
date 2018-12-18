import { User } from './user';
import { WithId } from './with-id';

export class MonthTotal {
  user: WithId<User>;
  month: string;
  net_wins: number;
}
