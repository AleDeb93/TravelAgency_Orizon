import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css'
})
export class OffersComponent {
  destinations: any[] = [];
  loading: boolean = true;

  constructor(private apiService: ApiService) { }

  async ngOnInit(): Promise<void> {
    await this.getRecords(0);
    setTimeout(() => {
      this.loading = false;
    }, 500);
  };

  async getRecords(n: number) {
    try {
      const data = await this.apiService.getList(n).toPromise();
      this.destinations = data.filter((destination: any) => destination.discount != null);
    } catch {
      console.error('Non è stato possibile ottenere i dati richiesti')
    }
  }
}
