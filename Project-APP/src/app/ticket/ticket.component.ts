import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../Services/ticket.service'; // Adjust the path as needed
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent {
  ticketForm!: FormGroup;
  selectedFile?: File | null = null;
  errorMessage = '';
  successMessage = ''; // To hold success message
  issueTypes: string[] = ['Server', 'Product', 'Payment', 'Refund']; // Example issue types
  isRefund = false; // Default to false, only 'Refund' should trigger file input
  userId: number = 0;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router // Inject the Router
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    console.log('User ID retrieved from localStorage:', userId);
    
    if (userId) {
      this.userId = Number(userId); // Ensure it's parsed correctly to a number
    } else {
      console.error('User ID not found in localStorage');
    }

    // Initialize form
    this.initForm();
  }

  initForm(): void {
    this.ticketForm = this.fb.group({
      issueType: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      fileUpload: ['']
    });
  }

  // Watch for changes in the issueType dropdown to trigger file upload visibility
  onIssueTypeChange(): void {
    this.isRefund = this.ticketForm.get('issueType')?.value === 'Refund';
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('File selected:', this.selectedFile); // Debugging log
    }
  }

  submitTicket(): void {
    // Check if form is invalid
    if (this.ticketForm.invalid) {
      return;  // Don't submit if form is invalid
    }

    // Create a new instance of FormData
    const formData = new FormData();

    // Append the form values (issueType, description, createdDate, userId) to FormData
    formData.append('issueType', this.ticketForm.get('issueType')?.value);
    formData.append('description', this.ticketForm.get('description')?.value);
    formData.append('createdDate', new Date().toISOString()); // Append current date as createdDate
    
    // Retrieve the userId from localStorage
    const userId = localStorage.getItem('userId');
    
    // Check if userId is available and append to FormData
    if (userId) {
      formData.append('userId', userId);  // Append userId from localStorage
    } else {
      console.error('User ID is not available in localStorage');
      this.errorMessage = 'User ID is not available. Please log in.';
      return;  // Exit if userId is not found
    }
  
    // If a file is selected, append it to FormData
    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);  // Append file
      console.log('File appended to FormData:', this.selectedFile.name); // Debugging log
    } else {
      console.error('No file selected');  // Debugging log for missing file
    }
  
    // Log FormData content to verify everything is correct
    formData.forEach((value, key) => {
      console.log(key + ': ' + value);  // Log form data entries
    });
  
    // Now, submit the form data using the service
    this.ticketService.createTicket(formData).subscribe({
      next: (response) => {
        console.log('Ticket created:', response);
        
        // Show success message
        this.successMessage = 'Ticket successfully submitted!';

        // Reset the form and selected file
        this.ticketForm.reset();
        this.selectedFile = undefined;

        // Redirect to the Tstatus page after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/Status']); // Adjust the path if needed
        }, 2000); // 2 seconds delay
      },
      error: (error) => {
        console.error('Error creating ticket:', error);
        this.errorMessage = 'Failed to create the ticket.';
      }
    });
  }
}
