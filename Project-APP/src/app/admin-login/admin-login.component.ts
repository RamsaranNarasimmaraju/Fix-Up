import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';


import { Login } from '../Models/login.model'; // Import Login model
import { AuthenticatedResponse } from '../Models/authenticated-response.model';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent  {
  invalidLogin: boolean = false;  // Fix variable name to match later reference
  credentials: Login = { UserName: '', UserPassWord: '' };
  adminAccessError: boolean = false; 

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {}

  login = (form: NgForm) => {
    if (form.valid) {
      this.http.post<AuthenticatedResponse>('http://localhost:5000/api/Auth/login', this.credentials, {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
      })
      .subscribe({
        next: (response: AuthenticatedResponse) => {
          console.log('Login Response:', response); // Debugging

          const token = response.token;
          const role = response.role;
          const userId=response.userId;

          localStorage.setItem("jwt", token); 
          localStorage.setItem("role", role);
          localStorage.setItem("userId", userId.toString());


          this.invalidLogin = false;

          if (this.isUserAdmin()) {
            this.adminAccessError = false;// Debugging
            this.router.navigate(["/admin-dashboard"]); // Navigate to Admin Dashboard
          } else {
            this.adminAccessError = true;

             // Navigate to home page for other roles
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Login Error:', err);
          this.invalidLogin = true;
        }
      });
    }
  }

  isUserAdmin() {
    const role = localStorage.getItem('role');
    console.log('Stored Role:', role); // Debugging
    return role === 'Admin'; // Check if role is Admin
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