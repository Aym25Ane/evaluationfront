import { Routes } from '@angular/router';
import { evaluationRoutes } from './evaluation/routing/evaluation.routes';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'evaluation/dashboard' },
  {
    path: 'evaluation',
    children: evaluationRoutes
  },
  { path: '**', redirectTo: 'evaluation/dashboard' }
];
