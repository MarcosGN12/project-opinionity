import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';
import { Feed } from './pages/feed/feed';

export const routes: Routes = [
  {
    path: 'feed',
    component: Feed,
    canActivate: [authGuard],
  },

  {
    path: 'login',
    component: Login,
  },
];
