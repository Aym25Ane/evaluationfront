import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { QuestionReview } from '../models/evaluation.models';

@Component({
  selector: 'app-evaluation-question-review',
  imports: [MatIconModule],
  templateUrl: './evaluation-question-review.component.html',
  styleUrl: './evaluation-question-review.component.scss'
})
export class EvaluationQuestionReviewComponent {
  @Input({ required: true }) review!: QuestionReview;

  formatAnswer(answer: string | boolean | null): string {
    if (answer === null) {
      return 'No response';
    }

    if (typeof answer === 'boolean') {
      return answer ? 'True' : 'False';
    }

    return answer;
  }
}
