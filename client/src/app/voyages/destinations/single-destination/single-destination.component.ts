import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-single-destination',
  templateUrl: './single-destination.component.html',
  styleUrls: ['./single-destination.component.css']
})
export class SingleDestinationComponent implements OnInit {
  destinationId: string = '';  // Inizializzazione con una stringa vuota
  destination: any;	

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    // Ottieni l'ID dalla rotta
    this.destinationId = this.route.snapshot.paramMap.get('id')!;
    console.log('Destinazione ID:', this.destinationId);
    // Qui puoi usare l'ID per fare una richiesta HTTP o caricare i dettagli della destinazione
  }

  async searchRecord(n: number, s: string){
    try {
      const data = await this.apiService.searchRecord(0, this.destinationId).toPromise();
      this.destination = data;
    } catch {
      console.error('Non è stato possibile ottenere i dati richiesti')
    }
  }
}
