import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client';

  scrolled = false

  @HostListener('window:scroll', [])
  onWindowScroll(){
    this.scrolled = window.scrollY > 600;
  }

}
