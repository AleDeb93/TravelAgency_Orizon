import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  logOff: boolean = true;
  user: any = {};
  // copia dell'utente per la modifica
  editedUser: any = {};
  orders: any = [];
  isEditModalOpen: boolean = false;

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
          // Ordino per primo l'ordine con status 'pending' se presente
          this.orders.sort((a: { status: string; }, b: { status: string; }) => {
            if (a.status === 'pending') return -1;
            if (b.status === 'pending') return 1;
            return 0;
          });
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
      },
      error: err => {
        console.error('Errore nella getUserOrdres:', err);
      }
    });
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------
  // FUNZIONI PER LA GESTIONE DEL MODALE DI MODIFICA PROFILO
  //-------------------------------------------------------------------------------------------------------------------------------------------------

  openEditModal() {
    // Copio i dati dell'utente originale nella variabile editedUser
    this.editedUser = { ...this.user };
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  async onSubmit() {
    try {
      await this.apiService.updateUser(this.editedUser).toPromise();
      // Aggiorno l'utente con i dati modificati
      this.user = { ...this.editedUser };
      localStorage.setItem('user', JSON.stringify(this.user)); 

      this.closeEditModal();
    } catch (error) {
      console.error('Errore durante laggiornamento del profilo:', error);
    }
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------
  // FUNZIONE PER LOGOUT
  //-------------------------------------------------------------------------------------------------------------------------------------------------

  logOut(): void {
    this.apiService.logoutUser();
    console.log(`[${new Date().toLocaleString()}] Logged out`);
    window.location.reload();
  }
}
