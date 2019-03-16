import { Component, Input, OnInit } from '@angular/core';

import { LeagueService } from '../league.service';

import { League } from '../league';
import { WithId } from '../with-id';

@Component({
  selector: 'app-leagues-card',
  templateUrl: './leagues-card.component.html',
  styleUrls: ['./leagues-card.component.css']
})
export class LeaguesCardComponent implements OnInit {
  @Input() leagueName: string;
  @Input() leagueImage: string;

  leagues: WithId<League>[];

  mode: String = 'list';

  enterAddMode(): void {
    this.mode = 'add';
  }

  enterListMode(): void {
    this.mode = 'list';
  }

  enterEditMode(): void {
    this.mode = 'edit';
  }

  saveLeague(name: string): void {
    this.leagueService.addLeague({
      name: this.leagueName,
      image: this.leagueImage,
    });
    this.enterListMode();
  }

  constructor(
    private leagueService: LeagueService,
  ) { }

  ngOnInit() {
    this.leagueService.getLeagues().subscribe((leagues) => {
      this.leagues = leagues;
    });
  }

}
