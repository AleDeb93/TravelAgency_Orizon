import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  arguments: string[] = ['destinations', 'users', 'orders'];
  private url = 'http://localhost:3000/api/v2/';
  token: string = localStorage.getItem('token') || '';

  constructor(private http: HttpClient, private router: Router) { }

  // Headers e gestione degli errori per chiamate alle API
  getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('Token:', this.token);
    if (this.token && this.token.trim() !== '') { headers = headers.set('Authorization', `${this.token}`) }
    return headers;
  }

  // Gestione degli errori
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

  updateUser(user: any): Observable<any> {
    const url = `${this.url}users/${user.id}`;
    const headers = this.getHeaders();
    return this.http.put<any>(url, user, { headers }).pipe(
        catchError(this.errorHandling)
    );
}

  loginUser(user: any): Observable<any> {
    const url = `${this.url}users/login`;
    const headers = this.getHeaders();

    return this.http.post<any>(url, user, { headers }).pipe(
      tap(response => {
        if (response && response.token) {
          this.token = `Bearer ${response.token}`;
          // Salvo il token e la data del token in localStorage
          localStorage.setItem('token', this.token);
          let tokenDate = new Date().getTime();
          localStorage.setItem('tokenDate', tokenDate.toString());
          // Salvo i dati dell'utente in localStorage
          localStorage.setItem('user', JSON.stringify(response.user));

          // // Salvo la data di scadenza del token
          // const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 ore
          // localStorage.setItem('token_expiry', expiresAt.toString());

          // Redirect alla pagina account
          this.router.navigate(['/account']);
        }
      }),
      catchError(this.errorHandling)
    );
  }

  getUser(id: number): Observable<any> {
    const url = `${this.url}users/${id}`;
    const headers = this.getHeaders();
    return this.http.get<any>(url, { headers }).pipe(
      catchError(this.errorHandling)
    );
  }

  createOrder(order: any): Observable<any> {
    const url = `${this.url}orders`;
    const headers = this.getHeaders();
    return this.http.post<any>(url, order, { headers }).pipe(
      catchError(this.errorHandling)
    );
  }

  logoutUser(): void {
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']); 
  }

  checkTokenExpiration(): void {
    // Controllo se il token è scaduto se scaduto faccio logout dello user
    const expiry = localStorage.getItem('token_expiry');
    if (expiry) {
      const now = new Date().getTime();
      if (now > parseInt(expiry, 10)) {
        this.logoutUser();
      }
    }
  }


  /*
   * Implementazione di una funzione per ottenere suggerimenti di indirizzo tramite OpenStreetMap
   * Questa funzione non è utilizzata nel progetto causa performance non soddisfacenti che inficiavano l'esperienza utente 
   */
  // getAddressSuggestions(query: string): Observable<any> {
  //   const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`;
  //   return this.http.get(url);
  // }
}
