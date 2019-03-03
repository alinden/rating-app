import { Injectable } from '@angular/core';

import { interval } from 'rxjs';

import { GameService } from './game.service';
import { LeagueService } from './league.service';
import { RatingService } from './rating.service';
import { UserService } from './user.service';
import { StatsService } from './stats.service';

import { Game } from './game';
import { Rating } from './rating';
import { League } from './league';
import { User } from './user';
import { RatedUser } from './rated-user';
import { WithId } from './with-id';
import { LeagueWithGames } from './league-with-games';
import { LeagueWithRatings } from './league-with-ratings';
import { WinLossRecord } from './win-loss-record';
import { MonthTotal } from './month-total';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  users: WithId<User>[];
  leagues: WithId<League>[];
  leaguesWithGames: LeagueWithGames[] = [];
  leaguesWithRatings: LeagueWithRatings[];

  userById: Map<number, WithId<User>>;
  leagueById: Map<number, WithId<League>>;
  winLossRecordsByLeagueId: Map<number, WinLossRecord[]>;
  monthTotalsByLeagueId: Map<number, MonthTotal[]>;
  leagueWithGamesById: Map<number, LeagueWithGames>;
  leagueWithRatingsById: Map<number, LeagueWithRatings>;
  ratedUsers: Map<number, Map<number, RatedUser>>;

  initialized = false;

  refresh_frequency_seconds = 300;

  constructor(
    private gameService: GameService,
    private leagueService: LeagueService,
    private userService: UserService,
    private ratingService: RatingService,
    private statsService: StatsService,
  ) {

    interval(1000 * this.refresh_frequency_seconds).subscribe(x => {
      this.reloadGamesAndRatings();
    });
  }

  reloadGamesAndRatings() {
    this.loadGamesThen( () => {
      this.loadRatingsThen( () => {
        this.loadStatsThen( () => {
        });
      });
    });
  }

  loadAllData() {
    this.loadUsersThen( () => {
      this.loadLeaguesThen( () => {
        this.loadGamesThen( () => {
          this.loadRatingsThen( () => {
            this.loadStatsThen( () => {
              this.initialized = true;
            });
          });
        });
      });
    });
  }

  loadLeaguesThen(fn) {
    this.leagueService.getLeagues().subscribe(leagues => {
      this.leagues = leagues;
      this.leagueById = new Map();
      for (const league of leagues) {
        this.leagueById.set(league.id, league);
      }
      fn();
    });
  }

  loadGamesThen(fn) {
    this.gameService.getLeaguesWithGames().subscribe(leaguesWithGames => {
      this.leaguesWithGames = leaguesWithGames;
      this.leagueWithGamesById = new Map();
      for (const leagueWithGames of leaguesWithGames) {
        this.leagueWithGamesById.set(leagueWithGames.league.id, leagueWithGames);
      }
      fn();
    });
  }

  loadRatingsThen(fn) {
    this.ratingService.getLeaguesWithRatings().subscribe(leaguesWithRatings => {
      this.leaguesWithRatings = leaguesWithRatings;
      this.leagueWithRatingsById = new Map();
      this.ratedUsers = new Map();
      for (const leagueWithRatings of leaguesWithRatings) {
        this.leagueWithRatingsById.set(leagueWithRatings.league.id, leagueWithRatings);
        const ratedUsersForLeague = new Map();
        for (const ratedUser of leagueWithRatings.ratedUsers) {
          ratedUsersForLeague.set(ratedUser.user.id, ratedUser);
        }
        this.ratedUsers.set(leagueWithRatings.league.id, ratedUsersForLeague);
      }
      fn();
    });
  }

  loadStatsThen(fn) {
    this.statsService.getStats().subscribe(stats => {
      this.winLossRecordsByLeagueId = new Map();
      for (const leagueIdAndWinLossRecords of stats.leagueIdAndWinLossRecords) {
        this.winLossRecordsByLeagueId.set(leagueIdAndWinLossRecords[0],
          leagueIdAndWinLossRecords[1]);
      }
      this.monthTotalsByLeagueId = new Map();
      for (const leagueIdAndMonthTotals of stats.leagueIdAndMonthTotals) {
        this.monthTotalsByLeagueId.set(leagueIdAndMonthTotals[0],
          leagueIdAndMonthTotals[1]);
      }
      fn();
    });
  }

  loadUsersThen(fn) {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.userById = new Map();
      for (const user of users) {
        this.userById.set(user.id, user);
      }
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
        this.userById.set(user.id, user);
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
        this.reloadGamesForLeagueId(leagueId);
        this.reloadRatingsForLeagueId(leagueId);
      });
  }

  reloadGamesForLeagueId(leagueId: number) {
    this.gameService.reloadLeagueWithGames(leagueId).subscribe( (leagueWithGames) => {
      this.leagueWithGamesById.set(leagueId, leagueWithGames);
      this.leaguesWithGames = this.leagues.map( (league) => {
        return this.leagueWithGamesById.get(league.id);
      });
    });
  }

  reloadRatingsForLeagueId(leagueId: number) {
    this.ratingService.reloadLeagueWithRatings(leagueId).subscribe( (leagueWithRatings) => {
      this.leagueWithRatingsById.set(leagueId, leagueWithRatings);
      this.leaguesWithRatings = this.leagues.map( (league) => {
        return this.leagueWithRatingsById.get(league.id);
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
        this.leagueById.set(league.id, league);
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
      return this.leagueById.get(id);
    } else {
      // TODO(alinden): handle uninitialized
    }
  }

  getWinLossRecords(league: WithId<League>): WinLossRecord[] {
    if (this.initialized) {
      return this.winLossRecordsByLeagueId.get(league.id);
    } else {
      // TODO(alinden): handle unitialized
    }
  }

  getMonthTotals(league: WithId<League>): MonthTotal[] {
    if (this.initialized) {
      return this.monthTotalsByLeagueId.get(league.id);
    } else {
      // TODO(alinden): handle unitialized
    }
  }

}
