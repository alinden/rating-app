import { Component, Input } from '@angular/core';

import { User } from '../user';
import { WithId } from '../with-id';

@Component({
  selector: 'app-users-card-item',
  templateUrl: './users-card-item.component.html',
  styleUrls: ['./users-card-item.component.css']
})
export class UsersCardItemComponent {
  @Input() user: WithId<User>;
}
