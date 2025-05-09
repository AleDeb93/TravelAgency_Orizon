import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { ApiService } from './api.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  constructor(private apiService: ApiService, private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(this.router.createUrlTree(['/account']));
    }
  
    return this.apiService.verifyToken().pipe(
      map(() => true),
      catchError(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenDate');
        return of(this.router.createUrlTree(['/account']));
      })
    );
  }
}