import { Routes } from '@angular/router';
import { evaluationRoutes } from './evaluation/routing/evaluation.routes';
import {FormationsDashboardComponent} from './formationP/components/pages/formations-dashboard/formations-dashboard';
import {FormationEditorComponent} from './formationP/components/formation-editor-component/formation-editor.component';
import {AuthGuard} from './auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'evaluation/dashboard' },
  {
    path: 'evaluation',
    children: evaluationRoutes
  },

  {
    path: "create_formation",
    component: FormationEditorComponent,//canActivate:[AuthGuard],data:['ROLE_INSTRUCTOR']
  },
  {
    path:"formation-dashboard"
    ,component:FormationsDashboardComponent
  },{
    path: "",redirectTo:'formation-dashboard',pathMatch:'full'
  }
];
