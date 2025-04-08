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
    this.items = this.cartService.getItems();
    console.log(this.items);
    if(this.items.length > 0)
      this.getTotalPrice(); 
    this.loading = false;
  }

  ngDoCheck(){
    this.getTotalPrice();
  }

  clearCart(){
    this.cartService.clearCart();
    this.items = [];
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

  getTotalPrice(): number {
    let total: number = 0;  
    this.items.forEach(item => {
       // Ho dovuto forzare il valore numerico altrimenti concatenava due string 
       // Ad esempio 1080 + 2000 risultava 10802000 e non 3080
      const itemPrice = Number(item.discount !== null
        ? item.price - (item.price * (item.discount / 100))  
        : item.price) 
  
      total = total + itemPrice; 
    });
    return total;
  }
  
  onPaymentMethodChange(): void {
    if(this.savePaymentData) {
      this.user.paymentMethod = this.paymentMethod;
      this.apiService.updateUser(this.user).subscribe(
        (response) => {});
      console.log('Dati di pagamento salvati');
    }
  }

  createNewOrder() {
    this.items.forEach(item => {
      const order = {
        userId: this.user.id,
        destinationId: item.id,
        buyedTickets: 0, //TODO: implementare il numero di biglietti acquistati
      };
  
      this.apiService.createOrder(order).subscribe(
        (response) => {
          console.log('Ordine creato con successo:', response);
          window['Swal'].fire({
            text: 'Ordine creato con successo',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
        },
        (error) => {
          console.error('Errore durante la creazione dell\'ordine:', error);
          window['Swal'].fire({
            text: 'Errore durante la creazione dell\'ordine',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      );
    });
  }
}
