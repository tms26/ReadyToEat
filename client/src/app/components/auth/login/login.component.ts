import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService ) {}

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          if (response.user && response.user.role === 'customer') {
            console.log('Login successful', response);
            this.router.navigate(['/home']);
          } else {
            this.toastr.error('Login failed: Only customers can log in.');
            this.authService.logout();
          }
        },
        error: (err) => {
          console.error('Login failed', err);
          this.errorMessage =
            err.error?.message ||
            'Login failed. Please check your credentials.';
        },
      });
  }
}