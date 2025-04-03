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
    return this.items;
  }

  loadCartFromStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.items = JSON.parse(storedCart);
    }
  }

  clearCart() {
    this.items = [];
    localStorage.removeItem('cart');
  }

  removeItem(id: number) {
    this.items = this.items.filter(item => item.id !== id);
    if (this.items = []) 
      localStorage.removeItem('cart');
    else
      localStorage.setItem('cart', JSON.stringify(this.items)); 
  }
}
