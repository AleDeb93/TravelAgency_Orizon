import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client';
  scrolled = false;
  isAccountPageFlag = false;

  threshold: number = 0;
  constructor(private router: Router, private authService: AuthService, private apiService: ApiService) {
    this.setScrollThreshold();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAccountPageFlag = event.url.includes('account')
      }
    });
  }

  ngOnInit() {
  }


  setScrollThreshold() {
    this.threshold = window.innerHeight * 0.6;
  }
  isAccountPage() {
    return this.isAccountPage;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setScrollThreshold();
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Modifica la condizione di scorrimento in base alla soglia calcolata
    this.scrolled = window.scrollY > this.threshold;
  }

}
