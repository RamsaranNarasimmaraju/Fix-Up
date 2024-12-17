import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TicketReadDto, TicketUpdateDto, TicketCreateDto, ClosureEmailRequest } from '../Models/ticket.model'; // Make sure you import your DTOs


@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:5000/api/Tickets'; // Base API URL

  constructor(private http: HttpClient) {}

  // Accepts FormData for creating tickets with file uploads
  createTicket(ticket: FormData): Observable<TicketReadDto> {
    return this.http.post<TicketReadDto>(this.apiUrl, ticket);
  }

  updateTicket(ticket: TicketUpdateDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${ticket.ticketId}`, ticket);
  }

  getTickets(): Observable<TicketReadDto[]> {
    return this.http.get<TicketReadDto[]>(this.apiUrl);
  }

  deleteTicket(ticketId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${ticketId}`);
  }
  sendClosureEmail(request: ClosureEmailRequest): Observable<void> {
    console.log('Sending closure email with request:', request); // Debug log
  
    // Setting response type to 'text' because the server is returning plain text
    return this.http.post<void>(`${this.apiUrl}/sendClosureEmail`, request, { 
      responseType: 'text' as 'json'  // Handle plain text response
    }).pipe(
      catchError((error) => {
        console.error('Error sending email:', error);
        return throwError(error);
      })
    );
  }
  
}
