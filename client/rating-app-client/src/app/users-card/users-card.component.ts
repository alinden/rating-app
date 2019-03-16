import { Component, Input, OnInit } from '@angular/core';

import { User } from '../user';
import { WithId } from '../with-id';

import { UserService } from '../user.service';

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
    this.userService.addUser({
      name: this.userName,
      image: this.userImage,
    });
    this.enterListMode();
  }

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

}
