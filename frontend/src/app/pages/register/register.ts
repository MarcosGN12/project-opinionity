import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { registerComponentForm } from './components/register-component-form';

export interface RegisterData {
  email: string;
  password: string;
  gender: string;
  username: string;
  displayname: string;
  location: string;
}

@Component({
  standalone: true,
  selector: 'register',
  imports: [LucideAngularModule, registerComponentForm],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  onRegister(data: any) {
    this.authService.register(data).subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
      },
      error: (error) => {
        alert(error.error?.message || error.statusText);
      },
    });
  }
}
