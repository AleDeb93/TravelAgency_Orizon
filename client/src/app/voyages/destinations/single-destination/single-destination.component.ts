import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-single-destination',
  templateUrl: './single-destination.component.html',
  styleUrls: ['./single-destination.component.css']
})
export class SingleDestinationComponent implements OnInit {
  destinationId: string = '';  // Inizializzazione con una stringa vuota
  destination: any;
  loading: boolean = true;
  formattedDate: string = '';

  constructor(private route: ActivatedRoute, private apiService: ApiService, private cartService: CartService) { }

  ngOnInit(): void {
    // Ottieni l'ID dalla rotta
    this.destinationId = this.route.snapshot.paramMap.get('id')!;
    this.searchRecord(0, this.destinationId);
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  async searchRecord(n: number, s: string) {
    try {
      const data = await this.apiService.searchRecord(0, this.destinationId).toPromise();
      this.destination = data;
      if (this.destination && this.destination.startDate) {
        this.formattedDate = this.formatDate(this.destination.startDate);
      } else {
        console.error('La data di partenza non è disponibile');
      }
    } catch {
      console.error('Non è stato possibile ottenere i dati richiesti')
    }
  }

  formatDate(dateString: string): string {
    // Converto la stringa in una data valida
    const date = new Date(dateString); 
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    // Formatto la data in italiano
    return date.toLocaleDateString('it-IT', options); 
  }

  addToCart(destination: any){
    this.cartService.addToCart(destination);
    // alert(`Il viaggio ${destination.name} è stato aggiunto al carrello`);
    window['Swal'].fire({
      text: `Il viaggio ${destination.name} è stato aggiunto al carrello`,
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
