import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';

import { EvaluationSubmitDialogComponent } from '../../components/evaluation-submit-dialog.component';
import { Evaluation, EvaluationQuestion } from '../../models/evaluation.models';
import { EvaluationService } from '../../services/evaluation.service';

@Component({
  selector: 'app-evaluation-take',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatRadioModule,
    ReactiveFormsModule
  ],
  templateUrl: './evaluation-take.component.html',
  standalone: true,
  styleUrl: './evaluation-take.component.scss'
})
export class EvaluationTakeComponent implements OnInit, OnDestroy {
  evaluation: Evaluation | null = null;
  evaluationId = 0;
  questions: EvaluationQuestion[] = [];
  activeIndex = 0;
  remainingSeconds = 0;
  private timerId: number | null = null;
  answerControl = new FormControl<string | boolean | null>(null);
  answers: Record<number, string | boolean> = {};

  constructor(
    private evaluationService: EvaluationService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.evaluationId = id;

    this.evaluationService.getEvaluationById(id).subscribe((evaluation) => {
      if (!evaluation) {
        this.router.navigate(['/evaluation/dashboard']);
        return;
      }
      this.evaluation = evaluation;
      this.remainingSeconds = evaluation.durationMinutes * 60;
      this.startTimer();
    });

    this.evaluationService.getQuestions(id).subscribe((questions) => {
      this.questions = questions;
      this.loadAnswer();
    });

    this.evaluationService.getAttempt(id).subscribe((attempt) => {
      if (attempt) {
        this.answers = { ...attempt.answers } as Record<number, string | boolean>;
        this.loadAnswer();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      window.clearInterval(this.timerId);
    }
  }

  get activeQuestion(): EvaluationQuestion | null {
    return this.questions[this.activeIndex] ?? null;
  }

  get progressValue(): number {
    if (!this.questions.length) {
      return 0;
    }
    return Math.round(((this.activeIndex + 1) / this.questions.length) * 100);
  }

  get answeredCount(): number {
    return Object.keys(this.answers).length;
  }

  goToQuestion(index: number): void {
    this.activeIndex = index;
    this.loadAnswer();
  }

  nextQuestion(): void {
    if (this.activeIndex < this.questions.length - 1) {
      this.activeIndex += 1;
      this.loadAnswer();
    }
  }

  previousQuestion(): void {
    if (this.activeIndex > 0) {
      this.activeIndex -= 1;
      this.loadAnswer();
    }
  }

  saveAnswer(): void {
    const question = this.activeQuestion;
    if (!question || this.answerControl.value === null || this.answerControl.value === undefined) {
      return;
    }

    this.answers[question.id] = this.answerControl.value;
    this.evaluationService.saveAnswer(this.evaluationId, question.id, this.answerControl.value).subscribe();
  }

  openSubmitDialog(): void {
    const dialogRef = this.dialog.open(EvaluationSubmitDialogComponent, {
      width: '420px'
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.submitEvaluation();
      }
    });
  }

  submitEvaluation(): void {
    const evaluationId = this.evaluation?.id ?? 0;
    this.evaluationService.submitEvaluation(evaluationId).subscribe(() => {
      this.router.navigate(['/evaluation/results', evaluationId]);
    });
  }

  formatTimer(): string {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private startTimer(): void {
    if (this.timerId) {
      window.clearInterval(this.timerId);
    }

    this.timerId = window.setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds -= 1;
      } else {
        window.clearInterval(this.timerId!);
        this.submitEvaluation();
      }
    }, 1000);
  }

  private loadAnswer(): void {
    const question = this.activeQuestion;
    if (!question) {
      return;
    }

    const saved = this.answers[question.id];
    this.answerControl.setValue(saved ?? null, { emitEvent: false });
  }
}
