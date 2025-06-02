import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  
  private apiUrl = 'http://localhost:3000'
  private eventsApiUrl = 'http://localhost:3000/api/events'; // API Base URL
  
  constructor(
    private http: HttpClient
  ) { }

  // Check if the user is authenticated
  checkAuth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/protected`, { withCredentials: true });
  }

  // Logout function to destroy the session
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/logout`, {}, { withCredentials: true });
  }

  // Get all events
  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.eventsApiUrl);
  }

  // Get an event by ID
  getEvent(id: number): Observable<any> {
    return this.http.get<any>(`${this.eventsApiUrl}/${id}`);
  }

  // Add a new event
  addEvent(event: any): Observable<any> {
    return this.http.post<any>(this.eventsApiUrl, event);
  }

  // Update an event
  updateEvent(event: any): Observable<any> {
    return this.http.put<any>(`${this.eventsApiUrl}/${event.id}`, event);
  }

  // Delete an event
  deleteEvent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.eventsApiUrl}/${id}`);
  }
}
