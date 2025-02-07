import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  action: string = '';
  isValid: boolean = true;

  // Variabili per login e registrazione
  name: string = ''; 
  surname: string = '';
  email: string = '';
  gender: string = '';
  password: string = '';

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    // Ottengo il parametro query "action" dalla rotta
    this.route.queryParams.subscribe(params => {
      this.action = params['action'] || 'login'; 
    });
  }

  toggleForm() {
    if (this.action === 'login') {
      this.action = 'register';
    } else {    
      this.action = 'login';
    }
  }

  login() {
    const user = { email: this.email, password: this.password };
    this.apiService.loginUser(user).subscribe(
      (response) => {
        console.log('Login successo', response);
      },
      (error) => {
        console.error(error);
        this.isValid = false; 
      }
    );
  }

  register() {
    const newUser = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      gender: this.gender,
      password: this.password
    };
    this.apiService.createUser(newUser).subscribe(
      (response) => {
        console.log(response);
        // Gestire la login automatica
        this.login();
      },
      (error) => {
        console.error(error);
        this.isValid = false; 
      }
    );
  }
}
