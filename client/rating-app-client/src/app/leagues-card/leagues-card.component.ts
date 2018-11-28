import { Component, Input, OnInit } from '@angular/core';

import { ClientService } from '../client.service';

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
    this.client.addLeague(this.leagueName, this.leagueImage);
    this.enterListMode();
  }

  constructor(
    private client: ClientService,
  ) { }


  ngOnInit() {
    this.leagues = [
      { id: 1, entity: { name: '8 Ball', image: '#' }},
      { id: 2, entity: { name: '9 Ball', image: '#' }},
      { id: 3, entity: { name: 'Snooker', image: '#' }},
      { id: 4, entity: { name: 'Cricket', image: '#' }},
      { id: 5, entity: { name: 'English Cricket', image: '#' }},
      { id: 6, entity: { name: '301', image: '#' }},
    ];
  }

}
