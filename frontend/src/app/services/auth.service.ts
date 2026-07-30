import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterData } from '../pages/register/register';
import { Router } from '@angular/router';

export interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);

  login(item: LoginData) {
    return this.http.post<any>('http://localhost:3000/auth/login', item);
  }

  register(item: RegisterData) {
    return this.http.post('http://localhost:3000/auth/register', item);
  }
}
