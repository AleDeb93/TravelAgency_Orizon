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
  items: any[] = [];
  user = JSON.parse(localStorage.getItem('user') || '{}');

  // type: DataTypes.ENUM('credit_card', 'paypal', 'bank_transfer'),
  paymentMethod: string = this.user.paymentMethod || '';
  savePaymentData: boolean = false;

  constructor(private apiService: ApiService, private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.getPendingOrder().subscribe(order => {
      if (order && order.items) {
        this.items = order.items;
        this.items.forEach(item => {
          if (item.buyedTickets <= 0 || item.buyedTickets == null) {
            item.buyedTickets = 1;
          }
        });
        this.getTotalPrice();
      } else {
        this.items = [];
      }
  
      this.loading = false;
    });
  }
  

  ngDoCheck() {
    this.getTotalPrice();
    console.log('ngDoCheck cart', this.items);
  }

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

  updateItemQuantity(id: number, quantity: number) {
    if (quantity <= 0) {
      this.cartService.removeItem(id);
    }
    else {
      this.cartService.updateItemQuantity(id, quantity);
      this.items = this.cartService.getItems();
      this.getTotalPrice();
    }
  }

  onPaymentMethodChange(): void {
    if (this.savePaymentData) {
      this.user.paymentMethod = this.paymentMethod;
      this.apiService.updateUser(this.user).subscribe(
        (response) => { });
      console.log('Dati di pagamento salvati');
    }
  }

  removeItem(id: number) {
    this.cartService.removeItem(id);
    this.items = this.cartService.getItems();
    window['Swal'].fire({
      text: 'Il viaggio è stato rimosso dal carrello',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  clearCart() {
    this.cartService.clearCart();
  }
}
