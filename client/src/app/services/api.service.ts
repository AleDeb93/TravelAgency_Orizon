import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, catchError, throwError, tap, of, map, retry } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  arguments: string[] = ['destinations', 'users', 'orders'];
  private url = 'http://localhost:3000/api/v2/';
  token: string = localStorage.getItem('token') || '';

  constructor(private http: HttpClient, private router: Router) { }

  //-------------------------------------------------------------------------------------------------------------------------------------------------
  // API PARTE GENERICA
  //-------------------------------------------------------------------------------------------------------------------------------------------------

  // Headers e gestione degli errori per chiamate alle API
  getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
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
  // Inizialmente pensata per una chiamata generale, serarchRecord è usata ormai solo per le destinazioni
  // Questo mi permette di dividere le dipendenze e le chiamate in base al controller 
  // Possibilità futura, implementare un service per ogni controller del backend
  searchRecord(arg: number, id: string): Observable<any> {
    const url = `${this.url}${this.arguments[arg]}/${id}`;
    const headers = this.getHeaders();
    return this.http.get<any>(url, { headers }).pipe(
      catchError(this.errorHandling)
    );
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------
  // API VERIFICA TOKEN
  //-------------------------------------------------------------------------------------------------------------------------------------------------

  // Chiamata per verificare se il token è valido
  // Questa chiamata viene fatta quando l'utente accede ad alcune pagine protette
  // verifyToken(): Observable<any> {
  //   return this.http.get('localhost:3000/api/v2/users/verify-token', {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`
  //     }
  //   });
  // }
  verifyToken(): Observable<any> {
    const url = `${this.url}users/verify-token`;
    const headers = this.getHeaders();
    return this.http.get<any>(url, { headers }).pipe(
      catchError(this.errorHandling),
    );
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------
  // INIZIO API SPECIFICHE PER USERS
  //-------------------------------------------------------------------------------------------------------------------------------------------------

  // Chiamata per creare un utente
  createUser(user: any): Observable<any> {
    const url = `${this.url}users`;
    const headers = this.getHeaders();
    return this.http.post<any>(url, user, { headers }).pipe(
      catchError(this.errorHandling)
    );
  }
  // Chiamata per aggiornare un utente
  updateUser(user: any): Observable<any> {
    const url = `${this.url}users/${user.id}`;
    const headers = this.getHeaders();
    return this.http.put<any>(url, user, { headers }).pipe(
      catchError(this.errorHandling)
    );
  }
  // Chiamata per effettuare la login
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
          // Redirect alla pagina account
          this.router.navigate(['/account']);
        }
      }),
      catchError(this.errorHandling)
    );
  }
  // Chiamata per ottenere le informazioni di un utente
  getUser(id: number): Observable<any> {
    const url = `${this.url}users/${id}`;
    const headers = this.getHeaders();
    return this.http.get<any>(url, { headers }).pipe(
      catchError(this.errorHandling)
    );
  }
  // Logout dell'utente DA MODIFICARE
  logoutUser(): void {
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
  // Controllo del Token
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

  //-------------------------------------------------------------------------------------------------------------------------------------------------
  // INIZIO API SPECIFICHE PER ORDERS
  //-------------------------------------------------------------------------------------------------------------------------------------------------

  // Chiamata per creare un nuovo ordine
  createOrder(userID: number, items: any[]): Observable<any> {
    const url = `${this.url}orders/items`;
    const headers = this.getHeaders();
    return this.http.post<any>(url, { userId: userID, items }, { headers });
  }
  // Chiamata per verificare se l'utente ha un ordine in corso (carrello)
  getPendingOrderByUserId(userId: number): Observable<any> {
    const url = `${this.url}orders?userId=${userId}&status=pending`;
    const headers = this.getHeaders();
    return this.http.get<any[]>(url, { headers }).pipe(
      map(orders => orders.length > 0 ? orders[0] : null),
      catchError(error => {
        console.error('Errore nel recupero ordini:', error);
        return throwError(() => error);
      })
    );
  }
  // Chiamata per verificare se l'utente ha un ordine in corso (carrello)
  getOrderByUserId(userId: number): Observable<any[]> {
    const url = `${this.url}orders?userId=${userId}`;
    const headers = this.getHeaders();
    return this.http.get<any[]>(url, { headers }).pipe(
      catchError(error => {
        console.error('Errore nel recupero ordini:', error);
        return throwError(() => error);
      })
    );
  }

  // Chiamata per aggiornare l'ordine pending
  updateOrder(orderId: number, item: { destinationId: number, buyedTickets: number }): Observable<any> {
    const url = `${this.url}orders/${orderId}`;
    const headers = this.getHeaders();
    return this.http.put<any>(url, item, { headers });
  }

  // Chiamata per ottenre un ordine tramite id
  getOrderById(orderId: number): Observable<any> {
    const url = `${this.url}orders/${orderId}`;
    const headers = this.getHeaders();
    return this.http.get<any>(url, { headers });
  }

  // Chiamata per completare un ordine
  // Questa chiamata cambia lo stato dell'ordine da "pending" a "completed"
  completeOrder(orderId: number): Observable<any> {
    const url = `${this.url}orders/${orderId}`;
    const headers = this.getHeaders();
    return this.http.patch<any>(url, {}, { headers });
  }

  // Chiamata per eliminare un ordine
  // NOTA: Il backend non permette di eliminare un ordine se è in stato "completed"
  deleteOrder(orderId: number): Observable<any> {
    const url = `${this.url}orders/${orderId}`;
    const headers = this.getHeaders();
    return this.http.delete<any>(url, { headers });
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------
  // INIZIO API USER PREFERENCES
  //-------------------------------------------------------------------------------------------------------------------------------------------------

  // Chiamata per ottenere una lista di destinazioni in base ai filtri dell'utente
  getDestinationsByPreferences(preferences: {
    activity?: string;
    theme?: string;
    location?: string;
    discounted?: boolean;
  }): Observable<any> {
    const url = `${this.url}destinations/filter`;
    const headers = this.getHeaders();
    let params = new HttpParams();

    if (preferences.activity) params = params.set('activity', preferences.activity);
    if (preferences.theme) params = params.set('theme', preferences.theme);
    if (preferences.location) params = params.set('location', preferences.location);
    if (preferences.discounted) params = params.set('discounted', 'true');

    return this.http.get<any[]>(url, { headers, params }).pipe(
      catchError(this.errorHandling)
    );
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------
  // GESTIONI ESTERNE RIMOSSE
  //-------------------------------------------------------------------------------------------------------------------------------------------------

  // Implementazione di una funzione per ottenere suggerimenti di indirizzo tramite OpenStreetMap
  // Questa funzione non è utilizzata nel progetto causa performance non soddisfacenti che inficiavano l'esperienza utente 
  // Avevo trovato altri metodi per ottenere gli indirizzi tramite API su servizi esterni ma i piani free erano limitati / poco effcienti
  // I metodi a pagamento sono stati ovviamente scartati

  // getAddressSuggestions(query: string): Observable<any> {
  //   const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`;
  //   return this.http.get(url);
  // }
}
