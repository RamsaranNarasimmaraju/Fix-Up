import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';


import { Login } from '../Models/login.model'; // Import Login model
import { AuthenticatedResponse } from '../Models/authenticated-response.model';
import { NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
  invalidLogin: boolean = false;  // Fix variable name to match later reference
  credentials: Login = { UserName: '', UserPassWord: '' };
  UserAccessError: boolean = false; 

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {}

  login = (form: NgForm) => {
    if (form.valid) {
      this.http.post<AuthenticatedResponse>('http://localhost:5000/api/Auth/login', this.credentials, {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
      })
      .subscribe({
        next: (response: AuthenticatedResponse) => {
          const token = response.token;
          const role = response.role;
          const userId = response.userId;
    
          // Log and store userId
          localStorage.setItem("jwt", token);
          localStorage.setItem("role", role);
          localStorage.setItem("userId", userId.toString());
          console.log('User ID saved to localStorage:', localStorage.getItem('userId')); // Debugging
          
          // Role-based navigation
          if (role === 'User') {
            this.router.navigate(["/User-dashboard"]);
          } else {
            this.UserAccessError = true;  // Set the error when it's not a User role
            
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Login Error:', err);
          this.invalidLogin = true;
        }
      });
    }
  }
  
  isUser() {
    const role = localStorage.getItem('role');
    console.log('Stored Role:', role); // Debugging
    return role === 'User'; // Check if role is User
  }
  
  validatePassword(model: NgModel): { [key: string]: boolean } | null {
      const password = model.value || '';
      const errors: { [key: string]: boolean } = {};
  
      if (!/[A-Z]/.test(password)) {
        errors['missingCapital'] = true;
      }
      if (!/[!@#$&*]/.test(password)) {
        errors['missingSpecial'] = true;
      }
      if (!/[0-9]/.test(password)) {
        errors['missingNumber'] = true;
      }
      if (password.length < 8) {
        errors['minlength'] = true;
      }
  
      // Assign errors to the NgModel control
      model.control.setErrors(Object.keys(errors).length ? errors : null);
  
      return null; // Template-driven validation does not need return errors
    }
}  

