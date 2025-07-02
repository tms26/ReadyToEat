import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders';
  constructor(private http: HttpClient) { }

  createOrder(order: any) {
    return this.http.post(this.apiUrl, order);
  }
  getCustomerOrders(customerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?customerId=${customerId}`);
  }

  submitReview(orderId: string, formData: FormData) {
    return this.http.post(`${this.apiUrl}/${orderId}/review`, formData);
  }

  cancelOrder(orderId: string) {
    return this.http.post(`${this.apiUrl}/${orderId}/cancel`, {});
  }
}