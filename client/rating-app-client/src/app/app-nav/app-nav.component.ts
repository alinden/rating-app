import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeagueService } from '../league.service';
import { WithId } from '../with-id';
import { League } from '../league';

@Component({
  selector: 'app-app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.css'],
})
export class AppNavComponent {
  leagues: WithId<League>[] = [];
  views: string[] = [
    'Standings',
    'Months',
    'Ratings',
    'Recent Games',
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private leagueService: LeagueService,
  ) {}

  ngOnInit() {
    this.leagueService.getLeagues().subscribe(leagues => {
      console.log('app-nav ngOnInit');
      console.log('leagues');
      console.log(leagues);
      this.leagues = leagues;
    });
  }

}
