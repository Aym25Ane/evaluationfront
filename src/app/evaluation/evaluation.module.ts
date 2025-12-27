import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { evaluationRoutes } from './routing/evaluation.routes';

@NgModule({
  imports: [RouterModule.forChild(evaluationRoutes)]
})
export class EvaluationModule {}
