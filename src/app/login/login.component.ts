import { Component , OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  credentials = { username: '', password: '' };
  errorMessage = '';

  private apiUrl = 'http://localhost:3000';

    constructor(
      private http: HttpClient, 
      private router: Router,
      private eventService : EventService
    ) {}

    ngOnInit(): void {
      this.eventService.checkAuth().subscribe(
        () => {
          // User is authenticated, redirect to events page
          this.router.navigate(['/events']);
        },
        () => {
          // User is not authenticated, stay on the login page
          console.log('User not authenticated, proceed to login');
        }
      );
    }
  
    login() {
      this.http.post(this.apiUrl+'/api/login', this.credentials,{ withCredentials: true }).subscribe({
        next: (response: any) => {
          this.router.navigate(['/events']); // Redirect to events page
        },
        error: (error) => {
          this.errorMessage = error.error.error || 'Login failed';
        },
      });
    }
}
