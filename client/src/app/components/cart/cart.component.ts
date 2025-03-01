import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  loading: boolean = true;
  items: any[] = [];
  
  // type: DataTypes.ENUM('credit_card', 'paypal', 'bank_transfer'),
  paymentMethod: string = ''; // Metodo di pagamento selezionato
  
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loading = false;
  }

  onPaymentMethodChange(): void {
    console.log('Metodo di pagamento selezionato:', this.paymentMethod);
    // Puoi fare altre azioni qui, come inviare il dato al server tramite il tuo ApiService
  }


}
