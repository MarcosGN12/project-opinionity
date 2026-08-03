import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private AuthService = inject(AuthService);

  user = this.AuthService.currentUser;

  ngOnInit() {
    if (!this.user()) {
      this.AuthService.getProfile().subscribe();
    }
  }
}
