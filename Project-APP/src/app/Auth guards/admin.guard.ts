import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isUserAdmin()) {
      return true;
    } else {
      this.router.navigate(['/']); // Redirect non-admin users to home page
      return false;
    }
  }

  isUserAdmin(): boolean {
    const role = localStorage.getItem('role');
    return role === 'Admin'; // Ensure the role is Admin
  }
}
