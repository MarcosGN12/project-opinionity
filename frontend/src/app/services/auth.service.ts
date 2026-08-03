import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RegisterData } from '../pages/register/register';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface LoginData {
  email: string;
  password: string;
}

export interface UserProfile {
  id: number;
  username: string;
  displayName: string;
  description: string;
  gender: string;
  location: string;
  followers: number;
  following: number;
  likes: number;
  visits: number;
  comments: number;
  posts_number: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  router = inject(Router);

  currentUser = signal<UserProfile | null>(null);

  login(item: LoginData) {
    return this.http.post<any>('http://localhost:3000/auth/login', item);
  }

  register(item: RegisterData) {
    return this.http.post('http://localhost:3000/auth/register', item);
  }

  getProfile() {
    return this.http
      .get<UserProfile>('http://localhost:3000/users/me')
      .pipe(tap((user) => this.currentUser.set(user)));
  }
}
