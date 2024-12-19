import { Component, OnInit } from '@angular/core';
import { TicketService } from '../Services/ticket.service';
import { TicketReadDto } from '../Models/ticket.model';
import { FeedbackService } from '../Services/feedback.service'; // Import Feedback Service
import { Router } from '@angular/router';
import { FeedbackCreateDto } from '../Models/feedback.model'; // Import Feedback DTO

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent {
  tickets: TicketReadDto[] = [];
  userId: number = 0;
  errorMessage: string = '';
  feedbackModel: FeedbackCreateDto = {
    ticketId: 0,
    rating: 0,
    comments: '',
    submitteddate: new Date()
  };

  feedbackSubmittedTickets: Set<number> = new Set(); // Tracks submitted ticket IDs
  showFeedbackModal: boolean = false;  // Flag for feedback modal
  selectedTicketId: number = 0;        // Current ticket for feedback

  constructor(
    private ticketService: TicketService,
    private feedbackService: FeedbackService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = Number(storedUserId);
      this.getTicketsForUser();
    } else {
      this.errorMessage = 'User not found. Please log in.';
    }
  }

  validateComments() {
    const comments = this.feedbackModel.comments;
    const errors: { [key: string]: boolean } = {};

    // If comments are provided, check for validation
    if (comments) {
      // Check for numbers
      if (/\d/.test(comments)) {
        errors['containsNumbers'] = true;
      }

      // Check for special characters
      const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/g;
      if (specialCharPattern.test(comments)) {
        errors['containsSpecialChars'] = true;
      }
    }

    // Set errors or clear them based on validation
    return Object.keys(errors).length ? errors : null;
  }

  getTicketsForUser(): void {
    this.ticketService.getTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets.filter(ticket => ticket.userId === this.userId);
        if (this.tickets.length === 0) {
          this.errorMessage = 'No tickets found for this user.';
        }
  
        // Populate feedbackSubmittedTickets based on local storage or another logic
        this.tickets.forEach(ticket => {
          if (this.feedbackSubmittedTickets.has(ticket.ticketId)) {
            ticket['feedbackSubmitted'] = true; // Dynamically add the property
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Error retrieving tickets.';
        console.error('Error fetching tickets:', err);
      }
    });
  }
  
  
  
  openFeedbackModal(ticketId: number): void {
    if (this.feedbackSubmittedTickets.has(ticketId)) {
      console.log(`Feedback already submitted for ticket ID: ${ticketId}`);
      return; // Prevent reopening modal
    }
    this.selectedTicketId = ticketId;
    this.showFeedbackModal = true; // Open modal
  }

  submitFeedback(): void {
    if (this.feedbackModel.rating > 0) {
      this.feedbackModel.ticketId = this.selectedTicketId;

      this.feedbackService.createFeedback(this.feedbackModel).subscribe({
        next: (response) => {
          this.feedbackSubmittedTickets.add(this.selectedTicketId); // Disable button
          this.showFeedbackModal = false; // Close modal

          // Clear feedback form
          this.feedbackModel = {
            ticketId: 0,
            rating: 0,
            comments: '',
            submitteddate: new Date()
          };
        },
        error: (error) => {
          console.error('Error submitting feedback:', error);
          this.errorMessage = 'Failed to submit feedback.';
        }
      });
    } else {
      this.errorMessage = 'Please provide a rating.';
    }
  }

  closeFeedbackModal(): void {
    this.showFeedbackModal = false; // Close modal
  }
}
