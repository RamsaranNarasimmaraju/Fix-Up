import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service';
import { UserReadDto } from '../Models/user.model';
import { UserUpdateDto } from '../Models/user.model';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {
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
  isRightSidebarOpen = false; // Controls the right sidebar visibility
  showChangePasswordForm = false;
  
  constructor(
    private userService: UserService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.fetchUserProfile();
  }
  
  // Toggle Sidebar (Left)
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Toggle Right Sidebar
  toggleRightSidebar(): void {
    this.isRightSidebarOpen = !this.isRightSidebarOpen;
  }

  fetchUserProfile(): void {
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
      this.verifyCurrentPassword(userId, this.changePasswordData.oldPassword).then(isVerified => {
        if (isVerified) {
          if (this.adminProfile) {
            const updatedUser: UserUpdateDto = {
              userId: this.adminProfile.userId,
              userName: this.adminProfile.userName,
              email: this.adminProfile.email,
              userPassword: this.changePasswordData.newPassword
            };

            this.userService.updateUser(this.adminProfile.userId, updatedUser).subscribe({
              next: (updatedProfile) => {
                this.passwordSuccessMessage = 'Password changed successfully.';
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

  verifyCurrentPassword(userId: number, oldPassword: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.userService.getUserById(userId).subscribe({
        next: (user: UserReadDto) => {
          if (user.userPassword === oldPassword) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  }

  clearPasswordFields(): void {
    this.changePasswordData = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.passwordError = '';
    this.passwordSuccessMessage = '';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  getAuthenticatedUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  }
}
