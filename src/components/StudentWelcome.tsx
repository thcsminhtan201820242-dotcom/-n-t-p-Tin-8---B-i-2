import React, { useState } from 'react';
import { BookOpen, User, GraduationCap, Clock, Award, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { QUIZ_DURATION_MINUTES } from '../data/quizData';
import type { QuizSubmission } from '../types';

interface StudentWelcomeProps {
  onStart: (name: string, studentClass: string) => void;
  alreadySubmitted: boolean;
  existingSubmission: QuizSubmission | null;
  onViewPreviousResult: () => void;
}

export const StudentWelcome: React.FC<StudentWelcomeProps> = ({
  onStart,
  alreadySubmitted,
  existingSubmission,
  onViewPreviousResult,
}) => {
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập Họ và Tên của em.');
      return;
    }
    if (!studentClass.trim()) {
      setError('Vui lòng nhập Lớp của em (ví dụ: 8A, 8B, 8/1,...).');
      return;
    }
    setError('');
    onStart(name.trim(), studentClass.trim());
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Thẻ chào mừng */}
      <div className="bg-white rounded-2xl shadow-xl border border-sky-100 overflow-hidden">
        {/* Banner tiêu đề */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 px-6 py-8 text-white text-center relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-3 shadow-inner">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            Môn Tin Học 8 • Ôn Tập Tại Nhà
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            BÀI ÔN TẬP TRẮC NGHIỆM
          </h1>
          <p className="text-sky-100 text-sm sm:text-base mt-2 font-medium">
            Chủ đề: Thông tin số & Đánh giá thông tin trên mạng Internet
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Thông tin quy chế làm bài */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-sky-50 rounded-xl p-3 border border-sky-100 flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-sky-200/60 text-sky-700">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Thời gian</p>
                <p className="text-sm font-bold text-slate-800">{QUIZ_DURATION_MINUTES} phút</p>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-emerald-200/60 text-emerald-700">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Số lượng</p>
                <p className="text-sm font-bold text-slate-800">5 câu hỏi</p>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-amber-200/60 text-amber-700">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Quy định</p>
                <p className="text-sm font-bold text-slate-800">1 lần / thiết bị</p>
              </div>
            </div>
          </div>

          {/* Nếu thiết bị này đã hoàn thành bài làm */}
          {alreadySubmitted && existingSubmission ? (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-700">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-900">
                  Thiết bị này đã hoàn thành bài thi!
                </h3>
                <p className="text-sm text-amber-800 mt-1">
                  Học sinh: <strong className="font-semibold text-slate-900">{existingSubmission.studentName}</strong> (Lớp {existingSubmission.studentClass})
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Đã nộp vào lúc: {existingSubmission.submittedAtFormatted}
                </p>
                <div className="mt-3 inline-block bg-white px-4 py-2 rounded-xl border border-amber-200 shadow-sm">
                  <span className="text-sm text-slate-600">Kết quả: </span>
                  <strong className="text-blue-700 font-bold">{existingSubmission.scoreRaw}/5 câu đúng</strong>
                  <span className="text-slate-400 mx-1.5">•</span>
                  <strong className="text-emerald-700 font-bold">{existingSubmission.scoreScale10} / 10 điểm</strong>
                </div>
              </div>
              <p className="text-xs text-amber-700 italic">
                Theo quy chế của giáo viên, mỗi học sinh chỉ được thực hiện một lần trên một thiết bị.
              </p>
              <button
                type="button"
                onClick={onViewPreviousResult}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-md hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center space-x-2 text-base cursor-pointer"
              >
                <span>Xem lại kết quả & Lời giải bài làm</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* Form nhập họ tên và lớp */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="studentName" className="block text-sm font-bold text-slate-700 flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Họ và Tên học sinh <span className="text-red-500">*</span></span>
                </label>
                <input
                  id="studentName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition bg-slate-50/50 focus:bg-white"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="studentClass" className="block text-sm font-bold text-slate-700 flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Lớp học <span className="text-red-500">*</span></span>
                </label>
                <input
                  id="studentClass"
                  type="text"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  placeholder="Ví dụ: 8A, 8B, 8C, 8/1,..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition bg-slate-50/50 focus:bg-white"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-medium flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-700">Lưu ý trước khi bấm bắt đầu:</p>
                <p>• Khi bấm bắt đầu, đồng hồ 5 phút sẽ đếm ngược liên tục.</p>
                <p>• Khi hết 5 phút, hệ thống sẽ tự động nộp bài làm của em.</p>
                <p>• Sau khi nộp bài, em sẽ nhận ngay kết quả và lời giải chi tiết từng câu.</p>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:via-indigo-700 hover:to-sky-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/25 transition transform active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>BẮT ĐẦU LÀM BÀI</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
