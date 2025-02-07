import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apiSerice: ApiService, private router: Router) { }

  canActivate(): boolean {
    if (this.apiSerice.token != '') {	
      return true;
    } else {
      this.router.navigate(['/account']);
      return false;
    }
  }
}