import { Component, EventEmitter, inject, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, ɵROUTER_PROVIDERS } from '@angular/router';
import { RegisterData } from '../register';

@Component({
  selector: 'register-component-form',
  standalone: true,
  imports: [LucideAngularModule, ReactiveFormsModule],
  templateUrl: './register-component-form.html',
  providers: [ɵROUTER_PROVIDERS],
})
export class registerComponentForm {
  router = inject(Router);

  @Output()
  register = new EventEmitter<RegisterData>();

  registerForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    gender: new FormControl(''),
    username: new FormControl(''),
    displayName: new FormControl(''),
    location: new FormControl(''),
    birthDate: new FormControl(''),
  });

  showPassword: boolean = false;

  onregister() {
    this.register.emit(this.registerForm.value);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
