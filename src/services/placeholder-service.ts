import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaceholderService {
  constructor(private readonly http: HttpClient) {}

  getDataV1(): Observable<any> {
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    return this.http.get(url);
  }

  getDataV2(): Observable<any> {
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    return this.http.get(url).pipe(
      tap((data: any) => console.log('Data Fetched', data)),
      catchError(this.handleError('Failed to fetch data'))
    );
  }

  postDataV1(data: any): Observable<any> {
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post(data, url, httpOptions);
  }

  private handleError<T>(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(error);

      const message = `server returned code ${error.status} with body "${error.error}"`;

      throw new Error(`${operation} failed: ${message}`);
    };
  }
}
