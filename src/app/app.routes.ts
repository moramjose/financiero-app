import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/products/pages/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'add',
    loadComponent: () => import('./features/products/pages/product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./features/products/pages/product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

