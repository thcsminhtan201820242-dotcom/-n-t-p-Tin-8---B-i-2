import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { QUESTIONS, QUIZ_DURATION_MINUTES, getFeedbackMessage } from './src/data/quizData.ts';
import type { QuizSubmission, QuestionStatistic, TeacherDashboardData } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'submissions.json');

// Ensure data folder and empty database file exist (NO MOCK DATA)
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
}

function readSubmissions(): QuizSubmission[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading submissions:', err);
    return [];
  }
}

function writeSubmissions(submissions: QuizSubmission[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing submissions:', err);
  }
}

app.use(express.json());

// API: Get basic quiz info (without answers)
app.get('/api/quiz-info', (req, res) => {
  res.json({
    durationMinutes: QUIZ_DURATION_MINUTES,
    totalQuestions: QUESTIONS.length,
    questions: QUESTIONS.map(q => ({
      id: q.id,
      passage: q.passage,
      question: q.question,
      options: q.options
    }))
  });
});

// API: Check if device has already submitted
app.get('/api/check-device/:deviceId', (req, res) => {
  const { deviceId } = req.params;
  const submissions = readSubmissions();
  const existing = submissions.find(s => s.deviceId === deviceId);
  if (existing) {
    return res.json({ submitted: true, submission: existing });
  }
  return res.json({ submitted: false });
});

// API: Submit quiz
app.post('/api/submit', (req, res) => {
  try {
    const { studentName, studentClass, answers, deviceId } = req.body;

    if (!studentName || !studentName.trim()) {
      return res.status(400).json({ error: 'Vui lòng nhập họ và tên học sinh!' });
    }
    if (!studentClass || !studentClass.trim()) {
      return res.status(400).json({ error: 'Vui lòng nhập lớp học!' });
    }
    if (!deviceId || !deviceId.trim()) {
      return res.status(400).json({ error: 'Không tìm thấy thông tin thiết bị!' });
    }

    const submissions = readSubmissions();

    // Check device duplicate
    const alreadySubmitted = submissions.some(s => s.deviceId === deviceId.trim());
    if (alreadySubmitted) {
      return res.status(400).json({
        error: 'Thiết bị này đã làm bài trước đó. Mỗi thiết bị chỉ được làm bài 1 lần duy nhất!'
      });
    }

    // Grade each question accurately against its own answer key
    const studentAnswersRecord: Record<number, string> = {};
    let correctCount = 0;

    const results = QUESTIONS.map((q) => {
      const selected = (answers?.[q.id] || answers?.[String(q.id)] || '').toString().trim().toUpperCase();
      studentAnswersRecord[q.id] = selected;

      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) {
        correctCount += 1;
      }

      return {
        questionId: q.id,
        question: q.question,
        passage: q.passage,
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const scoreRaw = correctCount;
    const scoreScale10 = scoreRaw * 2; // Quy thang 10 (mỗi câu 2 điểm)
    const feedback = getFeedbackMessage(correctCount);

    const now = new Date();
    // Vietnamese formatted timestamp
    const submittedAtFormatted = now.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const newSubmission: QuizSubmission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      studentName: studentName.trim(),
      studentClass: studentClass.trim(),
      answers: studentAnswersRecord,
      results,
      scoreRaw,
      scoreScale10,
      feedback,
      submittedAt: now.toISOString(),
      submittedAtFormatted,
      deviceId: deviceId.trim()
    };

    submissions.push(newSubmission);
    writeSubmissions(submissions);

    return res.status(200).json({
      success: true,
      submission: newSubmission
    });
  } catch (error) {
    console.error('Submit error:', error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi lưu bài nộp. Vui lòng thử lại!' });
  }
});

// API: Teacher authentication
app.post('/api/teacher/auth', (req, res) => {
  const { password } = req.body;
  if (password === '12345678') {
    return res.json({ success: true, token: 'gv_auth_token_session_secure' });
  }
  return res.status(401).json({ error: 'Mật khẩu giáo viên không chính xác!' });
});

// Middleware for teacher auth
function teacherAuthMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader === 'Bearer gv_auth_token_session_secure' || req.query.token === 'gv_auth_token_session_secure') {
    return next();
  }
  return res.status(401).json({ error: 'Yêu cầu quyền giáo viên để truy cập!' });
}

// API: Teacher dashboard data (Strictly calculated from real submissions)
app.get('/api/teacher/data', teacherAuthMiddleware, (req, res) => {
  const submissions = readSubmissions();
  const totalSubmissions = submissions.length;

  // Calculate average score
  const totalScore = submissions.reduce((sum, s) => sum + s.scoreScale10, 0);
  const averageScore = totalSubmissions > 0 ? Math.round((totalScore / totalSubmissions) * 10) / 10 : 0;

  // Calculate statistics for each question
  const questionStats: QuestionStatistic[] = QUESTIONS.map((q) => {
    let wrongCount = 0;
    let correctCount = 0;
    const optionCounts = { A: 0, B: 0, C: 0, D: 0, blank: 0 };

    submissions.forEach((sub) => {
      const studentAns = sub.answers[q.id] || '';
      if (studentAns === 'A') optionCounts.A++;
      else if (studentAns === 'B') optionCounts.B++;
      else if (studentAns === 'C') optionCounts.C++;
      else if (studentAns === 'D') optionCounts.D++;
      else optionCounts.blank++;

      if (studentAns === q.correctAnswer) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    // Tỉ lệ học sinh làm sai từng câu: (số em sai câu đó ÷ số em đã nộp) × 100%
    // Câu không ai sai (hoặc 0 em nộp) = 0%
    const wrongRate = totalSubmissions > 0 
      ? Math.round(((wrongCount / totalSubmissions) * 100) * 10) / 10 
      : 0;

    return {
      questionId: q.id,
      questionTitle: q.question,
      passage: q.passage,
      correctAnswer: q.correctAnswer,
      wrongCount,
      wrongRate,
      correctCount,
      optionCounts
    };
  });

  const responseData: TeacherDashboardData = {
    submissions,
    totalSubmissions,
    averageScore,
    questionStats
  };

  res.json(responseData);
});

// API: Reset all submissions (Teacher only, for testing / clear data if teacher needs)
app.post('/api/teacher/reset-all', teacherAuthMiddleware, (req, res) => {
  writeSubmissions([]);
  res.json({ success: true, message: 'Đã xóa toàn bộ bài nộp thành công. Cơ sở dữ liệu trở về rỗng.' });
});

// API: Download project zip
app.get('/api/download-zip', (req, res) => {
  const zipPath = path.resolve(__dirname, 'bai-on-tinhoc8.zip');
  if (fs.existsSync(zipPath)) {
    res.download(zipPath, 'bai-on-tinhoc8.zip');
  } else {
    res.status(404).send('File zip chưa sẵn sàng');
  }
});

// Vite middleware integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
