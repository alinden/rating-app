import { User } from './user';
import { WithId } from './with-id';

export class MonthTotal {
  user: WithId<User>;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
}
