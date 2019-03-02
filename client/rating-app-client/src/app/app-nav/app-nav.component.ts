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
  users: WithId<User>[] = [];

  private sub: any;

  leagueName = '';
  playerName = '';

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
      this.users = users;
    });
    this.sub = this.router.events.subscribe(routerEvent => {
      const x = routerEvent as NavigationEnd;
      console.log('x subscribe');
      console.log('x');
      console.log(x);
      if (x.url) {
        console.log('x.url');
        console.log(x.url);
        const urlSegments = x.url.split('/');
        console.log('urlSegments');
        console.log(urlSegments);
      }
    });
  }

  handleLeagueChange($event: MatSelectChange) {
    if ($event && $event.value) {
      const leagueName = $event.value;
      const basePath = this.router.routerState.snapshot.url.split('/')[1];
      const urlSegments = this.router.routerState.snapshot.url.split('/');
      console.log('urlSegments');
      console.log(urlSegments);
      this.router.navigate([`/${basePath}/${leagueName}`]);
    }
  }

}
