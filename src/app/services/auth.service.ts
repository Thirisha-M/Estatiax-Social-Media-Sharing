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
    return !!localStorage.getItem('userId'); // ✅ Fix: Only check userId
  }

  login(user: any): void {
    localStorage.setItem('userId', user._id);
    localStorage.setItem('userEmail', user.data.email);
    this.isLoggedInSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  getUser(): any {
    return localStorage.getItem('userId') ? JSON.parse(localStorage.getItem('userEmail') || '{}') : null;
  }

  isAuthenticated(): boolean {
    return this.hasUser();
  }
}
