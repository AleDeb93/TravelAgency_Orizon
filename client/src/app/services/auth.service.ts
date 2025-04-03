import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apiSerice: ApiService, private router: Router) { }

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {	
      return true;
    } else {
      this.router.navigate(['/account']);
      return false;
    }
  }

  // La logica è duplicata client/server per evitare chiamate API inutili 
  // Un ulteriore controllo sul token da parte del server viene fatto passando per la pagina dell'account utente
  isTokenExpired(): boolean {
    const tokenDate = localStorage.getItem('tokenDate');
    if (!tokenDate)
      return true;
    const now = new Date().getTime();
    const expiryTime = parseInt(tokenDate, 10) + 24 * 60 * 60 * 1000; // 24 ore
    if (now > expiryTime) 
      return true;
    else
      return false;
  }
}