import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',  // Ruta vacía porque ya viene desde /users
    loadComponent: () => import('./list/list.component').then(m => m.ListComponent),
    title: 'Lista de Usuarios'  // Título de la pestaña del navegador
  },
  {
    path: 'create',
    loadComponent: () => import('./create/create.component').then(m => m.CreateComponent),
    title: 'Crear Usuario'
  },
  {
    path: 'edit/:id',  // :id es un parámetro dinámico
    loadComponent: () => import('./edit/edit.component').then(m => m.EditComponent),
    title: 'Editar Usuario'
  }
]