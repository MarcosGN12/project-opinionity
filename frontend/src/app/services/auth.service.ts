import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RegisterData } from '../pages/register/register';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface LoginData {
  email: string;
  password: string;
}

export interface ProfileData {
  username: string;
  displayName: string;
  description?: string;
  gender?: string;
  location?: string;
  followers?: number;
  following?: number;
  likes?: number;
  visits?: number;
  comments?: number;
  posts_number?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  createdAt: string | Date;
  profile?: ProfileData;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  router = inject(Router);

  currentUser = signal<UserProfile | null>(null);

  login(item: LoginData) {
    return this.http
      .post<{ access_token: string; userId: string; message?: string }>(
        'http://localhost:3000/auth/login',
        item,
      )
      .pipe(
        tap((res) => {
          if (res.access_token) {
            localStorage.setItem('access_token', res.access_token);
            localStorage.setItem('userId', res.userId);
          }
        }),
      );
  }

  register(item: RegisterData) {
    return this.http.post('http://localhost:3000/auth/register', item);
  }

  getProfile() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<UserProfile>('http://localhost:3000/users/me', { headers })
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userId');
    this.currentUser.set(null);
    this.router.navigateByUrl('/login');
  }
}
