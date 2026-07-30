import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { LoginComponentForm } from './components/login-component-form';

export interface LoginData {
  email: string;
  password: string;
}

@Component({
  standalone: true,
  selector: 'login',
  imports: [LucideAngularModule, LoginComponentForm],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  onLogin(data: any) {
    this.authService.login(data).subscribe({
      next: (response) => {
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('userId', response.userId);

          this.router.navigateByUrl('/');
        } else {
          alert(response.message);
        }
      },
      error: (error) => {
        alert(error.error?.message || error.statusText);
      },
    });
  }
}
