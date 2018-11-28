import { Component, OnInit } from '@angular/core';

import { ClientService } from '../client.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(
    private client: ClientService,
  ) { }

  ngOnInit() {
    if (!this.client.initialized) {
      this.client.loadAllData();
    }
  }

}
