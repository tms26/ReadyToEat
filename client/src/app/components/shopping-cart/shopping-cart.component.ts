import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CartService } from '../../services/cart.service';
import { RestaurantService } from '../../services/restaurant.service';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare var bootstrap: any;

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = [];
  shippingCost: number = 10;
  paymentOption: string = '';
  deliveryAddress: string = '';
  restaurantName: string = '';
  deliveryDistance: number = 0;
  restaurantAddress: string = '';
  timerValue: number | null = null;
  restaurantMapUrl: SafeResourceUrl = '';

  constructor(
    private cartService: CartService,
    private router: Router,
    private orderService: OrderService,
    private toastr: ToastrService,
    private restaurantService: RestaurantService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      if (items.length > 0) {
        const restaurantId = items[0].restaurantId;
        if (restaurantId) {
          this.restaurantService.getRestaurantById(restaurantId).subscribe({
            next: (restaurant: any) => {
              this.restaurantName = restaurant.restaurantName;
              this.deliveryDistance = restaurant.deliveryDistance;
              this.restaurantAddress = restaurant.address;
              this.restaurantMapUrl = this.getRestaurantMapUrl();
            },
            error: () => {
              this.restaurantName = '';
              this.deliveryDistance = 0;
              this.restaurantAddress = '';
              this.restaurantMapUrl = '';
            },
          });
        }
      } else {
        this.restaurantName = '';
        this.deliveryDistance = 0;
        this.restaurantAddress = '';
        this.restaurantMapUrl = '';
      }
    });

    this.cartService.timerValue$.subscribe((value) => {
      this.timerValue = value;
    });
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.preco * (item.quantity || 1),
      0
    );
  }

  calculateTax(): number {
    const taxRate = 0.1;
    return this.calculateSubtotal() * taxRate;
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTax() + this.shippingCost;
  }

  increaseQuantity(item: any): void {
    item.quantity = (item.quantity || 1) + 1;
    this.cartService.updateCartItem(item);
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.cartService.updateCartItem(item);
    }
  }

  removeFromCart(item: any): void {
    this.cartService.removeCartItem(item._id);
  }

  proceedToCheckout(): void {
    let customerId: string | undefined;
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        customerId = decoded._id;
      } catch {
        customerId = undefined;
      }
    }
    if (!customerId) {
      this.toastr.error('You need to be authenticated to order.');
      return;
    }
    if (!this.cartItems.length) {
      this.toastr.error('The cart is empty.');
      return;
    }

    const restaurantId = this.cartItems[0].restaurantId;
    const dishes = this.cartItems.map((item) => ({
      dish: item._id,
      quantity: item.quantity || 1,
    }));
    const amount = this.calculateSubtotal();

    const order = { restaurantId, customerId, amount, dishes };

    this.orderService.createOrder(order).subscribe({
      next: () => {
        this.toastr.success('Order created successfully!');
        this.cartService.clearCart();
        this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.status === 403 && err.error?.error) {
          this.toastr.error(err.error.error);
        } else {
          this.toastr.error('Error creating order!');
        }
      },
    });
  }

  confirmPayment(): void {
    if (this.paymentOption === 'courier' && !this.deliveryAddress) {
      this.toastr.error('Please enter a delivery address.');
      return;
    }

    const customerId = this.getCustomerId();
    if (!customerId) {
      this.toastr.error('You need to be authenticated to order.');
      return;
    }

    const restaurantId = this.cartItems[0].restaurantId;
    const dishes = this.cartItems.map((item) => ({
      dish: item._id,
      quantity: item.quantity || 1,
    }));
    const amount = this.calculateSubtotal();

    const order = {
      restaurantId,
      customerId,
      amount,
      dishes,
      paymentOption: this.paymentOption,
      deliveryAddress:
        this.paymentOption === 'courier' ? this.deliveryAddress : null,
    };

    this.orderService.createOrder(order).subscribe({
      next: () => {
        const modalElement = document.getElementById('paymentModal');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
        this.toastr.success('Order created successfully!');
        this.cartService.clearCart();
        this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.status === 403 && err.error?.error) {
          this.toastr.error(err.error.error);
        } else {
          this.toastr.error('Error creating order!');
        }
      },
    });
  }

  openPaymentModal(): void {
    if (!this.cartItems.length) {
      this.toastr.error('The cart is empty.');
      return;
    }
    const modalElement = document.getElementById('paymentModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  private getCustomerId(): string | undefined {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded._id;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  getRestaurantMapUrl(): SafeResourceUrl {
    if (!this.restaurantAddress) return '';
    const url =
      'https://www.google.com/maps?q=' +
      encodeURIComponent(this.restaurantAddress) +
      '&z=15&output=embed';
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
