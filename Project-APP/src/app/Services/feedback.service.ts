import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeedbackCreateDto, FeedbackReadDto } from '../Models/feedback.model';  // Make sure to import the DTOs

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:5000/api/Feedbacks';  // Base URL for the Feedbacks API

  constructor(private http: HttpClient) {}

  // Get all feedbacks
  getAllFeedbacks(): Observable<FeedbackReadDto[]> {
    return this.http.get<FeedbackReadDto[]>(this.apiUrl);
  }

  // Get a feedback by its ID
  getFeedbackById(feedbackId: number): Observable<FeedbackReadDto> {
    return this.http.get<FeedbackReadDto>(`${this.apiUrl}/${feedbackId}`);
  }

  // Create a new feedback
  createFeedback(feedback: FeedbackCreateDto): Observable<FeedbackReadDto> {
    return this.http.post<FeedbackReadDto>(this.apiUrl, feedback);
  }
}
