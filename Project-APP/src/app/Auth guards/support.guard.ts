import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SupportGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isSupport()) {
      return true;
    } else {
      this.router.navigate(['/']); // Redirect non-admin users to home page
      return false;
    }
  }

  isSupport(): boolean {
    const role = localStorage.getItem('role');
    return role === 'Support Engineer'; // Ensure the role is Admin
  }
}
