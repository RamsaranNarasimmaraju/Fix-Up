import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserReadDto,UserCreateDto,UserUpdateDto } from '../Models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'http://localhost:5000/api/Users'; // Base URL for Users API

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserReadDto[]> {
    return this.http.get<UserReadDto[]>(this.apiUrl);
  }

  createUser(user: UserCreateDto): Observable<UserReadDto> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<UserReadDto>(this.apiUrl, user, { headers });
  }

  // Fetch a user by ID
  getUserById(userId: number): Observable<UserReadDto> {
    return this.http.get<UserReadDto>(`${this.apiUrl}/${userId}`);
  }

  // Update an existing user
  updateUser(userId: number, user: UserUpdateDto): Observable<UserReadDto> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<UserReadDto>(`${this.apiUrl}/${userId}`, user, { headers });
  }

  // Delete a user by ID
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
  // In user.service.ts
getUserByUsername(userName: string): Observable<UserReadDto | null> {
  return this.http.get<UserReadDto | null>(`${this.apiUrl}/username/${userName}`);
}

}
