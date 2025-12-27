import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { EvaluationQuestionReviewComponent } from '../../components/evaluation-question-review.component';
import { Evaluation, EvaluationResult } from '../../models/evaluation.models';
import { EvaluationService } from '../../services/evaluation.service';

@Component({
  selector: 'app-evaluation-results',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    RouterLink,
    EvaluationQuestionReviewComponent
  ],
  templateUrl: './evaluation-results.component.html',
  styleUrl: './evaluation-results.component.scss'
})
export class EvaluationResultsComponent implements OnInit {
  evaluation: Evaluation | null = null;
  result: EvaluationResult | null = null;
  readonly circleCircumference = 2 * Math.PI * 54;

  constructor(
    private evaluationService: EvaluationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.evaluationService.getEvaluationById(id).subscribe((evaluation) => {
      if (!evaluation) {
        this.router.navigate(['/evaluation/dashboard']);
        return;
      }
      this.evaluation = evaluation;
    });

    this.evaluationService.getResult(id).subscribe((result) => {
      this.result = result;
    });
  }

  get passLabel(): string {
    if (!this.result) {
      return '';
    }
    return this.result.passed ? 'Pass' : 'Needs Review';
  }

  get passTone(): string {
    if (!this.result) {
      return 'badge-neutral';
    }
    return this.result.passed ? 'badge-success' : 'badge-warning';
  }

  get chartOffset(): number {
    if (!this.result) {
      return 0;
    }
    return this.circleCircumference - (this.result.score / 100) * this.circleCircumference;
  }
}
