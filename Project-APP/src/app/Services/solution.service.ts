import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SolutionCreateDto, SolutionReadDto, SolutionUpdateDto } from '../Models/solution.model'; // Ensure to import your DTOs

@Injectable({
  providedIn: 'root'
})
export class SolutionService {

  private apiUrl = 'http://localhost:5000/api/Solutions';  // Base URL for the Solutions API

  constructor(private http: HttpClient) {}

  // Get all solutions
  getAllSolutions(): Observable<SolutionReadDto[]> {
    return this.http.get<SolutionReadDto[]>(this.apiUrl);
  }

  // Get a solution by its ID
  getSolutionById(solutionId: number): Observable<SolutionReadDto> {
    return this.http.get<SolutionReadDto>(`${this.apiUrl}/${solutionId}`);
  }

  // Create a new solution
  createSolution(solution: SolutionCreateDto): Observable<SolutionReadDto> {
    return this.http.post<SolutionReadDto>(this.apiUrl, solution);
  }

  // Update an existing solution by its ID
  updateSolution(solutionId: number, solution: SolutionUpdateDto): Observable<SolutionReadDto> {
    return this.http.put<SolutionReadDto>(`${this.apiUrl}/${solutionId}`, solution);
  }

  // Delete a solution by its ID
  deleteSolution(solutionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${solutionId}`);
  }
}

