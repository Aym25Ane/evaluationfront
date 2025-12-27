import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {
  DashboardStats,
  Evaluation,
  EvaluationAttempt,
  EvaluationQuestion,
  EvaluationResult,
  QuestionReview
} from '../models/evaluation.models';

@Injectable({ providedIn: 'root' })
export class EvaluationService {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly useMocks = environment.useMocks;

  private evaluations: Evaluation[] = [
    {
      id: 1,
      title: 'Angular Fundamentals Quiz',
      description: 'Core Angular concepts and architecture basics.',
      course: 'Angular Foundations',
      type: 'Quiz',
      status: 'Not Started',
      durationMinutes: 20,
      passingScore: 70,
      questionCount: 6
    },
    {
      id: 2,
      title: 'Spring Boot Security Exam',
      description: 'Covers JWT, filters, and access control patterns.',
      course: 'Secure Backend Systems',
      type: 'Exam',
      status: 'In Progress',
      durationMinutes: 60,
      passingScore: 75,
      questionCount: 10
    },
    {
      id: 3,
      title: 'UX Evaluation Assignment',
      description: 'Design critique and accessibility audit.',
      course: 'Product Design Studio',
      type: 'Assignment',
      status: 'Completed',
      durationMinutes: 45,
      passingScore: 65,
      questionCount: 5,
      score: 88
    }
  ];

