export interface StudentAnswerItem {
  questionId: number;
  question: string;
  passage?: string;
  selectedAnswer: string; // 'A' | 'B' | 'C' | 'D' | ''
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  explanation: string;
}

export interface QuizSubmission {
  id: string;
  studentName: string;
  studentClass: string;
  answers: Record<number, string>;
  results: StudentAnswerItem[];
  scoreRaw: number; // x / 5
  scoreScale10: number; // Thang 10 (vd: 10, 8, 6, 4, 2, 0)
  feedback: string;
  submittedAt: string;
  submittedAtFormatted: string;
  deviceId: string;
}

export interface QuestionStatistic {
  questionId: number;
  questionTitle: string;
  passage?: string;
  correctAnswer: string;
  wrongCount: number;
  wrongRate: number; // 0 to 100 (%)
  correctCount: number;
  optionCounts: {
    A: number;
    B: number;
    C: number;
    D: number;
    blank: number;
  };
}

export interface TeacherDashboardData {
  submissions: QuizSubmission[];
  totalSubmissions: number;
  averageScore: number;
  questionStats: QuestionStatistic[];
}
