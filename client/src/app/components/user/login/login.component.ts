import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  action: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Ottieni il parametro query "action" dalla rotta
    this.route.queryParams.subscribe(params => {
      this.action = params['action'] || 'login'; 
    });
  }

}
