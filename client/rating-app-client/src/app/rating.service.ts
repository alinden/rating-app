import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LeagueWithRatings } from './league-with-ratings';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private leagueWithRatingsUrl = 'api/league-with-ratings';

  constructor(
    private http: HttpClient
  ) { }

  getLeagueWithRatings(leagueId: number): Observable<LeagueWithRatings> {
    return this.http.get<LeagueWithRatings>(`${this.leagueWithRatingsUrl}/${leagueId}`)
      .pipe(
        catchError(this.handleError('getLeagueWithRatings', null)),
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}
