import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../Services/user.service';// Ensure the service is imported
import { Router } from '@angular/router';
import { UserReadDto,UserUpdateDto } from '../Models/user.model';
import { AuthenticatedResponse } from '../Models/authenticated-response.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  metrics: any = {};
  adminProfile: UserReadDto | null = null;
  changePasswordData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  passwordError = '';
  passwordSuccessMessage = '';
  updateProfileError = '';
  updateProfileSuccessMessage = '';

  isSidebarOpen = false; // Controls the sidebar visibility
  showChangePasswordForm = false;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchMetrics();
    this.fetchAdminProfile();
  }

  // Toggle Sidebar (will only be visible when toggled)
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Fetch Dashboard Metrics
  fetchMetrics(): void {
    this.http.get<any[]>('http://localhost:5000/api/Dashboards').subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.metrics = data[0];
        }
      },
      error: (err) => console.error('Error fetching metrics:', err)
    });
  }

  // Fetch Admin Profile
  fetchAdminProfile(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getUserById(parseInt(userId)).subscribe({
        next: (data) => {
          this.adminProfile = data;
        },
        error: (err) => console.error('Error fetching admin profile:', err)
      });
    }
  }

  // Change Password
  changePassword(): void {
    if (this.changePasswordData.newPassword !== this.changePasswordData.confirmPassword) {
      this.passwordError = 'Passwords do not match.';
      return;
    }

    const userId = this.getAuthenticatedUserId();
    if (userId) {
      // Verify the old password before proceeding
      this.verifyCurrentPassword(userId, this.changePasswordData.oldPassword).then(isVerified => {
        if (isVerified) {
          // Proceed with password change if the current password is correct
          if (this.adminProfile) {
            const updatedUser: UserUpdateDto = {
              userId: this.adminProfile.userId,
              userName: this.adminProfile.userName,
              email: this.adminProfile.email,
              userPassword: this.changePasswordData.newPassword // Only include password here
            };

            this.userService.updateUser(this.adminProfile.userId, updatedUser).subscribe({
              next: (updatedProfile) => {
                this.passwordSuccessMessage = 'Password changed successfully.';
                // Update the profile after password change
                this.clearPasswordFields();
                this.showChangePasswordForm = false;
              },
              error: (err) => {
                console.error('Error updating password:', err);
                this.passwordError = 'Failed to update the password.';
              }
            });
          }
        } else {
          this.passwordError = 'Current password is incorrect.';
        }
      }).catch((err) => {
        console.error('Error verifying password:', err);
        this.passwordError = 'Error verifying the current password.';
      });
    }
  }

  // Verify the current password using UserReadDto
  verifyCurrentPassword(userId: number, oldPassword: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Fetch the current user profile to compare passwords
      this.userService.getUserById(userId).subscribe({
        next: (user: UserReadDto) => {
          // Check if the old password matches the one in the UserReadDto
          if (user.userPassword === oldPassword) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: (err) => {
          reject(err); // Reject the promise if there is an error fetching the user
        }
      });
    });
  }

  // Clear Password Fields
  clearPasswordFields(): void {
    this.changePasswordData = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.passwordError = '';
    this.passwordSuccessMessage = '';
  }

  // Logout Function
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  // Calculate Solved Percentage
  getSolvedPercentage(): number {
    const total = this.metrics?.totalTicketsRaised || 0;
    const solved = this.metrics?.totalTicketsSolved || 0;
    return total > 0 ? Math.round((solved / total) * 100) : 0;
  }

  // Get the authenticated user ID from the stored AuthenticatedResponse
  getAuthenticatedUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  }
}