import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  logOff: boolean = true;
  user: any = {};
  constructor(private apiService: ApiService) { }

  async ngOnInit(): Promise<void> {
    this.isUserLogged();
  }

  async isUserLogged(): Promise<void> {
    if (localStorage.getItem('token') != null && localStorage.getItem('token') != '') {
      // Recuperare i dati dell'utente loggato
      // TODO
      // Fare la GetUserByID non basarsi sullo storage (al massimo lo storage lo aggiorno dopo)
      const storedUser = localStorage.getItem('user');
      if (storedUser){
        console.log(storedUser);
        const parsedUser = JSON.parse(storedUser)
        try{
          const data = await this.apiService.getUser(parsedUser.id).toPromise()
          this.user = data;
          this.logOff = false;
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

  logOut(): void {
    this.apiService.logoutUser();
    console.log('Logged out');
    window.location.reload();
  }

  getUserAvatar(gender: string): string {
    const avatars: Record<string, string> = {
      Male: 'https://cdn-icons-png.flaticon.com/128/1216/1216774.png',
      Female: 'https://cdn-icons-png.flaticon.com/128/15567/15567994.png',
      Nonbinary: 'https://cdn-icons-png.flaticon.com/128/5436/5436228.png'
    };

    return avatars[gender] ?? 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png'; // Default avatar
  }

}
