import { Component, Input, OnInit } from '@angular/core';

import { User } from '../user';
import { WithId } from '../with-id';

import { ClientService } from '../client.service';

@Component({
  selector: 'app-users-card-item',
  templateUrl: './users-card-item.component.html',
  styleUrls: ['./users-card-item.component.css']
})
export class UsersCardItemComponent implements OnInit {
  @Input() user: WithId<User>;

  constructor(
    private client: ClientService,
  ) { }

  ngOnInit() {
  }

}
