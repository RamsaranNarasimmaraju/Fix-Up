import { Injectable } from '@angular/core';
import { AuthenticatedResponse } from '../Models/authenticated-response.model';


  @Injectable({
    providedIn: 'root'
  })
  export class AuthService {
    private authenticatedResponse: AuthenticatedResponse | null = null;
  
    constructor() {
      // Load from localStorage if it's already saved there
      const response = localStorage.getItem('authenticatedResponse');
      if (response) {
        this.authenticatedResponse = JSON.parse(response);
      }
    }
  
    // Save the AuthenticatedResponse when the user logs in
    setAuthenticatedResponse(response: AuthenticatedResponse): void {
      this.authenticatedResponse = response;
      localStorage.setItem('authenticatedResponse', JSON.stringify(response));
    }
  
    // Get the AuthenticatedResponse (userId, token, role)
    getAuthenticatedResponse(): AuthenticatedResponse | null {
      return this.authenticatedResponse;
    }
  
    // Get the userId directly
    getUserId(): number {
      return this.authenticatedResponse ? this.authenticatedResponse.userId : 0; // Return 0 if not authenticated
    }
  
    // Clear the AuthenticatedResponse during logout
    clearAuthenticatedResponse(): void {
      this.authenticatedResponse = null;
      localStorage.removeItem('authenticatedResponse');
    }
  }
  