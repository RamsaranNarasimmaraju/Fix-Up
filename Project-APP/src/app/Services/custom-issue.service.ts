import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomIssueReadDto,CustomIssueCreateDto,CustomIssueUpdateDto } from '../Models/custom-issue.model'; 


@Injectable({
  providedIn: 'root',
})
export class CustomIssuesService {
  private apiUrl = 'http://localhost:5000/api/CustomIssues';

  constructor(private http: HttpClient) {}

  /**
   * Get all custom issues
   * @returns Observable of CustomIssueReadDto array
   */
  getCustomIssues(): Observable<CustomIssueReadDto[]> {
    return this.http.get<CustomIssueReadDto[]>(this.apiUrl);
  }

  /**
   * Get a custom issue by its ID
   * @param customId ID of the custom issue
   * @returns Observable of CustomIssueReadDto
   */
  getCustomIssuesByUserId(userId: number): Observable<CustomIssueReadDto[]> {
    // Correct API endpoint format
    return this.http.get<CustomIssueReadDto[]>(`${this.apiUrl}/${userId}`);
  }
  /**
   * Create a new custom issue
   * @param customIssue Data for creating a new custom issue
   * @returns Observable of CustomIssueReadDto
   */
  createCustomIssue(customIssue: CustomIssueCreateDto): Observable<CustomIssueReadDto> {
    return this.http.post<CustomIssueReadDto>(this.apiUrl, customIssue);
  }

  /**
   * Update an existing custom issue
   * @param customIssue Data for updating the custom issue
   * @returns Observable of void
   */
  updateCustomIssue(customIssue: CustomIssueUpdateDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${customIssue.customId}`, customIssue);
  }

  /**
   * Delete a custom issue by its ID
   * @param customId ID of the custom issue to delete
   * @returns Observable of void
   */
  deleteCustomIssue(customId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${customId}`);
  }
}
