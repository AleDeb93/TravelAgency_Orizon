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

  addToCart(item: any) {
    // Otteniamo l'ordine pending dell'utente loggato
    // Se non c'è un ordine pending, lo creiamo
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return; // Se non c'è un utente loggato, non possiamo procedere
    const userID = JSON.parse(storedUser).id;
    this.apiService.getPendingOrderByUserId(userID).subscribe(order => {
      if (order) {
        // Ordine pending esiste già → aggiungiamo l'item
        this.apiService.updateOrder(order.id, item).subscribe(() => {
          this.pendingOrder = order; // aggiorno ordine locale
        });
      } else {
        // Non esiste nessun ordine > Creo l'ordine e aggiungo un item
        const itemWrapped = {
          destinationId: item.id,
          buyedTickets: 1
        };
        this.apiService.createOrder(userID, [itemWrapped]).subscribe(response => {
          this.pendingOrder = response.order; // salvo ordine per uso futuro
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
  //   if (!this.pendingOrder) return;
  //   this.apiService.clearOrderItems(this.pendingOrder.id).subscribe(updated => {
  //     this.pendingOrder = updated.order;
  //   });
  }
}
