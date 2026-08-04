import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'profile',
  imports: [DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private authService = inject(AuthService);

  user = this.authService.currentUser;

  ngOnInit(): void {
    if (!this.user()) {
      this.authService.getProfile().subscribe({
        error: (err) => {
          console.error('Error al recuperar perfil:', err);
          if (err.status === 401) {
            this.authService.logout();
          }
        },
      });
    }
  }
}
