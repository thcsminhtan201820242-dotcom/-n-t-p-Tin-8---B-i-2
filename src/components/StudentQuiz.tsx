import React, { useState, useEffect, useRef } from 'react';
import { Clock, AlertTriangle, Send, CheckCircle2, FileText, User, GraduationCap } from 'lucide-react';
import { QUESTIONS, QUIZ_DURATION_MINUTES } from '../data/quizData';

interface StudentQuizProps {
  studentName: string;
  studentClass: string;
  onSubmit: (answers: Record<number, string>) => void;
  isSubmitting: boolean;
}

export const StudentQuiz: React.FC<StudentQuizProps> = ({
  studentName,
  studentClass,
  onSubmit,
  isSubmitting,
}) => {
  // Answers state: questionId -> 'A' | 'B' | 'C' | 'D'
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  // Timer state in seconds: default 5 minutes
  const totalSeconds = QUIZ_DURATION_MINUTES * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  
  // Warning modal when there are empty questions
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);

  const answersRef = useRef(answers);
  answersRef.current = answers;

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      if (!hasAutoSubmitted && !isSubmitting) {
        setHasAutoSubmitted(true);
        // Hết giờ tự động nộp bài
        onSubmit(answersRef.current);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, hasAutoSubmitted, isSubmitting, onSubmit]);

  const handleSelectAnswer = (questionId: number, optionKey: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  // Format time MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isTimeLow = timeLeft < 60; // Dưới 1 phút cảnh báo màu đỏ

  const answeredCount = QUESTIONS.filter((q) => !!answers[q.id]).length;
  const unansweredList = QUESTIONS.filter((q) => !answers[q.id]);

  const handleClickSubmit = () => {
    if (unansweredList.length > 0) {
      setShowWarningModal(true);
    } else {
      onSubmit(answers);
    }
  };

  const handleConfirmSubmitAnyway = () => {
    setShowWarningModal(false);
    onSubmit(answers);
  };

  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-6">
      {/* Thanh Header nổi dính phía trên: Thông tin học sinh & Đồng hồ đếm ngược */}
      <header className="sticky top-2 z-30 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-sky-100 p-4 transition-all">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Thông tin học sinh */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 font-bold">
              {studentClass.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-base leading-tight">
                <User className="w-4 h-4 text-blue-600 inline" />
                <span>{studentName}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400 inline" />
                <span>Lớp: <strong className="text-slate-700 font-semibold">{studentClass}</strong></span>
                <span className="text-slate-300">•</span>
                <span>Tiến độ: <strong className="text-blue-600 font-semibold">{answeredCount}/{QUESTIONS.length} câu</strong></span>
              </div>
            </div>
          </div>

          {/* Đồng hồ đếm ngược */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-mono text-lg font-bold border transition ${
                isTimeLow
                  ? 'bg-red-50 text-red-600 border-red-300 animate-pulse'
                  : timeLeft < 120
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              <Clock className="w-5 h-5 flex-shrink-0" />
              <span>{formattedTime}</span>
            </div>

            <button
              type="button"
              onClick={handleClickSubmit}
              disabled={isSubmitting}
              className="py-2.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md transition text-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang nộp...' : 'Nộp bài'}</span>
            </button>
          </div>
        </div>

        {/* Thanh tiến độ làm bài */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Danh sách 5 câu hỏi theo ĐÚNG thứ tự đề gốc, KHÔNG xáo trộn */}
      <div className="space-y-6">
        {QUESTIONS.map((q, index) => {
          const selectedOption = answers[q.id];
          const isAnswered = !!selectedOption;

          return (
            <div
              key={q.id}
              id={`question-${q.id}`}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 transition-all hover:shadow-md"
            >
              {/* Đoạn văn / tình huống (nếu có, ví dụ câu 5) - Luôn hiển thị đầy đủ phía trên câu hỏi */}
              {q.passage && (
                <div className="mb-5 p-4 rounded-xl bg-amber-50/80 border-2 border-amber-200/90 text-slate-800">
                  <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm mb-1.5">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span className="uppercase tracking-wider">Đoạn văn tình huống đọc hiểu (dành cho câu {index + 1})</span>
                  </div>
                  <p className="text-base sm:text-lg leading-relaxed text-slate-800 font-medium">
                    {q.passage}
                  </p>
                </div>
              )}

              {/* Tiêu đề câu hỏi */}
              <div className="flex items-start space-x-3 mb-4">
                <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-sm">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
                    {q.question}
                  </h3>
                </div>
                {isAnswered ? (
                  <span className="flex-shrink-0 inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Đã chọn
                  </span>
                ) : (
                  <span className="flex-shrink-0 inline-flex items-center text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                    Chưa chọn
                  </span>
                )}
              </div>

              {/* Các phương án A, B, C, D theo ĐÚNG thứ tự */}
              <div className="space-y-3 pl-0 sm:pl-11">
                {q.options.map((opt) => {
                  const isSelected = selectedOption === opt.key;

                  return (
                    <label
                      key={opt.key}
                      onClick={() => handleSelectAnswer(q.id, opt.key)}
                      className={`flex items-start p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition select-none ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={opt.key}
                        checked={isSelected}
                        onChange={() => handleSelectAnswer(q.id, opt.key)}
                        className="sr-only"
                      />
                      <span
                        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm mr-3 transition ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span
                        className={`text-sm sm:text-base leading-relaxed pt-1 flex-1 font-medium ${
                          isSelected ? 'text-blue-950 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        {opt.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Nút Nộp bài to ở cuối trang */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-slate-700">
            Học sinh: {studentName} • Lớp {studentClass}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Đã làm: <strong className="text-blue-600">{answeredCount}/{QUESTIONS.length}</strong> câu
            {unansweredList.length > 0 && (
              <span className="text-amber-600 ml-2">
                (Còn {unansweredList.length} câu chưa chọn)
              </span>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={handleClickSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-500/20 transition transform active:scale-95 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
          <span>{isSubmitting ? 'ĐANG NỘP BÀI...' : 'NỘP BÀI THI'}</span>
        </button>
      </div>

      {/* Modal cảnh báo nhẹ khi còn câu trống */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-amber-600 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Nhắc nhở câu chưa làm!
              </h3>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Em còn <strong className="text-red-600 font-bold">{unansweredList.length} câu</strong> chưa chọn đáp án:
              {' '}
              <span className="font-semibold text-slate-800">
                {unansweredList.map((q) => `Câu ${q.id}`).join(', ')}
              </span>.
              <br />
              Câu bỏ trống sẽ bị tính 0 điểm. Em có muốn quay lại kiểm tra không?
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => setShowWarningModal(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-sm transition cursor-pointer"
              >
                Quay lại làm tiếp
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmitAnyway}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm hover:from-emerald-700 hover:to-teal-700 transition cursor-pointer"
              >
                Vẫn nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
