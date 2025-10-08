// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.routes').then(m => m.routes)
  },
  {
    path: '**',
    redirectTo: 'users'
  }
];