  private questionsByEvaluation: Record<number, EvaluationQuestion[]> = {
    1: [
      {
        id: 101,
        type: 'MCQ',
        prompt: 'Which Angular feature enables dependency injection?',
        points: 10,
        options: [
          { id: 'a', text: 'NgZone' },
          { id: 'b', text: 'Providers' },
          { id: 'c', text: 'Signals' },
          { id: 'd', text: 'Pipes' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 102,
        type: 'TrueFalse',
        prompt: 'Standalone components can be used without NgModules.',
        points: 10,
        correctAnswer: true
      },
      {
        id: 103,
        type: 'MCQ',
        prompt: 'Which directive renders a template based on a condition?',
        points: 10,
        options: [
          { id: 'a', text: 'ngFor' },
          { id: 'b', text: 'ngIf' },
          { id: 'c', text: 'ngSwitch' },
          { id: 'd', text: 'ngClass' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 104,
        type: 'ShortAnswer',
        prompt: 'Name one benefit of using Angular Material.',
        points: 10,
        correctAnswer: 'consistency'
      },
      {
        id: 105,
        type: 'MCQ',
        prompt: 'What does RxJS primarily handle in Angular apps?',
        points: 10,
        options: [
          { id: 'a', text: 'State management only' },
          { id: 'b', text: 'Asynchronous streams' },
          { id: 'c', text: 'Routing' },
          { id: 'd', text: 'DOM manipulation' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 106,
        type: 'TrueFalse',
        prompt: 'Angular signals are used for styling components.',
        points: 10,
        correctAnswer: false
      }
    ],
    2: [
      {
        id: 201,
        type: 'MCQ',
        prompt: 'Which Spring component validates JWT tokens?',
        points: 10,
        options: [
          { id: 'a', text: 'AuthenticationFilter' },
          { id: 'b', text: 'JwtDecoder' },
          { id: 'c', text: 'RestTemplate' },
          { id: 'd', text: 'CrudRepository' }
        ],
        correctAnswer: 'b'
      }
    ],
    3: [
      {
        id: 301,
        type: 'ShortAnswer',
        prompt: 'List two accessibility considerations for forms.',
        points: 20,
        correctAnswer: 'labels'
      }
    ]
  };

  private attempts: Record<number, EvaluationAttempt> = {};

  constructor(private http: HttpClient) {}

  getEvaluations(): Observable<Evaluation[]> {
    if (!this.useMocks) {
      // TODO: GET /evaluations
      return this.http
        .get<Evaluation[]>(`${this.apiBaseUrl}/evaluations`)
        .pipe(map((items) => items.map((item) => this.fromApiEvaluation(item))));
    }
    return of([...this.evaluations]);
  }

  getDashboardStats(): Observable<DashboardStats> {
    if (!this.useMocks) {
      // TODO: GET /evaluations/stats
      return this.http.get<DashboardStats>(`${this.apiBaseUrl}/evaluations/stats`);
    }
    const total = this.evaluations.length;
    const completed = this.evaluations.filter((item) => item.status === 'Completed').length;
    const pending = this.evaluations.filter((item) => item.status !== 'Completed').length;
    const scores = this.evaluations
      .map((item) => item.score)
      .filter((score): score is number => typeof score === 'number');
    const averageScore = scores.length
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 0;

    return of({ total, completed, pending, averageScore });
  }

  getEvaluationById(id: number): Observable<Evaluation | undefined> {
    if (!this.useMocks) {
      // TODO: GET /evaluations/{id}
      return this.http
        .get<Evaluation>(`${this.apiBaseUrl}/evaluations/${id}`)
        .pipe(map((item) => this.fromApiEvaluation(item)));
    }
    return of(this.evaluations.find((item) => item.id === id));
  }

  getQuestions(id: number): Observable<EvaluationQuestion[]> {
    if (!this.useMocks) {
      // TODO: GET /evaluations/{id}/questions
      return this.http
        .get<EvaluationQuestion[]>(`${this.apiBaseUrl}/evaluations/${id}/questions`)
        .pipe(map((items) => items.map((item) => this.fromApiQuestion(item))));
    }
    return of(this.questionsByEvaluation[id] ?? []);
  }

  createEvaluation(payload: Evaluation): Observable<Evaluation> {
    if (!this.useMocks) {
      // TODO: POST /evaluations
      return this.http
        .post<Evaluation>(`${this.apiBaseUrl}/evaluations`, this.toApiEvaluation(payload))
        .pipe(map((item) => this.fromApiEvaluation(item)));
    }
    const currentMax = this.evaluations.reduce((max, item) => Math.max(max, item.id), 0);
    const nextId = currentMax + 1;
    const created: Evaluation = { ...payload, id: nextId, status: 'Not Started' as const };
    this.evaluations = [created, ...this.evaluations];

    return of(created);
  }

  saveAnswer(evaluationId: number, questionId: number, answer: string | boolean): Observable<void> {
    if (!this.useMocks) {
      // TODO: PATCH /evaluations/{id}/attempts
      return this.http.patch<void>(`${this.apiBaseUrl}/evaluations/${evaluationId}/attempts`, {
        questionId,
        answer
      });
    }
    const current = this.attempts[evaluationId] ?? {
      evaluationId,
      answers: {},
      startedAt: new Date().toISOString()
    };

    this.attempts[evaluationId] = {
      ...current,
      answers: {
        ...current.answers,
        [questionId]: answer
      }
    };

    return of(void 0);
  }

  getAttempt(evaluationId: number): Observable<EvaluationAttempt | undefined> {
    if (!this.useMocks) {
      // TODO: GET /evaluations/{id}/attempts/me
      return this.http.get<EvaluationAttempt>(`${this.apiBaseUrl}/evaluations/${evaluationId}/attempts/me`);
    }
    return of(this.attempts[evaluationId]);
  }

  submitEvaluation(evaluationId: number): Observable<EvaluationResult> {
    if (!this.useMocks) {
      // TODO: POST /evaluations/{id}/submit
      return this.http
        .post<EvaluationResult>(`${this.apiBaseUrl}/evaluations/${evaluationId}/submit`, {})
        .pipe(map((result) => this.fromApiResult(result)));
    }
    const evaluation = this.evaluations.find((item) => item.id === evaluationId);
    const questions = this.questionsByEvaluation[evaluationId] ?? [];
    const attempt = this.attempts[evaluationId];

    const reviews = this.buildReviews(questions, attempt?.answers ?? {});
    const correctCount = reviews.filter((review) => review.isCorrect).length;
    const score = questions.length
      ? Math.round((correctCount / questions.length) * 100)
      : 0;
    const passingScore = evaluation?.passingScore ?? 0;
    const passed = score >= passingScore;

    if (evaluation) {
      evaluation.status = 'Completed';
      evaluation.score = score;
    }

    return of({
      evaluationId,
      score,
      passingScore,
      passed,
      totalQuestions: questions.length,
      correctCount,
      reviews
    });
  }

  getResult(evaluationId: number): Observable<EvaluationResult> {
    if (!this.useMocks) {
      // TODO: GET /evaluations/{id}/results/me
      return this.http
        .get<EvaluationResult>(`${this.apiBaseUrl}/evaluations/${evaluationId}/results/me`)
        .pipe(map((result) => this.fromApiResult(result)));
    }
    const evaluation = this.evaluations.find((item) => item.id === evaluationId);
    const questions = this.questionsByEvaluation[evaluationId] ?? [];
    const attempt = this.attempts[evaluationId];
    const reviews = this.buildReviews(questions, attempt?.answers ?? {});
    const correctCount = reviews.filter((review) => review.isCorrect).length;
    const score = evaluation?.score ?? (questions.length
      ? Math.round((correctCount / questions.length) * 100)
      : 0);
    const passingScore = evaluation?.passingScore ?? 0;
    const passed = score >= passingScore;

    return of({
      evaluationId,
      score,
      passingScore,
      passed,
      totalQuestions: questions.length,
      correctCount,
      reviews
    });
  }

  private buildReviews(
    questions: EvaluationQuestion[],
    answers: Record<string, string | boolean>
  ): QuestionReview[] {
    return questions.map((question) => {
      const userAnswer = answers[question.id] ?? null;
      const correctAnswer = question.correctAnswer ?? '';
      const isCorrect = this.compareAnswer(userAnswer, correctAnswer, question.type);

      return {
        questionId: question.id,
        prompt: question.prompt,
        type: question.type,
        options: question.options,
        userAnswer,
        correctAnswer,
        isCorrect,
        explanation: question.type === 'ShortAnswer'
          ? 'Responses are matched loosely for quick feedback.'
          : undefined
      };
    });
  }

  private compareAnswer(
    userAnswer: string | boolean | null,
    correctAnswer: string | boolean,
    questionType: EvaluationQuestion['type']
  ): boolean {
    if (userAnswer === null || userAnswer === undefined) {
      return false;
    }

    if (questionType === 'ShortAnswer') {
      return String(userAnswer).trim().toLowerCase().includes(String(correctAnswer).toLowerCase());
    }

    return userAnswer === correctAnswer;
  }

  private fromApiEvaluation(evaluation: Evaluation): Evaluation {
    return {
      ...evaluation,
      type: this.fromApiType(evaluation.type),
      status: this.fromApiStatus(evaluation.status),
      questions: evaluation.questions?.map((question) => this.fromApiQuestion(question))
    } as Evaluation;
  }

  private toApiEvaluation(evaluation: Evaluation): Evaluation {
    return {
      ...evaluation,
      type: this.toApiType(evaluation.type),
      status: this.toApiStatus(evaluation.status),
      questions: evaluation.questions?.map((question) => ({
        ...question,
        type: this.toApiQuestionType(question.type)
      }))
    } as Evaluation;
  }

  private fromApiQuestion(question: EvaluationQuestion): EvaluationQuestion {
    return {
      ...question,
      type: this.fromApiQuestionType(question.type)
    };
  }

  private fromApiResult(result: EvaluationResult): EvaluationResult {
    return {
      ...result,
      reviews: (result.reviews ?? []).map((review) => ({
        ...review,
        type: this.fromApiQuestionType(review.type)
      }))
    };
  }

  private fromApiType(type: Evaluation['type']): Evaluation['type'] {
    switch (String(type).toUpperCase()) {
      case 'EXAM':
        return 'Exam';
      case 'ASSIGNMENT':
        return 'Assignment';
      default:
        return 'Quiz';
    }
  }

  private toApiType(type: Evaluation['type']): Evaluation['type'] {
    switch (type) {
      case 'Exam':
        return 'EXAM' as Evaluation['type'];
      case 'Assignment':
        return 'ASSIGNMENT' as Evaluation['type'];
      default:
        return 'QUIZ' as Evaluation['type'];
    }
  }

  private fromApiStatus(status: Evaluation['status']): Evaluation['status'] {
    switch (String(status).toUpperCase()) {
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'COMPLETED':
        return 'Completed';
      default:
        return 'Not Started';
    }
  }

  private toApiStatus(status: Evaluation['status']): Evaluation['status'] {
    switch (status) {
      case 'In Progress':
        return 'IN_PROGRESS' as Evaluation['status'];
      case 'Completed':
        return 'COMPLETED' as Evaluation['status'];
      default:
        return 'NOT_STARTED' as Evaluation['status'];
    }
  }

  private fromApiQuestionType(type: EvaluationQuestion['type']): EvaluationQuestion['type'] {
    switch (String(type).toUpperCase()) {
      case 'TRUE_FALSE':
        return 'TrueFalse';
      case 'SHORT_ANSWER':
        return 'ShortAnswer';
      default:
        return 'MCQ';
    }
  }

  private toApiQuestionType(type: EvaluationQuestion['type']): EvaluationQuestion['type'] {
    switch (type) {
      case 'TrueFalse':
        return 'TRUE_FALSE' as EvaluationQuestion['type'];
      case 'ShortAnswer':
        return 'SHORT_ANSWER' as EvaluationQuestion['type'];
      default:
        return 'MCQ';
    }
  }
}
