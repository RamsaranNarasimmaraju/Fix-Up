import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isUser()) {
      return true;
    } else {
      this.router.navigate(['/']); // Redirect non-admin users to home page
      return false;
    }
  }

  isUser(): boolean {
    const role = localStorage.getItem('role');
    return role === 'User'; // Ensure the role is Admin
  }
}
