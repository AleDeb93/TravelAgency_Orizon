import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-destinations',
  templateUrl: './destinations.component.html',
  styleUrl: './destinations.component.css'
})
export class DestinationsComponent {
  destinations: any[] = [];

  constructor(private apiService: ApiService) { }

  async ngOnInit(): Promise<void>{
    await this.getRecords(0);
  };

  async getRecords(n: number){
    try {
      const data = await this.apiService.getList(n).toPromise();
      this.destinations = data;
    } catch {
      console.error('Non è stato possibile ottenere i dati richiesti')
    }
  }

}
