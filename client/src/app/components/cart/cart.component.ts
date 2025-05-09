import { Component, OnInit } from '@angular/core';
//import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  loading: boolean = true;
  pendingOrder: any = null; // Ordine pending dell'utente loggato
  items: any[] = [];
  user = JSON.parse(localStorage.getItem('user') || '{}');

  // type: DataTypes.ENUM('credit_card', 'paypal', 'bank_transfer'),
  paymentMethod: string = this.user.paymentMethod || '';
  savePaymentData: boolean = false;

  constructor(private apiService: ApiService, private cartService: CartService) { }

  ngOnInit(): void {
    this.reloadPage();
    this.loading = false;
  }

  ngDoCheck() {
  }

  reloadPage() {
    this.cartService.getPendingOrder().subscribe(order => {
      if (order && order.destinations) {
        this.items = order.destinations;
        this.pendingOrder = order;
        this.getTotalPrice();
      }
    });
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------
  // FUNZIONI PER LA GESTIONE DEGLI ITEMS 
  //-------------------------------------------------------------------------------------------------------------------------------------------------

  createNewOrder() {
    // Se non ci sono elementi nel carrello non posso procedere
    if (!this.items || this.items.length === 0)
      return;
    // Recupero i dati dell'utente loggato
    const userID = this.user.id;
    // Mappo gli oggetti per creare il payload da inviare al server
    const itemsPayload = this.items.map(item => ({
      destinationID: item.id,
      buyedTickets: item.buyedTickets
    }));

    this.apiService.createOrder(userID, itemsPayload).subscribe({
      next: (response) => {
        console.log('Nuovo ordine inserito:', response);
      },
      error: (error) => {
        console.error(`Errore nella creazione dell'ordine: `, error);
      },
    });
  }

  removeItem(destinationId: number) {
    if (!this.pendingOrder) return;
    // Avvio la chiamata per rimuovere l'item dall'ordine pending
    this.apiService.updateOrder(this.pendingOrder.id, { destinationId, buyedTickets: 0 }).subscribe(response => {
      // Modifico l'ordine pending con la risposta del server
      this.pendingOrder = response.order;
      // Aggiorno gli items nel carrello
      this.reloadPage();

      // Informo l'utente che l'item è stato rimosso
      window['Swal'].fire({
        text: 'Il viaggio è stato rimosso dal carrello',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
    }, error => {
      // In caso di errore
      console.error(`Errore nella rimozione dell'item:`, error);
    });
  }

  updateItemQuantity(id: number, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(id);
    }
    else {
      this.cartService.updateItemQuantity(id, quantity);
    }
  }

  clearCart() {
    this.cartService.clearCart();
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------
  // FUNZIONI PER LA GESTIONE DEL PAGAMENTO
  //-------------------------------------------------------------------------------------------------------------------------------------------------

  getTotalPrice(): number {
    let total: number = 0;
    this.items.forEach(item => {
      // Ho dovuto forzare il valore numerico altrimenti concatenava due string 
      // Ad esempio 1080 + 2000 risultava 10802000 e non 3080
      const itemPrice = Number(item.discount !== null
        ? item.price - (item.price * (item.discount / 100))
        : item.price)
        * Number(item.buyedTickets);
      total = total + itemPrice;
    });
    return total;
  }

  onPaymentMethodChange(): void {
    if (this.savePaymentData) {
      this.user.paymentMethod = this.paymentMethod;
      this.apiService.updateUser(this.user).subscribe(
        (response) => { });
      console.log('Dati di pagamento salvati');
    }
  }
}
