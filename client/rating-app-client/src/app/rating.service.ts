import { Injectable } from '@angular/core';
import { Rating } from './rating';
import { WithId } from './with-id';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { LeagueWithRatings } from './league-with-ratings';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private leaguesWithRatingsUrl = 'api/leagues-with-ratings';
  private ratingsUrl = 'api/ratings';
  private ratingUrlBase = 'api/rating/';

  constructor(
    private http: HttpClient
  ) { }

  getLeaguesWithRatings(): Observable<LeagueWithRatings[]> {
    return this.http.get<LeagueWithRatings[]>(this.leaguesWithRatingsUrl)
      .pipe(
        catchError(this.handleError('getLeaguesWithRatings', [])),
      );
  }

  getRatings(): Observable<WithId<Rating>[]> {
    return this.http.get<WithId<Rating>[]>(this.ratingsUrl)
      .pipe(
        catchError(this.handleError('getRatings', []))
      );
  }

  getRating(id: number): Observable<WithId<Rating>> {
    const url = `${this.ratingsUrl}/${id}`;
    return this.http.get<WithId<Rating>>(url)
      .pipe(
        catchError(this.handleError<WithId<Rating>>(`getRating(${id})`))
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  private getRatingUrl(id: number): string {
    return this.ratingUrlBase + id;
  }
}
