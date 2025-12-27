export type EvaluationType = 'Quiz' | 'Exam' | 'Assignment';
export type EvaluationStatus = 'Not Started' | 'In Progress' | 'Completed';
export type QuestionType = 'MCQ' | 'TrueFalse' | 'ShortAnswer';

export interface Evaluation {
  id: number;
  title: string;
  description: string;
  course: string;
  type: EvaluationType;
  status: EvaluationStatus;
  durationMinutes: number;
  passingScore: number;
  score?: number;
  questionCount: number;
  questions?: EvaluationQuestion[];
}

export interface AnswerOption {
  id: string;
  text: string;
}

export interface EvaluationQuestion {
  id: number;
  type: QuestionType;
  prompt: string;
  points: number;
  options?: AnswerOption[];
  correctAnswer?: string | boolean;
}

export interface EvaluationAttempt {
  evaluationId: number;
  answers: Record<string, string | boolean>;
  startedAt: string;
}

export interface EvaluationResult {
  evaluationId: number;
  score: number;
  passingScore: number;
  passed: boolean;
  totalQuestions: number;
  correctCount: number;
  reviews: QuestionReview[];
}

export interface QuestionReview {
  questionId: number;
  prompt: string;
  type: QuestionType;
  options?: AnswerOption[];
  userAnswer: string | boolean | null;
  correctAnswer: string | boolean;
  isCorrect: boolean;
  explanation?: string;
}

export interface DashboardStats {
  total: number;
  completed: number;
  pending: number;
  averageScore: number;
}
