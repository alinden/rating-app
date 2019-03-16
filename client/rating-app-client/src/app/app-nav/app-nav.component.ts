import { Component } from '@angular/core';
import { DataRefreshRequiredService } from '../data-refresh-required.service';
import {MatDialog, MatDialogConfig} from "@angular/material";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeagueService } from '../league.service';
import { UserService } from '../user.service';
import { GameService } from '../game.service';
import { Game } from '../game';
import { WithId } from '../with-id';
import { League } from '../league';
import { User } from '../user';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { DetailsDialogComponent } from '../details-dialog/details-dialog.component';
import { AddGameDialogComponent } from '../add-game-dialog/add-game-dialog.component';

@Component({
  selector: 'app-app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.css'],
})
export class AppNavComponent {
  leagues: WithId<League>[] = [];
  usernames: string[] = [];
  users: WithId<User>[] = [];

  views: string[] = [
    'Standings',
    'Ratings',
    'Games',
    'Months',
  ];

  private sub: any;

  leagueName = '';
  league: WithId<League>;
  viewName = '';
  playerName = '';
  url = '';

  setLeague(leagueName: string) {
    this.league = this.leagues.find((league) => {
      return league.entity.name === leagueName;
    });
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private dataRefreshRequiredService: DataRefreshRequiredService,
    private breakpointObserver: BreakpointObserver,
    private leagueService: LeagueService,
    private userService: UserService,
    private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.sub = this.router.events.subscribe(routerEvent => {
      if (routerEvent instanceof NavigationEnd) {
        console.log('app-nav routerevent sub');
        console.log('routerEvent');
        console.log(routerEvent);
        this.leagueService.getLeagues().subscribe(leagues => {
          this.leagues = leagues;
          const x = routerEvent as NavigationEnd;
          this.userService.getUsers().subscribe(users => {
            this.users = users;
            this.usernames = [...[''], ...users.map(user => user.entity.name)];
            if (x.url && (x.url !== this.url)) {
              this.url = x.url;
              const urlSegments = x.url.split('/');
              if (urlSegments.length > 1) {
                this.viewName = urlSegments[1].replace(/%20/, ' ');
                if (urlSegments.length > 2) {
                  this.leagueName = urlSegments[2].replace(/%20/, ' ');
                  this.setLeague(this.leagueName);
                  if (urlSegments.length > 3) {
                    this.playerName = urlSegments[3].replace(/%20/, ' ');
                  }
                }
              }
            }
          });
        });
      }
    });
  }

  handleViewChange($event: MatSelectChange) {
    if ($event && $event.value) {
      const viewName = $event.value;
      if (this.leagueName && !this.playerName) {
        this.router.navigate([`/${viewName}/${this.leagueName}`]);
      } else if (this.leagueName && this.playerName) {
        this.router.navigate([`/${viewName}/${this.leagueName}/${this.playerName}`]);
      } else {
        this.router.navigate([`/${viewName}`]);
      }
    }
  }

  handleLeagueChange($event: MatSelectChange) {
    if ($event && $event.value) {
      const leagueName = $event.value;
      if (this.viewName) {
        this.router.navigate([`/${this.viewName}/${leagueName}`]);
      }
    }
  }

  handlePlayerChange($event: MatSelectChange) {
    if ($event) {
      const playerName = $event.value;
      if (this.viewName && this.leagueName) {
        this.router.navigate([`/${this.viewName}/${this.leagueName}/${playerName}`]);
      }
    }
  }

  handleAdd() {
    if (this.leagueName === 'Cricket') {
      this.router.navigate(['/keep-score/3']);
    } else {
      this.openAddGameDialog();
    }
  }

  openAppSettings() {
    this.router.navigate(['/Admin']);
  }

  closeAppSettings() {
    this.location.back();
  }

  openAddGameDialog() {
    if (this.leagueName) {
      const dialogConfig = new MatDialogConfig();

      dialogConfig.autoFocus = true;

      dialogConfig.data = {
        users: this.users,
        league: this.league,
      };

      const dialogRef = this.dialog.open(AddGameDialogComponent, dialogConfig);

      dialogRef.afterClosed().subscribe((data: { newGame: Game }) => {
        this.gameService.addGame(data.newGame).subscribe(() => {
          this.dataRefreshRequiredService.signalDataRefreshRequired();
        });
      });
    }
  }
}
