import { Injectable } from '@angular/core';
import { Game } from './game';
import { WithId } from './with-id';
import { GameWithRatings } from './game-with-ratings';
import { Observable, of } from 'rxjs';
import { RatingService } from './rating.service';
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
  private gamesUrl = 'api/games';
  private gameUrlBase = 'api/game/';
  private gameById = {};

  constructor(
    private ratingService: RatingService,
    private http: HttpClient
  ) { }

  getLeaguesWithGames(): Observable<LeagueWithGames[]> {
    return this.http.get<LeagueWithGames[]>(this.leaguesWithGamesUrl)
      .pipe(
        catchError(this.handleError('getLeaguesWithGames', [])),
      );
  }

  getGames(): Observable<WithId<Game>[]> {
    return this.http.get<WithId<Game>[]>(this.gamesUrl)
      .pipe(
        catchError(this.handleError('getGames', [])),
        tap(games => this.setGameById(games))
      );
  }

  getGame(id: number): Observable<WithId<Game>> {
    const url = `${this.gamesUrl}/${id}`;
    return this.http.get<WithId<Game>>(url)
      .pipe(
        catchError(this.handleError<WithId<Game>>(`getGame(${id})`))
      );
  }

  updateGame(game: WithId<Game>): Observable<any> {
    return this.http.put(this.gamesUrl, game, httpOptions).pipe(
      catchError(this.handleError<any>('updateGame'))
    );
  }

  addGame(game: Game): Observable<GameWithRatings> {
    return this.http.post<GameWithRatings>(this.gamesUrl, game, httpOptions).pipe(
      catchError(this.handleError<GameWithRatings>('addGame'))
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

  private getGameUrl(id: number): string {
    return this.gameUrlBase + id;
  }

  private setGameById(games: WithId<Game>[]): void {
    games.forEach( game => this.gameById[game.id] = game);
  }
}
