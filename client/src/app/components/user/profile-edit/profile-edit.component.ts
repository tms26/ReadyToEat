import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../services/profile.service';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent]
})
export class ProfileEditComponent implements OnInit {
  profileForm!: FormGroup;
  errorMessage = '';
  successMessage = '';
  user: any = JSON.parse(localStorage.getItem('user') || '{}');


  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nif: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]]
    });

    this.profileService.getProfile().subscribe({
      next: (user) => {
        this.profileForm.patchValue(user);
      },
      error: () => {
        this.errorMessage = 'Error loading profile.';
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;
    this.profileService.updateProfile(this.profileForm.value).subscribe({
      next: (response) => {
        const updatedUser = response.user || response;
        this.userService.setUser(updatedUser); 
        this.user = updatedUser;
        this.successMessage = 'Profile updated successfully!';
      },
      error: () => {
        this.errorMessage = 'Error updating profile.';
      }
    });
  }
}