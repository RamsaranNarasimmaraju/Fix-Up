import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoleReadDto,RoleCreateDto,RoleUpdateDto } from '../Models/role.model'; // Ensure RoleCreateDto, RoleUpdateDto are imported

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://localhost:5000/api/Roles';  // API URL for roles

  constructor(private http: HttpClient) {}

  // **Fetch All Roles**
  fetchRoles(): Observable<RoleReadDto[]> {
    return this.http.get<RoleReadDto[]>(this.apiUrl);
  }

  // **Fetch Role by ID**
  fetchRoleById(roleId: number): Observable<RoleReadDto> {
    return this.http.get<RoleReadDto>(`${this.apiUrl}/${roleId}`);
  }

  // **Create Role**
  createRole(role: RoleCreateDto): Observable<RoleReadDto> {
    return this.http.post<RoleReadDto>(this.apiUrl, role);
  }

  // **Update Role**
  updateRole(role: RoleUpdateDto): Observable<RoleReadDto> {
    return this.http.put<RoleReadDto>(`${this.apiUrl}/${role.roleId}`, role);
  }

  // **Delete Role**
  deleteRole(roleId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${roleId}`);
  }
}
