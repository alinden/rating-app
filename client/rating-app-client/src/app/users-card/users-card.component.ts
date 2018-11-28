import { Component, Input, OnInit } from '@angular/core';

import { User } from '../user';
import { WithId } from '../with-id';

import { ClientService } from '../client.service';

@Component({
  selector: 'app-users-card',
  templateUrl: './users-card.component.html',
  styleUrls: ['./users-card.component.css']
})
export class UsersCardComponent implements OnInit {
  @Input() userName: string;
  @Input() userImage: string;

  users: WithId<User>[];

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

  saveUser(name: string): void {
    this.client.addUser(this.userName, this.userImage);
    this.enterListMode();
  }

  constructor(
    private client: ClientService,
  ) { }

  ngOnInit() {
    this.users = [
      { id: 1, entity: { name: 'alex', image: '#'  }},
      { id: 2, entity: { name: 'robert', image: '#'  }},
      { id: 3, entity: { name: 'jason', image: '#'  }},
      { id: 4, entity: { name: 'dong soo', image: '#'  }},
      { id: 5, entity: { name: 'kade', image: '#'  }},
      { id: 6, entity: { name: 'colby', image: '#'  }},
    ];
  }

}
