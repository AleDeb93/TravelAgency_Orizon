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
    this.loading = false;
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
  
  onPaymentMethodChange(): void {
    if(this.savePaymentData) {
      this.user.paymentMethod = this.paymentMethod;
      this.apiService.updateUser(this.user).subscribe(
        (response) => {});
      console.log('Dati di pagamento salvati');
    }
  }

  createNewOrder() {
    const order = {
      userId: this.user.id,  
      destinationId: this.items.forEach((item) => item.id),  
      buyedTickets: 0,  
    };
    // Chiamo ApiService per creare l'ordine
    this.apiService.createOrder(order).subscribe(
      (response) => {
        console.log('Ordine creato con successo:', response);
      },
      (error) => {
        console.error(`Errore durante la creazione dell'ordine:`, error);
      }
    );
  }

}
