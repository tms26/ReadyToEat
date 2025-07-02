import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: any[] = [];
  private cartCount = new BehaviorSubject<number>(0);
  private cartItems = new BehaviorSubject<any[]>([]);
  private userId: string | null = null;

  private timerValue = new BehaviorSubject<number | null>(null);
  timerValue$ = this.timerValue.asObservable();
  private timerSub: Subscription | null = null;
  private TIMER_DURATION = 10 * 60;

  cartCount$ = this.cartCount.asObservable();
  cartItems$ = this.cartItems.asObservable();

  constructor(private toastr: ToastrService) {
    this.setUserIdFromToken();
    this.loadCart();
    this.restoreCartTimer();
  }

  private setUserIdFromToken() {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userId = payload._id;
      } catch {
        this.userId = null;
      }
    }
  }

  private getCartKey(): string {
    return this.userId ? `cart_${this.userId}` : 'cart_guest';
  }

  public loadCart() {
    const savedCart = localStorage.getItem(this.getCartKey());
    this.cart = savedCart ? JSON.parse(savedCart) : [];
    this.cartCount.next(this.cart.length);
    this.cartItems.next(this.cart);
  }

  private updateCartState() {
    localStorage.setItem(this.getCartKey(), JSON.stringify(this.cart));
    this.cartCount.next(this.cart.length);
    this.cartItems.next(this.cart);

    if (this.cart.length === 0) {
      this.stopCartTimer();
    } else if (!this.timerSub) {
      this.startCartTimer();
    }
  }

    addToCart(dish: any, restaurantId: string): boolean {
      if (this.cart.length > 0 && this.cart[0].restaurantId !== restaurantId) {
        this.toastr.error(
          'You can only add items from the same restaurant to the cart.'
        );
        return false;
      }
  
      const existingItem = this.cart.find((item) => item._id === dish._id);
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        dish.quantity = 1;
        dish.restaurantId = restaurantId;
        this.cart.push(dish);
      }
      this.updateCartState();
  
      if (this.cart.length === 1 && !this.timerSub) {
        this.startCartTimer();
      }
      return true;
    }

  clearCart() {
    this.cart = [];
    this.updateCartState();
    this.stopCartTimer();
  }

  removeCartItem(itemId: string): void {
    this.cart = this.cart.filter((item) => item._id !== itemId);
    this.updateCartState();
    if (this.cart.length === 0) {
      this.stopCartTimer();
    }
  }

  updateCartItem(updatedItem: any) {
    const index = this.cart.findIndex((item) => item._id === updatedItem._id);
    if (index !== -1) {
      this.cart[index] = updatedItem;
      this.updateCartState();
      if (updatedItem.quantity <= 0) {
        this.removeCartItem(updatedItem._id);
        if (this.cart.length === 0) {
          this.stopCartTimer();
        }
      }
    }
  }

  private getTimerKey(): string {
    return this.userId
      ? `cartTimerStart_${this.userId}`
      : 'cartTimerStart_guest';
  }

  public startCartTimer() {
    this.stopCartTimer();
    this.timerValue.next(this.TIMER_DURATION);
    this.timerSub = interval(1000).subscribe(() => {
      const current = this.timerValue.value;
      if (current !== null && current > 0) {
        this.timerValue.next(current - 1);
      } else if (current === 0) {
        this.clearCart();
        this.stopCartTimer();
        this.toastr.info('O tempo expirou. O carrinho foi limpo.');
      }
    });
    localStorage.setItem(this.getTimerKey(), Date.now().toString());
  }

  public stopCartTimer() {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
      this.timerSub = null;
    }
    this.timerValue.next(null);
    localStorage.removeItem(this.getTimerKey());
  }

  public restoreCartTimer() {
    const start = localStorage.getItem(this.getTimerKey());
    if (start) {
      const elapsed = Math.floor((Date.now() - parseInt(start, 10)) / 1000);
      const remaining = this.TIMER_DURATION - elapsed;
      if (remaining > 0) {
        this.timerValue.next(remaining);
        this.timerSub = interval(1000).subscribe(() => {
          const current = this.timerValue.value;
          if (current !== null && current > 0) {
            this.timerValue.next(current - 1);
          } else if (current === 0) {
            this.clearCart();
            this.stopCartTimer();
            this.toastr.info('Time expired. The cart has been cleared.');
          }
        });
      } else {
        this.clearCart();
        this.stopCartTimer();
      }
    } else if (this.cart.length > 0) {
      this.startCartTimer();
    }
  }

  public onUserChanged() {
    this.setUserIdFromToken();
    this.loadCart();
  }
}
