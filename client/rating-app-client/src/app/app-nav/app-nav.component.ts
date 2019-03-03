import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeagueService } from '../league.service';
import { UserService } from '../user.service';
import { WithId } from '../with-id';
import { League } from '../league';
import { User } from '../user';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.css'],
})
export class AppNavComponent {
  leagues: WithId<League>[] = [];
  usernames: string[] = [];

  views: string[] = [
    'Admin',
    'Standings',
    'Ratings',
    'Games',
    'Months',
  ];

  private sub: any;

  leagueName = '';
  viewName = '';
  playerName = '';
  url = '';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private leagueService: LeagueService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.leagueService.getLeagues().subscribe(leagues => {
      this.leagues = leagues;
    });
    this.userService.getUsers().subscribe(users => {
      this.usernames = [...[''], ...users.map(user => user.entity.name)];
    });
    this.sub = this.router.events.subscribe(routerEvent => {
      const x = routerEvent as NavigationEnd;
      if (x.url && (x.url !== this.url)) {
        this.url = x.url;
        const urlSegments = x.url.split('/');
        if (urlSegments.length > 1) {
          this.viewName = urlSegments[1].replace(/%20/, ' ');
          if (urlSegments.length > 2) {
            this.leagueName = urlSegments[2].replace(/%20/, ' ');
            if (urlSegments.length > 3) {
              this.playerName = urlSegments[3].replace(/%20/, ' ');
            }
          }
        }
      }
    });
  }

  handleViewChange($event: MatSelectChange) {
    if ($event && $event.value) {
      const viewName = $event.value;
      const url = this.router.routerState.snapshot.url;
      if ((viewName === 'admin') || (!url.split('/').length)) {
        this.router.navigate([`/${viewName}`]);
      } else {
        const basePath = url.split('/')[1];
        const pathSuffix = url.slice(basePath.length + 2);
        this.router.navigate([`/${viewName}/${pathSuffix}`]);
      }
    }
  }

  handleLeagueChange($event: MatSelectChange) {
    if ($event && $event.value) {
      const leagueName = $event.value;
      const basePath = this.router.routerState.snapshot.url.split('/')[1];
      this.router.navigate([`/${basePath}/${leagueName}`]);
    }
  }

  handlePlayerChange($event: MatSelectChange) {
    if ($event) {
      const playerName = $event.value;
      const basePath = this.router.routerState.snapshot.url.split('/')[1];
      const leagueName = this.router.routerState.snapshot.url.split('/')[2];
      this.router.navigate([`/${basePath}/${leagueName}/${playerName}`]);
    }
  }

  handleAdd() {
    this.router.navigate([`/add-game/${this.leagueName}`]);
  }
}
