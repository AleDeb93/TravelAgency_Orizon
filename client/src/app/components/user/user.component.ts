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
      const storedUser = localStorage.getItem('user');
      this.user = storedUser ? JSON.parse(storedUser) : {};
      console.log(this.user);
      this.logOff = false;
    }
  }

  logOut(): void {
    this.apiService.logoutUser();
    console.log('Logged out');
    window.location.reload();
  }

}
