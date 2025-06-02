import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
  } from '@angular/router';
  import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {
  constructor( private http: HttpClient, private router: Router) {}

  private apiUrl = 'http://localhost:3000';

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this.http.get(this.apiUrl+'/api/protected',  { withCredentials: true }).subscribe({
        next: () => resolve(true), // User is authenticated
        error: () => {
          this.router.navigate(['/login']); // Redirect to login page
          resolve(false);
        },
      });
    });
  }

}