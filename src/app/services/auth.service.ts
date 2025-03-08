import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasUser());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private router: Router) {}

  private hasUser(): boolean {
    return !!localStorage.getItem('userId'); // Check user session
  }

  login(user: any): void {
    localStorage.setItem('userId', user._id);
    localStorage.setItem('userEmail', user.data.email);
    localStorage.setItem('user', JSON.stringify(user));
    this.isLoggedInSubject.next(true);
  }

  logout(): void {
    localStorage.clear(); // Clear all data
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return this.hasUser();
  }
}
