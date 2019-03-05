import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataRefreshRequiredService {
  public dataChangeCounter: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  signalDataRefreshRequired() {
    console.log('signalDataRefreshRequired')
    this.dataChangeCounter.next(this.dataChangeCounter.value + 1);
  }

  constructor() { }
}
