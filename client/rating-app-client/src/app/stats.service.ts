import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { WithId } from './with-id';
import { WinLossRecord } from './win-loss-record';
import { Stats } from './stats';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private statsUrl = 'api/stats';

  constructor(
    private http: HttpClient
  ) { }

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(this.statsUrl)
      .pipe(
        catchError(this.handleError('getStats',
          { leagueIdAndWinLossRecords: [] }
        )),
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}
