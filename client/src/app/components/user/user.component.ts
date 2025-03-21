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
  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    this.isUserLogged();
  }

  isUserLogged(): void {
    if(localStorage.getItem('token') != null && localStorage.getItem('token') != '') {
      // Recuperare i dati dell'utente loggato
      // TODO
      // Fare la GetUserByID non basarsi sullo storage (al massimo lo storage lo aggiorno dopo)
      const storedUser = localStorage.getItem('user');
      this.user = storedUser ? JSON.parse(storedUser) : {};
      this.logOff = false;
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
