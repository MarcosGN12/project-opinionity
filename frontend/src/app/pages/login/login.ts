import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginComponentForm } from './components/login-component-form';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../services/auth-service';

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
    this.authService.login(data);
  }
}
