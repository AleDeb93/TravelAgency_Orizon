import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  arguments: string[] = ['destinations', 'users', 'orders'];
  private url = 'http://localhost:3000/api/v2/';
  token: string = '';

  constructor(private http: HttpClient) { }

  // Headers e gestione degli errori per chiamate alle API
  getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (this.token && this.token.trim() !== '') { headers = headers.set('Authorization', `Bearer ${this.token}`) }
    return headers;
  }
  errorHandling(error: any): Observable<any> {
    console.error(error);
    return throwError(error);
  }

  // Gestione della chiamata GetAll dei vari controllers
  getList(arg: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.url}${this.arguments[arg]}/`;
    const params = new HttpParams()
    return this.http.get<any>(url, { headers, params }).pipe(
      catchError(this.errorHandling)
    );
  }

  // Chiamata per recuperare un record usando un id
  searchRecord(arg: number, id: string): Observable<any> {
    const url = `${this.url}${this.arguments[arg]}/${id}`;
    const headers = this.getHeaders();
    return this.http.get<any>(url, { headers }).pipe(
      catchError(this.errorHandling)
    );
  }

  // Chiamata per creare un nuovo utente
  createUser(user: any): Observable<any> {
    const url = `${this.url}users`;
    const headers = this.getHeaders();
    return this.http.post<any>(url, user, { headers }).pipe(
      catchError(this.errorHandling)
    );
  }

  loginUser(user: any): Observable<any> {
    // URL per la login
    const url = `${this.url}users/login`;
    const headers = this.getHeaders();
    return this.http.post<any>(url, user, { headers }).pipe(
      catchError(this.errorHandling),
      // Se 200 aggiorno il flag loggedIn
      tap(response => {
        if (response && response.status === 200) {
          this.token = 'Bearer ' + response.token;
        }
      })
    );
  }
}
