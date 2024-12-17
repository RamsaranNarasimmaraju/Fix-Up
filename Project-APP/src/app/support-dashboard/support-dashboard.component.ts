import { Component, OnInit } from '@angular/core';
import { TicketService } from '../Services/ticket.service';
import { IssueService } from '../Services/issue.service';
import { CustomIssuesService } from '../Services/custom-issue.service';
import { SolutionService } from '../Services/solution.service';
import { TicketReadDto, TicketCreateDto, TicketUpdateDto } from '../Models/ticket.model';
import { IssueCreateDto, IssueReadDto, IssueUpdateDto } from '../Models/issue.model';
import { CustomIssueCreateDto, CustomIssueReadDto, CustomIssueUpdateDto } from '../Models/custom-issue.model';
import { SolutionCreateDto, SolutionReadDto, SolutionUpdateDto } from '../Models/solution.model';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service';
import { UserReadDto } from '../Models/user.model';

@Component({
  selector: 'app-support-dashboard',
  templateUrl: './support-dashboard.component.html',
  styleUrls: ['./support-dashboard.component.css'],
})
export class SupportDashboardComponent implements OnInit {
  tickets: TicketReadDto[] = [];
  refundTickets: TicketReadDto[] = [];
  issues: IssueReadDto[] = [];
  solutions: SolutionReadDto[] = [];
  selectedSolutions: SolutionReadDto[] = [];
  customIssues: CustomIssueReadDto[] = [];
  newIssue: IssueCreateDto = { issueCategory: '' };
  newSolution: SolutionCreateDto = { issueId: 0, solution1: '' };
  customSolution: string = '';
  newCustomSolution: string = '';
  successMessage: string = '';
  validationMessage: string = '';
  showPopup: boolean = false;
  fileData: string | null = null; 
  supportProfile: UserReadDto | null = null;
  isSidebarOpen = false;

  constructor(
    private router: Router,
    private ticketService: TicketService,
    private issueService: IssueService,
    private customIssuesService: CustomIssuesService,
    private solutionService: SolutionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchTickets();
    this.fetchIssues();
    this.fetchCustomIssues();
    this.fetchSupportProfile(); 
  }

  fetchSupportProfile(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getUserById(parseInt(userId)).subscribe({
        next: (data) => {
          this.supportProfile = data;
        },
        error: (err) => console.error('Error fetching support profile:', err)
      });
    }
  }

  // Fetch tickets from the API
  fetchTickets(): void {
    this.ticketService.getTickets().subscribe((data) => {
      this.tickets = data;
      this.filterRefundTickets();
    });
  }

  // Filter tickets with issueType "Refund"
  filterRefundTickets(): void {
    this.refundTickets = this.tickets.filter((ticket) => ticket.issueType === 'Refund');
  }

  // Fetch issues from the API
  fetchIssues(): void {
    this.issueService.getAllIssues().subscribe((data) => {
      this.issues = data;
    });
  }

  // Fetch custom issues posted by the user
  fetchCustomIssues(): void {
    this.customIssuesService.getCustomIssues().subscribe((data) => {
      this.customIssues = data;
    });
  }

  // View solutions for a specific issue
  viewSolutions(issueId: number): void {
    this.solutionService.getAllSolutions().subscribe((data) => {
      this.selectedSolutions = data.filter((solution) => solution.issueId === issueId);
    });
  }

  // Update the ticket status
  updateStatus(ticket: TicketReadDto, status: string): void {
    if (ticket.tstatus === status) {
      return; // If status is already the same, do nothing
    }
  
    const updatedTicket: TicketUpdateDto = {
        ...ticket,
        tstatus: status,
        resolvedDate: status === 'Closed' ? new Date().toISOString() : undefined, // Set current date if status is 'Closed'
    };
  
    this.ticketService.updateTicket(updatedTicket).subscribe({
      next: () => {
          ticket.tstatus = status;
          if (status === 'Closed') {
              ticket.resolvedDate = updatedTicket.resolvedDate;
  
              // Send only the ticketId for email
              this.ticketService.sendClosureEmail({ ticketId: ticket.ticketId }).subscribe({
                next: (response) => {
                  console.log('Email response:', response);  // Here, response will be the plain text
                  this.showSuccessMessage('Ticket status updated and email sent successfully!');
                },
                error: (err) => {
                  console.error('Error sending email:', err);
                  this.showSuccessMessage('Ticket updated, but email could not be sent.');
                }
              });
              
            
          } else {
              this.showSuccessMessage(`Ticket status updated to ${status}`);
          }
      },
      error: (error) => {
          console.error('Error updating ticket status:', error);
      }
    });
  }
  

  // Check if button should be disabled based on current status
  isButtonDisabled(ticket: TicketReadDto, status: string): boolean {
    return ticket.tstatus === status;
  }

  // Add Issue and Solution
  // Function to add an issue
