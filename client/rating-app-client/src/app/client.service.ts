import { Injectable } from '@angular/core';

import { interval } from 'rxjs';

import { GameService } from './game.service';
import { LeagueService } from './league.service';
import { RatingService } from './rating.service';
import { UserService } from './user.service';

import { Game } from './game';
import { Rating } from './rating';
import { League } from './league';
import { User } from './user';
import { RatedUser } from './rated-user';
import { WithId } from './with-id';
import { LeagueWithGames } from './league-with-games';
import { LeagueWithRatings } from './league-with-ratings';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  users: WithId<User>[];
  leagues: WithId<League>[];
  leagueById: Map<number, League>;
  leaguesWithGames: LeagueWithGames[];
  leaguesWithRatings: LeagueWithRatings[];
  ratedUsers: Map<number, Map<number, RatedUser>>;

  initialized = false;

  refresh_frequency_seconds = 300;

  constructor(
    private gameService: GameService,
    private leagueService: LeagueService,
    private userService: UserService,
    private ratingService: RatingService,
  ) {

    interval(1000 * this.refresh_frequency_seconds).subscribe(x => {
      this.loadAllData();
    });
  }

  loadAllData() {
    this.loadUsersThen( () => {
      this.loadLeaguesThen( () => {
        this.loadGamesThen( () => {
          this.loadRatingsThen( () => {
            this.initialized = true;
          });
        });
      });
    });
  }

  loadLeaguesThen(fn) {
    this.leagueService.getLeagues().subscribe(leagues => {
      this.leagues = leagues;
      const leagueById = new Map();
      for (const league of leagues) {
        leagueById.set(league.id, league.entity);
      }
      this.leagueById = leagueById;
      fn();
    });
  }

  loadGamesThen(fn) {
    this.gameService.getLeaguesWithGames().subscribe(leaguesWithGames => {
      this.leaguesWithGames = leaguesWithGames;
      fn();
    });
  }

  loadRatingsThen(fn) {
    this.ratingService.getLeaguesWithRatings().subscribe(leaguesWithRatings => {
      this.leaguesWithRatings = leaguesWithRatings;
      console.log('set leaguewWithRatings');
      const ratedUsers = new Map();
      console.log('ratedUsers');
      console.log(ratedUsers);
      for (const leagueWithRatings of leaguesWithRatings) {
        const ratedUsersInLeague = new Map();
        console.log('ratedUsersInLeague');
        console.log(ratedUsersInLeague);
        for (const ratedUser of leagueWithRatings.ratedUsers) {
          console.log('ratedUsersInLeague');
          console.log(ratedUsersInLeague);
          ratedUsersInLeague.set(ratedUser.user.id, ratedUser);
        }
        ratedUsers.set(leagueWithRatings.league.id, ratedUsersInLeague);
      }
      this.ratedUsers = ratedUsers;
      fn();
    });
  }


  loadUsersThen(fn) {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      fn();
    });
  }

  addUser(name: string, image: string) {
    if (!name) { return; }
    name = name.trim();
    if (!image) {
      image = '';
    }
    this.userService
      .addUser({ 'name': name, 'image': image } as User)
      .subscribe( (user) => {
        this.users.push(user);
      });
  }

  addGame(leagueId: number, winnerId: number, loserId: number) {
    const newGame = {
        'league_id': leagueId,
        'winner_id': winnerId,
        'loser_id': loserId,
      } as Game;
    if (!winnerId || !loserId || !leagueId) { return; }
    this.gameService
      .addGame(newGame)
      .subscribe( () => {
        this.loadGamesThen( () => {
          this.loadRatingsThen( () => {
          });
        });
      });
  }

  deleteUser(user: WithId<User>) {
    this.userService.deleteUser(user).subscribe(() => {
      this.users = this.users.filter(u => u !== user);
    });
  }

  addLeague(name: string, image: string): void {
    if (!name) { return; }
    name = name.trim();
    if (!image) {
      image = '';
    }
    this.leagueService
      .addLeague({ 'name': name, 'image': image } as League)
      .subscribe(league => {
        this.leagues.push(league);
      });
  }

  deleteLeague(league: WithId<League>): void {
    this.leagueService.deleteLeague(league).subscribe(() => {
      this.leagues = this.leagues.filter(h => h !== league);
    });
  }

  updateUser(user: WithId<User>) {
    this.userService.updateUser(user).subscribe(() => {
    });
  }

  getUserById(id: number): WithId<User> {
    for (const user of this.users) {
      if (user.id === id) {
        return user;
      }
    }
  }

  getRatedUserById(userId: number, leagueId: number): RatedUser {
    if (this.initialized) {
      const existingRatedUser = this.ratedUsers.get(leagueId).get(userId);
      if (existingRatedUser) {
        return existingRatedUser;
      } else {
        // TODO(alinden): add a rating for that
      }
    } else {
      // TODO(alinden): handle uninitialized
    }
  }

  getLeagueById(id: number): WithId<League> {
    if (this.initialized) {
      return { id: id, entity: this.leagueById.get(id) } as WithId<League>;
    } else {
      // TODO(alinden): handle uninitialized
    }
  }
}
