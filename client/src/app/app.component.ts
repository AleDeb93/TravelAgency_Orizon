import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client';

  scrolled = false;


  threshold: number = 0;
  constructor() {
    this.setScrollThreshold();
  }

  setScrollThreshold() {
    this.threshold = window.innerHeight * 0.6;
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
