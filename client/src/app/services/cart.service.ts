import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: any[] = []; 

  constructor() {}

  addToCart(item: any) {
    this.items.push(item);
    localStorage.setItem('cart', JSON.stringify(this.items)); 
  }

  getItems() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.items = JSON.parse(storedCart);
    }
    return this.items;
  }

  clearCart() {
    this.items = [];
    localStorage.removeItem('cart');
  }

  removeItem(id: number) {
    this.items = this.items.filter(item => item.id !== id);
    if (this.items.length === 0) 
      localStorage.removeItem('cart');
    else
      localStorage.setItem('cart', JSON.stringify(this.items)); 
  }
}
