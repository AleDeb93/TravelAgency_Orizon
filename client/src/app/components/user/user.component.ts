import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  logOff: boolean = true;
  user: any = {};
  orders: any = [];
  constructor(private apiService: ApiService, private authService: AuthService) { }

  async ngOnInit(): Promise<void> {
    // this.isUserLogged();
    if (this.authService.canActivate()) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        try {
          const userData = await this.apiService.getUser(parsedUser.id).toPromise()
          this.user = userData;
          this.logOff = false;
          const orderData = await this.apiService.getOrderByUserId(parsedUser.id).toPromise()
          this.orders = orderData;
          console.log('Ordini ricevuti:', this.orders);
        }
        catch (error) {
          console.error('Non è stato possibile ottenere i dati richiesti');
          this.logOff = true;
        }
      } else {
        this.logOff = true;
      }
    }
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------
  // FUNZIONI PER LA GESTIONE DEI DATI UTENTE E PERSONALIZZAIONE PAGINA
  //-------------------------------------------------------------------------------------------------------------------------------------------------

  getUserAvatar(gender: string): string {
    const avatars: Record<string, string> = {
      Male: 'https://cdn-icons-png.flaticon.com/128/1216/1216774.png',
      Female: 'https://cdn-icons-png.flaticon.com/128/15567/15567994.png',
      Nonbinary: 'https://cdn-icons-png.flaticon.com/128/5436/5436228.png'
    };

    return avatars[gender] ?? 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png'; // Default avatar
  }

  getUserOrdres() {
    this.apiService.getOrderByUserId(this.user.id).subscribe({
      next: response => {
        this.orders = response;
        console.log('Ordini ricevuti:', response);
      },
      error: err => {
        console.error('Errore nella getUserOrdres:', err);
      }
    });
  }


  //-------------------------------------------------------------------------------------------------------------------------------------------------
  // FUNZIONE PER LOGOUT
  //-------------------------------------------------------------------------------------------------------------------------------------------------

  logOut(): void {
    this.apiService.logoutUser();
    console.log('Logged out');
    window.location.reload();
  }


}
