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
  country: string = '';
  city: string = '';
  street: string = '';
  password: string = '';

  // Variabili per suggerimenti di indirizzo
  countrySuggestions: string[] = [];
  citySuggestions: string[] = [];
  streetSuggestions: string[] = [];

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    // Ottengo il parametro query "action" dalla rotta
    this.route.queryParams.subscribe(params => {
      this.action = params['action'] || 'login';
    });
  }

  toggleForm() {
    if (this.action === 'login')
      this.action = 'register';
    else
      this.action = 'login';
  }

  login() {
    const user = { email: this.email, password: this.password };
    this.apiService.loginUser(user).subscribe(
      (response) => {
        console.log('Login avvenuta con successo');
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
      country: this.country,
      city: this.city,
      street: this.street,
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

  /*
   * Volevo implementare la ricerca di indirizzi tramite nominatim ma le risorse gratuite non sono abbastanza performanti rispetto al mio desiderato.
   * Lascio il codice commentato per lasciare traccia del tentativo.
   */
  // searchAddress(query: string, type: string) {
  //   this.apiService.getAddressSuggestions(query).subscribe((data) => {
  //     if (type === 'country') {
  //       this.countrySuggestions = data
  //         .filter((item: any) => item.address.country)
  //         .map((item: any) => item.address.country);
  //     } else if (type === 'city') {
  //       this.citySuggestions = data
  //         .filter((item: any) => item.address.city || item.address.town || item.address.village)
  //         .map((item: any) => item.address.city || item.address.town || item.address.village);
  //     } else if (type === 'street') {
  //       this.streetSuggestions = data
  //         .filter((item: any) => item.address.road)
  //         .map((item: any) => item.address.road);
  //     }
  //   });
  // }
  // selectSuggestion(type: string, suggestion: string) {
  //   if (type === 'country') {
  //     this.country = suggestion;
  //     this.countrySuggestions = [];
  //   } else if (type === 'city') {
  //     this.city = suggestion;
  //     this.citySuggestions = [];
  //   } else if (type === 'street') {
  //     this.street = suggestion;
  //     this.streetSuggestions = [];
  //   }
  // }
  // getInputValue(event: Event, field: string) {
  //   const target = event.target as HTMLInputElement;
  //   this.searchAddress(target.value, field);
  // }
}
