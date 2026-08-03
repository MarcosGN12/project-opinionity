import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  LUCIDE_ICONS,
  LucideIconProvider,
  UserPlus,
  Eye,
  EyeOff,
  ChevronDown,
} from 'lucide-angular';
import { RegisterData } from '../register';

@Component({
  selector: 'register-component-form',
  standalone: true,
  imports: [
    LucideAngularModule, // <-- Aquí va solo el módulo sin .pick()
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ UserPlus, Eye, EyeOff, ChevronDown }),
    },
  ],
  templateUrl: './register-component-form.html',
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
    console.log('Datos que salen del formulario hijo:', this.registerForm.value);
    this.register.emit(this.registerForm.value);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
