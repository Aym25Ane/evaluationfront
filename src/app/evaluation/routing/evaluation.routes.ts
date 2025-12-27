import { Routes } from '@angular/router';

import { evaluationGuard } from '../guards/evaluation.guard';
import { EvaluationCreateComponent } from '../pages/create/evaluation-create.component';
import { EvaluationDashboardComponent } from '../pages/dashboard/evaluation-dashboard.component';
import { EvaluationResultsComponent } from '../pages/results/evaluation-results.component';
import { EvaluationTakeComponent } from '../pages/take/evaluation-take.component';

export const evaluationRoutes: Routes = [
  { path: 'dashboard', component: EvaluationDashboardComponent },
  { path: 'create', component: EvaluationCreateComponent, canActivate: [evaluationGuard] },
  { path: 'take/:id', component: EvaluationTakeComponent },
  { path: 'results/:id', component: EvaluationResultsComponent }
];
