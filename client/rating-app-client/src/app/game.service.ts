import { Injectable } from '@angular/core';
import { Game } from './game';
import { WithId } from './with-id';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { LeagueWithGames } from './league-with-games';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private leaguesWithGamesUrl = 'api/leagues-with-games';
  private leagueWithGamesUrl = 'api/league-with-games';
  private gamesUrl = 'api/games';
  private gameUrlBase = 'api/game/';
  private gameById = {};

  constructor(
    private http: HttpClient
  ) { }

  getLeagueWithGames(leagueId: number): Observable<LeagueWithGames> {
    return this.http.get<LeagueWithGames>(`${this.leagueWithGamesUrl}/${leagueId}`)
      .pipe(
        catchError(this.handleError('getLeaguesWithGames', null)),
      );
  }

  updateGame(game: WithId<Game>): Observable<any> {
    return this.http.put(this.gamesUrl, game, httpOptions).pipe(
      catchError(this.handleError<any>('updateGame'))
    );
  }

  addGame(game: Game): Observable<any> {
    return this.http.post<any>(this.gamesUrl, game, httpOptions).pipe(
      catchError(this.handleError<any>('addGame'))
    );
  }

  deleteGame(game: WithId<Game> | number): Observable<any> {
    const id = typeof game === 'number' ? game : game.id;
    const url = `${this.gamesUrl}/${id}`;
    return this.http.delete<WithId<Game>>(url, httpOptions).pipe(
      catchError(this.handleError<WithId<Game>>('deleteGame'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}
