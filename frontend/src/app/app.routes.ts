import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';
import { Feed } from './pages/feed/feed';
import { Profile } from './pages/profile/profile';

export const routes: Routes = [
  {
    path: '',
    component: Feed,
    canActivate: [authGuard],
  },

  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
  },

  {
    path: 'login',
    component: Login,
  },

  {
    path: 'register',
    component: Register,
  },
];
