import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Observable } from 'rxjs'; // Import Observable
import { IssueReadDto, IssueCreateDto, IssueUpdateDto } from '../Models/issue.model'; // Import the necessary DTO models

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private apiUrl = 'http://localhost:5000/api/Issues';  // Base URL for the Issue API

  constructor(private http: HttpClient) {}

  // Get all issues
  getAllIssues(): Observable<IssueReadDto[]> {
    return this.http.get<IssueReadDto[]>(this.apiUrl);
  }

  // Get an issue by its ID
  getIssueById(issueId: string): Observable<IssueReadDto> {
    return this.http.get<IssueReadDto>(`${this.apiUrl}/${issueId}`);
  }

  // Create a new issue
  createIssue(issue: IssueCreateDto): Observable<IssueReadDto> {
    return this.http.post<IssueReadDto>(this.apiUrl, issue);
  }

  // Update an existing issue by its ID
  updateIssue(issueId: string, issue: IssueUpdateDto): Observable<IssueReadDto> {
    return this.http.put<IssueReadDto>(`${this.apiUrl}/${issueId}`, issue);
  }

  // Delete an issue by its ID
  deleteIssue(issueId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${issueId}`);
  }
}
