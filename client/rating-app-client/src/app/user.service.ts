import { Injectable } from '@angular/core';
import { User } from './user';
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
export class UserService {
  private usersUrl = 'api/users';
  private userUrlBase = 'api/user/';

  constructor(
    private http: HttpClient
  ) { }

  getUsers(): Observable<WithId<User>[]> {
    return this.http.get<WithId<User>[]>(this.usersUrl)
      .pipe(
        catchError(this.handleError('getUsers', [])),
      );
  }

  getUser(id: number): Observable<WithId<User>> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<WithId<User>>(url)
      .pipe(
        catchError(this.handleError<WithId<User>>(`getUser(${id})`))
      );
  }

  updateUser(user: WithId<User>): Observable<any> {
    return this.http.put(this.usersUrl, user, httpOptions).pipe(
      catchError(this.handleError<any>('updateUser'))
    );
  }

  addUser(user: User): Observable<WithId<User>> {
    return this.http.post<WithId<User>>(this.usersUrl, user, httpOptions).pipe(
      catchError(this.handleError<WithId<User>>('addUser'))
    );
  }

  deleteUser(user: WithId<User> | number): Observable<any> {
    const id = typeof user === 'number' ? user : user.id;
    const url = `${this.usersUrl}/${id}`;
    return this.http.delete<WithId<User>>(url, httpOptions).pipe(
      catchError(this.handleError<WithId<User>>('deleteUser'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  private getUserUrl(id: number): string {
    return this.userUrlBase + id;
  }
}
