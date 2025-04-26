import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: any[] = [];
  private pendingOrder: any = null; // Ordine pending dell'utente loggato

  constructor(private apiService: ApiService) { }

  //-------------------------------------------------------------------------------------------------------------------------------------------------
  // CREAZIONE E GESTIONE ORDINE PENDING
  //-------------------------------------------------------------------------------------------------------------------------------------------------

  addToCart(item: any) {
    // Ottengo i dati dell'utente loggato
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    // Se non c'è un utente loggato, non posso procedere
    const userID = JSON.parse(storedUser).id;
    // Verifico se l'utente ha già un ordine pending
    this.apiService.getPendingOrderByUserId(userID).subscribe(order => {
      const itemWrapped = {
        destinationId: item.id,
        buyedTickets: 1
      };
      // Inizio la lavoarazione dell'ordine
      if (order) {
        // Se esiste un ordine pending, lo aggiorno con il nuovo item
        this.apiService.updateOrder(order.id, itemWrapped).subscribe(() => {
          this.pendingOrder = order;
        });
      } else {
        // Se non esiste un ordine pending, lo creo
        this.apiService.createOrder(userID, [itemWrapped]).subscribe(response => {
          this.pendingOrder = response.order;
          console.log('Nuovo ordine creato:', this.pendingOrder);
        });
      }
    });
  }
  
  hasPendingOrder(): Observable<boolean> {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return of(false); // Se non c'è un utente loggato, non può avere un ordine in sospeso
    const userID = JSON.parse(storedUser).id;
    return this.apiService.getPendingOrderByUserId(userID).pipe(
      map(order => order && order.status === 'pending'),
      catchError(() => of(false))  // Gestione dell'errore nel caso di fallimento della chiamata
    );
  }

  getPendingOrder(): Observable<any> {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return of(null);
    const userID = JSON.parse(storedUser).id;
    return this.apiService.getPendingOrderByUserId(userID);
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------
  // GESTIONE DEGLI ITEMS NEL CARRELLO
  //-------------------------------------------------------------------------------------------------------------------------------------------------

  // TODO ELIMINA
  getItems() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.items = JSON.parse(storedCart);
    }
    return this.items;
  }

  removeItem(destinationId: number) {
    if (!this.pendingOrder) return;
    this.apiService
      .updateOrder(this.pendingOrder.id, { destinationId, buyedTickets: 0 })
      .subscribe(response => {
        // response.order è l'ordine aggiornato dopo la rimozione
        this.pendingOrder = response.order;
      });
  }

  updateItemQuantity(destinationId: number, quantity: number) {
    if (!this.pendingOrder) return;

    if (quantity <= 0) {
      this.removeItem(destinationId);
    } else {
      this.apiService.updateOrder(this.pendingOrder.id, {
        destinationId,
        buyedTickets: quantity
      }).subscribe(updated => {
        this.pendingOrder = updated.order;
      });
    }
  }

  clearCart() {
  }
}
