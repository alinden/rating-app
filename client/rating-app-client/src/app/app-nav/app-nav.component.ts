import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeagueService } from '../league.service';
import { UserService } from '../user.service';
import { WithId } from '../with-id';
import { League } from '../league';
import { User } from '../user';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.css'],
})
export class AppNavComponent {
  leagues: WithId<League>[] = [];
  users: WithId<User>[] = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private leagueService: LeagueService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.leagueService.getLeagues().subscribe(leagues => {
      this.leagues = leagues;
    });
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  handleLeagueChange($event: MatSelectChange) {
    if ($event && $event.value) {
      const leagueName = $event.value;
      this.router.navigate([`/standings/${leagueName}`]);
    }
  }

}
