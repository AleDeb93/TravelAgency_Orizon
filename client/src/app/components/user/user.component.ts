import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  logOff: boolean = true;
  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    this.logIn();
  }

  logIn(): void {
    if(localStorage.getItem('token') != null && localStorage.getItem('token') != '') {
      this.logOff = false;
    }
  }
  logOut(): void {
    this.apiService.logoutUser();
    console.log('Logged out');
    window.location.reload();
  }

}
