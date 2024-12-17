// Updated RegisterComponent logic
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../Services/user.service'; // Import UserService
import { UserCreateDto } from '../../Models/user.model'; // Import DTOs
import { UserReadDto } from '../../Models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  successMessage: string | null = null;
  errorMessage: string | null = null;
  confirmPassword: string = ''; // New property for re-entered password
  usernameTaken: boolean = false; // Flag for username availability check

  // Instance of the UserCreateDto
  user: UserCreateDto = {
    userName: '',
    email: '',
    userPassword: '',
    roleId: 2, // Example: Default Role ID for a new user
  };

  constructor(private userService: UserService, private router: Router) {}

  // Passwords match validation
  passwordsMatch(): boolean {
    return this.user.userPassword === this.confirmPassword;
  }

  // Username validation: Should be at least 8 characters long
  usernameValid(): boolean {
    return this.user.userName.length >= 8;
  }

  // Password validation: Must be 8 characters, with at least 1 uppercase letter, 1 number, and 1 special character
  passwordValid(): boolean {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$&*]).{8,}$/;
    return passwordPattern.test(this.user.userPassword);
  }

  // Email validation: Must be a valid email format
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
  // Register user
  register(form: NgForm): void {
    if (form.valid && this.passwordsMatch() && this.usernameValid() && this.passwordValid() && !this.usernameTaken) {
      console.log('User Payload:', this.user); // Log the payload

      this.userService.createUser(this.user).subscribe({
        next: (response) => {
          this.successMessage = 'Registration successful! Redirecting to Login...';
          this.errorMessage = null;

          form.reset();
          this.user = {
            userName: '',
            email: '',
            userPassword: '',
            roleId: 2,
          };
          this.confirmPassword = '';

          // Redirect to login page after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
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
