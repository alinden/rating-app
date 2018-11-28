import { Injectable } from '@angular/core';
import { League } from './league';
import { WithId } from './with-id';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LeagueService {
  private leaguesUrl = 'api/leagues';
  private leagueUrlBase = 'api/league/';

  constructor(
    private http: HttpClient
  ) { }

  getLeagues(): Observable<WithId<League>[]> {
    return this.http.get<WithId<League>[]>(this.leaguesUrl)
      .pipe(
        catchError(this.handleError('getLeagues', [])),
      );
  }

  getLeague(id: number): Observable<WithId<League>> {
    const url = `${this.leaguesUrl}/${id}`;
    return this.http.get<WithId<League>>(url)
      .pipe(
        catchError(this.handleError<WithId<League>>(`getLeague(${id})`))
      );
  }

  updateLeague(league: WithId<League>): Observable<any> {
    return this.http.put(this.leaguesUrl, league, httpOptions).pipe(
      catchError(this.handleError<any>('updateLeague'))
    );
  }

  addLeague(league: League): Observable<WithId<League>> {
    return this.http.post<WithId<League>>(this.leaguesUrl, league, httpOptions).pipe(
      catchError(this.handleError<WithId<League>>('addLeague'))
    );
  }

  deleteLeague(league: WithId<League> | number): Observable<any> {
    const id = typeof league === 'number' ? league : league.id;
    const url = `${this.leaguesUrl}/${id}`;
    return this.http.delete<WithId<League>>(url, httpOptions).pipe(
      catchError(this.handleError<WithId<League>>('deleteLeague'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  private getLeagueUrl(id: number): string {
    return this.leagueUrlBase + id;
  }
}