addIssue() {
  if (!this.newIssue.issueCategory) {
    this.validationMessage = 'Issue category is required!';
    return;
  }

  // Step 1: Create the issue using IssueCreateDto
  const issueCreateDto: IssueCreateDto = {
    issueCategory: this.newIssue.issueCategory,
  };

  // Step 2: Call the IssueService to create the issue in the backend
  this.issueService.createIssue(issueCreateDto).subscribe({
    next: (issue: IssueReadDto) => {
      // Step 3: The created issue contains an IssueID (automatically generated by the database)
      // Now, we can move to adding the solution
    
    },
    error: (err) => {
      console.error('Error adding issue:', err);
      this.validationMessage = 'Error adding issue!';
    }
  });
}

// Function to add a solution
addSolution() {
  if (!this.newSolution.solution1) {
    this.validationMessage = 'Solution is required!';
    return;
  }

  // Step 4: Use the issueId passed from the previous step for the new solution
  this.issueService.getAllIssues().subscribe({
    next: (issues) => {
      const maxIssueId = Math.max(...issues.map((issue) => issue.issueId));
      
      // Step 4: Use max issueId + 1 for the new solution
      const solutionCreateDto: SolutionCreateDto = {
        issueId: maxIssueId ,  // Assign max issueId + 1
        solution1: this.newSolution.solution1,
      };

      // Step 5: Call the SolutionService to create the solution in the backend
      this.solutionService.createSolution(solutionCreateDto).subscribe({
        next: (solution: SolutionReadDto) => {
          // Step 6: Successfully created the solution, push it to the solutions array
          this.solutions.push(solution);
          this.showSuccessMessage('Issue and Solution added successfully!');
          this.newIssue.issueCategory = '';  // Reset the issue form
          this.newSolution.solution1 = '';  // Reset the solution form
          this.validationMessage = '';  // Clear any validation messages
        },
        error: (err) => {
          console.error('Error adding solution:', err);
          this.validationMessage = 'Error adding solution!';
        }
      });
    },
    error: (err) => {
      console.error('Error fetching all issues to find max issueId:', err);
      this.validationMessage = 'Error fetching issues!';
    }
  });
}


  // Add a solution for a custom issue
  addCustomSolution(customIssue: CustomIssueReadDto): void {
    if (this.newCustomSolution.trim()) {
      const updatedCustomIssue: CustomIssueUpdateDto = {
        customId: customIssue.customId,
        cutomIssue: customIssue.cutomIssue,
        customSolution: this.newCustomSolution, // Add solution to customIssue
        userid: customIssue.userid,
      };

      // Call the API to update the custom issue with the solution
      this.customIssuesService.updateCustomIssue(updatedCustomIssue).subscribe({
        next: () => {
          // After adding the solution, clear the input field
          this.newCustomSolution = '';
          
          // Update the customIssues list to show the new solution
          customIssue.customSolution = this.newCustomSolution;
          
          // Show success message and refresh custom issues
          this.showSuccessMessage('Solution added to the custom issue successfully!');
          this.fetchCustomIssues(); // Refresh custom issues
        },
        error: (error) => console.error('Error adding custom solution:', error),
      });
    } else {
      this.validationMessage = 'Please enter a solution.';
      setTimeout(() => {
        this.validationMessage = '';
      }, 3000);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  // Display a success message
  showSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  // Show the popup with the file
  showFilePopup(file: string): void {
    this.fileData = `data:image/jpeg;base64,${file}`; // Adjust MIME type if necessary
    this.showPopup = true;
  }

  // Close the file popup
  closePopup(): void {
    this.showPopup = false;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
