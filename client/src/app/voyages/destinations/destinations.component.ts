import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-destinations',
  templateUrl: './destinations.component.html',
  styleUrl: './destinations.component.css'
})
export class DestinationsComponent {
  destinations: any[] = [];
  loading: boolean = true;

  constructor(private apiService: ApiService) { }

  async ngOnInit(): Promise<void>{
    await this.getRecords(0);
    setTimeout(() => {
      this.loading = false;
    }, 500);  
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
