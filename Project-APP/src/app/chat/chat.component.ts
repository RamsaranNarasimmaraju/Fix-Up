import { Component, OnInit } from '@angular/core';
import { IssueService } from '../Services/issue.service';
import { SolutionService } from '../Services/solution.service';
import { CustomIssuesService } from '../Services/custom-issue.service';
import { IssueReadDto } from '../Models/issue.model';
import { SolutionReadDto } from '../Models/solution.model';
import { CustomIssueCreateDto } from '../Models/custom-issue.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  issues: IssueReadDto[] = [];
  solutions: SolutionReadDto[] = [];
  currentIssue: IssueReadDto | null = null;
  currentSolution: SolutionReadDto | null = null;
  showChat = false;
  showCustomIssueForm = false;
  userMessage: string = '';
  thankYouMessage = false;
  customIssueError: boolean = false;  // Track if error message should be shown

  constructor(
    private issueService: IssueService,
    private solutionService: SolutionService,
    private customIssuesService: CustomIssuesService
  ) {}

  ngOnInit(): void {}

  startChat(): void {
    this.issueService.getAllIssues().subscribe(issues => {
      this.issues = issues;
      this.showChat = true;
    });
  }

  selectIssue(issueId: number): void {
    this.issueService.getIssueById(issueId.toString()).subscribe(issue => {
      this.currentIssue = issue;
      this.solutionService.getAllSolutions().subscribe(solutions => {
        this.solutions = solutions.filter(solution => solution.issueId === issueId);
      });
    });
  }

  selectSolution(solutionId: number): void {
    this.solutionService.getSolutionById(solutionId).subscribe(solution => {
      this.currentSolution = solution;
    });
  }

  onAnswerReceived(isAnswer: boolean): void {
    if (isAnswer) {
      this.thankYouMessage = true;
      this.currentSolution = null;
      this.showChat = false;
    } else {
      this.showCustomIssueForm = true;
    }
  }

  submitCustomIssue(): void {
    // Show error if input is less than 15 characters
    if (this.userMessage.trim().length < 15) {
      this.customIssueError = true;
      return;  // Prevent form submission
    }

    // Hide error when input is valid
    this.customIssueError = false;

    // Submit the custom issue if valid
    if (this.userMessage.trim()) {
      const userId = localStorage.getItem('userId');
  
      if (userId) {
        const cutomIssue: CustomIssueCreateDto = {
          cutomIssue: this.userMessage,
          userid: +userId  // Convert userId to number
        };
  
        this.customIssuesService.createCustomIssue(cutomIssue).subscribe(() => {
          this.thankYouMessage = true;
          this.showCustomIssueForm = false;
          this.userMessage = '';
        });
      } else {
        console.error("User ID not found in local storage.");
      }
    }
  }

  resetChat(): void {
    this.showChat = false;
    this.showCustomIssueForm = false;
    this.thankYouMessage = false;
    this.currentIssue = null;
    this.currentSolution = null;
    this.userMessage = '';
  }

  goBackToIssues(): void {
    this.currentIssue = null;
    this.currentSolution = null;
    this.showCustomIssueForm = false;
    this.showChat = true;
  }

  goBackToSolutions(): void {
    this.currentSolution = null;
  }
}
