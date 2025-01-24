import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  loading: boolean = true;
  logOff: boolean = true;


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loading = false;
  }

}
