import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service'; // Service for user operations
import { UserCreateDto } from '../Models/user.model'; // DTO import
import { UserReadDto } from '../Models/user.model'; // DTO import

@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.css'],
})
export class AdminRegisterComponent {
  successMessage: string | null = null;
  errorMessage: string | null = null;
  confirmPassword: string = ''; // New property for re-entered password
  usernameTaken: boolean = false; // Flag for username availability check

  user: UserCreateDto = {
    userName: '',
    email: '',
    userPassword: '',
    roleId: 1, // RoleId 1 signifies admin
  };

  constructor(private userService: UserService, private router: Router) {}

  passwordsMatch(): boolean {
    return this.user.userPassword === this.confirmPassword;
  }

  usernameValid(): boolean {
    return this.user.userName.length >= 8;
  }

  passwordValid(): boolean {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$&*]).{8,}$/;
    return passwordPattern.test(this.user.userPassword);
  }

  emailValid(): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(this.user.email);
  }

  // Check if the username already exists
  validateUsernameAvailability(): void {
    this.userService.getUsers().subscribe({
      next: (users: UserReadDto[]) => {
        // Check if any existing username matches the entered one
        this.usernameTaken = users.some(user => user.userName === this.user.userName);
      },
      error: (err) => {
        console.error('Error fetching users for username validation:', err);
        this.usernameTaken = false; // Assume available in case of error
      }
    });
  }

  register(form: NgForm): void {
    if (form.valid && this.passwordsMatch() && this.usernameValid() && this.passwordValid() && !this.usernameTaken) {
      console.log('User Payload:', this.user);

      this.userService.createUser(this.user).subscribe({
        next: (response) => {
          this.successMessage = 'Registration successful! Redirecting to Admin Dashboard...';
          this.errorMessage = null;

          form.reset();
          this.user = { userName: '', email: '', userPassword: '', roleId: 1 };
          this.confirmPassword = '';

          setTimeout(() => {
            this.router.navigate(['admin-dashboard']);
          }, 2000);
        },
        error: (err) => {
          this.errorMessage = 'Registration failed. Please try again.';
          console.error(err);
        },
      });
    } else {
      if (this.usernameTaken) {
        this.errorMessage = 'Username already taken. Please try a different one.';
      } else if (!this.passwordsMatch()) {
        this.errorMessage = 'Passwords do not match.';
      } else if (!this.usernameValid()) {
        this.errorMessage = 'Username must be at least 8 characters long.';
      } else if (!this.passwordValid()) {
        this.errorMessage = 'Password must be at least 8 characters long and contain one uppercase letter, one number, and one special character.';
      } else if (!this.emailValid()) {
        this.errorMessage = 'Please enter a valid email address.';
      }
    }
  }
}
