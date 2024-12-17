import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router) { }

  selectRole(role: string): void {
    // Store the selected role (can be used for dynamic login handling)
    localStorage.setItem('userRole', role);

    // Navigate to the login page of the selected role
    switch(role) {
      case 'Admin':
        this.router.navigate(['/admin-login']);
        break;
      case 'User':
        this.router.navigate(['/user-login']);
        break;
      case 'Support Engineer':
        this.router.navigate(['/support-login']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}



