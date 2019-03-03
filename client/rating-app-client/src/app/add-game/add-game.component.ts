import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Game } from '../game';
import { GameService } from '../game.service';
import { StatsService } from '../stats.service';
import { WithId } from '../with-id';
import { User } from '../user';
import { UserService } from '../user.service';
import { LeagueWithGames } from '../league-with-games';
import { Router } from '@angular/router';

import { WinLossRecord } from '../win-loss-record';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.css']
})
export class AddGameComponent implements OnInit {
  users: WithId<User>[] = [];
  winner: WithId<User>;
  loser: WithId<User>;

  leagueWithGames: LeagueWithGames;
  leagueName: string = '';

  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private statsService: StatsService,
    private gameService: GameService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
    this.sub = this.route.params.subscribe(params => {
      if (params['leagueName']) {
        this.leagueName = params['leagueName'];
      }
      this.gameService.getLeaguesWithGames().subscribe((leaguesWithGames) => {
        if (this.leagueName) {
          this.leagueWithGames = leaguesWithGames.find((x) => {
            return x.league.entity.name === this.leagueName;
          });
        }
        if (!this.leagueWithGames) {
          this.leagueWithGames = leaguesWithGames[0];
        }
      });
    });
  }

  saveGame() {
    const newGame = {
        'league_id': this.leagueWithGames.league.id,
        'winner_id': this.winner.id,
        'loser_id': this.loser.id,
      } as Game;
    this.gameService.addGame(newGame).subscribe(() => {
      this.router.navigate([`/Games/${this.leagueWithGames.league.entity.name}`]);
    });
  }
}
