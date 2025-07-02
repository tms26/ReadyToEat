import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-security',
  templateUrl: './profile-security.component.html',
  styleUrls: ['./profile-security.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
})
export class ProfileSecurityComponent {
  passwordForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private profileService: ProfileService) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{6}$/), 
        ],
      ],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (
      this.passwordForm.invalid ||
      this.passwordForm.value.newPassword !==
        this.passwordForm.value.confirmPassword
    ) {
      this.errorMessage = 'As passwords não coincidem ou são inválidas.';
      return;
    }
    this.profileService.changePassword(this.passwordForm.value).subscribe({
      next: () => {
        this.successMessage = 'Password changed successfully!';
        this.errorMessage = '';
        this.passwordForm.reset();
      },
      error: () => {
        this.errorMessage = 'Error changing password. Please try again.';
        this.successMessage = '';
      },
    });
  }
}
