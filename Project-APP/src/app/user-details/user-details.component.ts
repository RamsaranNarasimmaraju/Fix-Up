import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../Services/user.service';
import { UserReadDto } from '../Models/user.model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  users: UserReadDto[] = [];
  roleMapping: { [key: number]: string } = {
    1: 'Admin',
    2: 'User',
    3: 'Support Engineer'
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  // Fetch users from the UserService
  fetchUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log('Fetched Users:', data);  // Debugging line to see the API response
        this.users = data.map(user => ({
          ...user,
          roleName: this.getRoleName(user.roleId)
        }));
      },
      error: (err) => console.error('Error fetching users:', err)
    });
  }

  // Get Role Name based on roleId
  getRoleName(roleId: number): string {
    return this.roleMapping[roleId] || 'Unknown'; // Default to 'Unknown' if roleId is not found
  }

  // Download User Data as CSV (excluding role and userPassword)
  downloadUserData(): void {
    const csvData = this.convertToCSV(this.users);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'users.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Convert Users to CSV (excluding 'role' and 'userPassword')
  convertToCSV(data: UserReadDto[]): string {
    if (!data || data.length === 0) return '';
    
    // Define the columns you want in the CSV
    const columns = ['UserId', 'UserName', 'Email', 'DateCreated', 'RoleName'];

    // Create the CSV rows based on columns and the user data
    const csvRows = [
      columns.join(','),  // Header row
      ...data.map((row) => [
        row.userId,
        row.userName,
        row.email,
        row.dateCreated ? new Date(row.dateCreated).toLocaleDateString() : '', // Format the date if available
        this.getRoleName(row.roleId) || 'Unknown' // Default to 'Unknown' if roleId is missing
      ].join(','))
    ];
    
    return csvRows.join('\n');
  }
}