import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LeagueWithRatings } from './league-with-ratings';
import { RatingHistory, RatingHistoryRecord } from './rating-history';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private leagueWithRatingsUrl = 'api/league-with-ratings';
  private ratingHistoryUrl = 'api/rating-history';

  constructor(
    private http: HttpClient
  ) { }

  getLeagueWithRatings(leagueId: number): Observable<LeagueWithRatings> {
    return this.http.get<LeagueWithRatings>(`${this.leagueWithRatingsUrl}/${leagueId}`)
      .pipe(
        catchError(this.handleError('getLeagueWithRatings', null)),
      );
  }

  getRatingHistory(userId: number, leagueId: number): Observable<RatingHistory> {
    return this.http.get<RatingHistory>(`${this.ratingHistoryUrl}/${userId}/${leagueId}`)
      .pipe(
        catchError(this.handleError('getRatingHistory', null)),
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}
