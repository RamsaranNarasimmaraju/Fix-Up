import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomIssueReadDto } from '../Models/custom-issue.model';
import { CustomIssuesService } from '../Services/custom-issue.service';

@Component({
  selector: 'app-custom-solution',
  templateUrl: './custom-solution.component.html',
  styleUrls: ['./custom-solution.component.css'],
})
export class CustomSolutionComponent implements OnInit {
  customIssues: CustomIssueReadDto[] = []; // To store filtered issues
  userId: number | null = null; // Initialize as null

  constructor(
    private customIssueService: CustomIssuesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    if (storedUserId) {
      this.userId = +storedUserId; // Convert to a number
      console.log('Retrieved User ID:', this.userId); // Debugging log
    } else {
      console.error('User is not logged in. Redirecting to login...');
      this.router.navigate(['/login']); // Redirect to login if no userId
      return;
    }

    // Fetch all custom issues and filter by userId
    this.fetchAndFilterCustomIssues();
  }

  private fetchAndFilterCustomIssues(): void {
    this.customIssueService.getCustomIssues().subscribe({
      next: (issues) => {
        console.log('API Response:', issues); // Debug: All issues from API

        if (this.userId !== null) {
          // Adjusted to use 'userid' from the API response
          this.customIssues = issues.filter(
            (issue) => issue.userid === this.userId
          );
          console.log('Filtered Issues for User:', this.customIssues); // Debug: Filtered issues
        }

        if (this.customIssues.length === 0) {
          console.log('No custom issues found for the user.');
        }
      },
      error: (err) => {
        console.error('Error fetching custom issues:', err);
      },
    });
  }
}
