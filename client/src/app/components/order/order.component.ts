import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  providers: [OrderService, AuthService],
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  reviewComment: string = '';
  reviewImage: File | null = null;
  reviewOrderId: string | null = null;
  selectedOrderToCancel: any = null;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user._id) {
      this.orderService.getCustomerOrders(user._id).subscribe({
        next: (orders) => {
          this.orders = orders;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    } else {
      this.loading = false;
    }
  }

  openReviewModal(order: any) {
    this.reviewOrderId = order._id;
    this.reviewComment = '';
    this.reviewImage = null;
    const modalEl = document.getElementById('reviewModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  onFileSelected(event: any) {
    this.reviewImage = event.target.files[0] || null;
  }

  submitReview() {
    if (!this.reviewOrderId) return;
    const formData = new FormData();
    formData.append('comment', this.reviewComment);
    if (this.reviewImage) {
      formData.append('image', this.reviewImage);
    }
    this.orderService.submitReview(this.reviewOrderId, formData).subscribe({
      next: () => {
        this.toastr.success('Evaluation submitted successfully!');
        this.closeReviewModal();
        const order = this.orders.find(o => o._id === this.reviewOrderId);
        if (order) {
          order.reviewed = true;
        }
      },
      error: () => this.toastr.error('Error submitting review. Please try again later.'),
    });
  }
  
  private closeReviewModal() {
    const modalEl = document.getElementById('reviewModal');
    if (modalEl) {
      bootstrap.Modal.getInstance(modalEl)?.hide();
    }
  }

  canCancel(order: any): boolean {
    return order && order.status !== 'Cancelled' && order.status !== 'Completed';
  }

  cancelOrder(order: any) {
    this.selectedOrderToCancel = order;
    const modalEl = document.getElementById('cancelModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  confirmCancel() {
    if (!this.selectedOrderToCancel) return;

    const order = this.selectedOrderToCancel;
    const created = new Date(order.date);
    const now = new Date();
    const diffMinutes = (now.getTime() - created.getTime()) / 60000;

    if (order.status === 'Preparing') {
      this.toastr.error('Unable to cancel: order is already being prepared.');
      this.closeCancelModal();
      return;
    }
    if (diffMinutes > 5) {
      this.toastr.error('Unable to cancel: order can only be cancelled within 5 minutes of creation.');
      this.closeCancelModal();
      return;
    }

    this.orderService.cancelOrder(order._id).subscribe({
      next: () => {
        this.selectedOrderToCancel.status = 'Cancelled';
        this.closeCancelModal();
        this.selectedOrderToCancel = null;
      },
      error: (err) => {
        alert(err.error?.error || 'Unable to cancel order.');
        this.closeCancelModal();
        this.selectedOrderToCancel = null;
      },
    });
  }

  private closeCancelModal() {
    const modalEl = document.getElementById('cancelModal');
    if (modalEl) {
      bootstrap.Modal.getInstance(modalEl)?.hide();
    }
  }
}
