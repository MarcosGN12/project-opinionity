import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  LUCIDE_ICONS,
  LucideIconProvider,
  LogIn,
  Eye,
  EyeOff,
} from 'lucide-angular';
import { LoginData } from '../login';

@Component({
  selector: 'login-component-form',
  standalone: true,
  imports: [LucideAngularModule, ReactiveFormsModule, RouterLink],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ LogIn, Eye, EyeOff }),
    },
  ],
  templateUrl: './login-component-form.html',
})
export class LoginComponentForm {
  @Output() login = new EventEmitter<LoginData>();

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  showPassword: boolean = false;

  onLogin() {
    this.login.emit(this.loginForm.value);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
