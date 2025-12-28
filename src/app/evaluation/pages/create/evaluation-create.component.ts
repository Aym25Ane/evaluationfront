import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';

import { EvaluationService } from '../../services/evaluation.service';
import { Evaluation, QuestionType } from '../../models/evaluation.models';

@Component({
  selector: 'app-evaluation-create',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatStepperModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './evaluation-create.component.html',
  standalone: true,
  styleUrl: './evaluation-create.component.scss'
})
export class EvaluationCreateComponent {
  evaluationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private evaluationService: EvaluationService,
    private router: Router
  ) {
    this.evaluationForm = this.fb.group({
      details: this.fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        course: ['', Validators.required]
      }),
      settings: this.fb.group({
        type: ['Quiz', Validators.required],
        durationMinutes: [30, [Validators.required, Validators.min(5)]],
        passingScore: [70, [Validators.required, Validators.min(0), Validators.max(100)]]
      }),
      questions: this.fb.array<FormGroup>([])
    });
    this.addQuestion();
  }

  get detailsGroup(): FormGroup {
    return this.evaluationForm.get('details') as FormGroup;
  }

  get settingsGroup(): FormGroup {
    return this.evaluationForm.get('settings') as FormGroup;
  }

  get questions(): FormArray<FormGroup> {
    return this.evaluationForm.get('questions') as FormArray<FormGroup>;
  }

  addQuestion(): void {
    this.questions.push(this.createQuestionGroup());
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  addOption(questionIndex: number): void {
    const options = this.getOptionsArray(questionIndex);
    options.push(this.fb.control('', Validators.required));
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    const options = this.getOptionsArray(questionIndex);
    options.removeAt(optionIndex);
  }

  onQuestionTypeChange(questionIndex: number): void {
    const questionGroup = this.questions.at(questionIndex);
    const type = questionGroup.get('type')?.value as QuestionType;
    const options = this.getOptionsArray(questionIndex);

    if (type !== 'MCQ') {
      options.clear();
      questionGroup.get('correctAnswer')?.setValue(type === 'TrueFalse' ? true : '');
    } else if (options.length === 0) {
      this.addOption(questionIndex);
      this.addOption(questionIndex);
      questionGroup.get('correctAnswer')?.setValue('');
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  getOptionsControls(questionIndex: number) {
    return this.getOptionsArray(questionIndex).controls;
  }

  getOptionsLength(questionIndex: number): number {
    return this.getOptionsArray(questionIndex).length;
  }

  saveEvaluation(): void {
    if (this.evaluationForm.invalid) {
      this.evaluationForm.markAllAsTouched();
      return;
    }

    const details = this.detailsGroup.value;
    const settings = this.settingsGroup.value;

    const newEvaluation: Evaluation = {
      id: 0,
      title: details.title ?? '',
      description: details.description ?? '',
      course: details.course ?? '',
      type: settings.type ?? 'Quiz',
      status: 'Not Started',
      durationMinutes: settings.durationMinutes ?? 0,
      passingScore: settings.passingScore ?? 0,
      questionCount: this.questions.length
    };

    this.evaluationService.createEvaluation(newEvaluation).subscribe(() => {
      this.router.navigate(['/evaluation/dashboard']);
    });
  }

  private createQuestionGroup(): FormGroup {
    return this.fb.group({
      type: ['MCQ', Validators.required],
      prompt: ['', Validators.required],
      points: [10, [Validators.required, Validators.min(1)]],
      correctAnswer: ['', Validators.required],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ])
    });
  }

  private getOptionsArray(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }
}
