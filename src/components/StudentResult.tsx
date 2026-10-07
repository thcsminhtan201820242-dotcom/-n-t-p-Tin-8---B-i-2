import React from 'react';
import { CheckCircle2, XCircle, Award, Sparkles, AlertCircle, FileText, Share2, HelpCircle } from 'lucide-react';
import type { QuizSubmission } from '../types';

interface StudentResultProps {
  submission: QuizSubmission;
  onCopyShareLink?: () => void;
}

export const StudentResult: React.FC<StudentResultProps> = ({
  submission,
  onCopyShareLink,
}) => {
  const { studentName, studentClass, scoreRaw, scoreScale10, feedback, results, submittedAtFormatted } = submission;

  // Màu sắc & huy hiệu dựa trên số câu đúng
  const getBadgeStyle = () => {
    if (scoreRaw === 5) {
      return {
        bg: 'bg-emerald-50 border-emerald-300 text-emerald-800',
        ring: 'ring-emerald-400',
        iconBg: 'bg-emerald-500',
      };
    } else if (scoreRaw >= 3) {
      return {
        bg: 'bg-blue-50 border-blue-300 text-blue-800',
        ring: 'ring-blue-400',
        iconBg: 'bg-blue-500',
      };
    } else if (scoreRaw >= 1) {
      return {
        bg: 'bg-amber-50 border-amber-300 text-amber-800',
        ring: 'ring-amber-400',
        iconBg: 'bg-amber-500',
      };
    } else {
      return {
        bg: 'bg-rose-50 border-rose-300 text-rose-800',
        ring: 'ring-rose-400',
        iconBg: 'bg-rose-500',
      };
    }
  };

  const badge = getBadgeStyle();

  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-6">
      {/* Thẻ Kết Quả Tổng Quan */}
      <div className="bg-white rounded-3xl shadow-xl border border-sky-100 overflow-hidden">
        {/* Banner điểm số */}
        <div className="bg-gradient-to-br from-indigo-700 via-blue-700 to-sky-600 p-6 sm:p-8 text-white text-center relative">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/15 backdrop-blur-sm mb-3">
            <Award className="w-10 h-10 text-yellow-300 animate-bounce" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider">
            KẾT QUẢ BÀI ÔN TẬP
          </h2>
          <p className="text-sky-100 text-sm mt-1">
            Học sinh: <strong className="text-white font-bold">{studentName}</strong> • Lớp: <strong className="text-white font-bold">{studentClass}</strong>
          </p>
          <p className="text-xs text-sky-200 mt-0.5">
            Thời gian nộp: {submittedAtFormatted}
          </p>

          {/* Điểm số */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {/* Điểm thang 10 */}
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center min-w-[140px]">
              <span className="text-xs uppercase tracking-wider font-semibold text-sky-100 block">
                Điểm thang 10
              </span>
              <span className="text-4xl sm:text-5xl font-black text-yellow-300">
                {scoreScale10}
              </span>
              <span className="text-xs text-sky-100 block mt-0.5">/ 10 điểm</span>
            </div>

            {/* Số câu đúng */}
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center min-w-[140px]">
              <span className="text-xs uppercase tracking-wider font-semibold text-sky-100 block">
                Số câu đúng
              </span>
              <span className="text-4xl sm:text-5xl font-black text-white">
                {scoreRaw}
              </span>
              <span className="text-xs text-sky-100 block mt-0.5">/ 5 câu</span>
            </div>
          </div>
        </div>

        {/* Lời Nhận Xét Của Giáo Viên */}
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <div className={`p-4 rounded-2xl border-2 flex items-center space-x-3.5 ${badge.bg}`}>
            <div className={`w-10 h-10 rounded-xl text-white flex items-center justify-center flex-shrink-0 shadow-sm ${badge.iconBg}`}>
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
                Lời nhận xét bài làm:
              </p>
              <p className="text-lg sm:text-xl font-bold tracking-tight">
                "{feedback}"
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Thiết bị đã ghi nhận bài nộp hoàn tất.</span>
            {onCopyShareLink && (
              <button
                type="button"
                onClick={onCopyShareLink}
                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Chia sẻ link cho bạn bè</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chi tiết từng câu hỏi & lời giải */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Chi tiết bài làm và Lời giải (5/5 câu)</span>
          </h3>
          <span className="text-xs text-slate-500">
            Xem lại để nắm vững kiến thức
          </span>
        </div>

        {results.map((item, idx) => {
          const isUserCorrect = item.isCorrect;
          const userAns = item.selectedAnswer;

          return (
            <div
              key={item.questionId}
              className={`bg-white rounded-2xl border-2 p-5 sm:p-6 transition-all ${
                isUserCorrect
                  ? 'border-emerald-200 shadow-sm hover:border-emerald-300'
                  : 'border-rose-200 shadow-sm hover:border-rose-300'
              }`}
            >
              {/* Đoạn văn / tình huống (nếu có) */}
              {item.passage && (
                <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">
                    📖 Đoạn văn tình huống:
                  </span>
                  <p className="text-sm sm:text-base font-medium">
                    {item.passage}
                  </p>
                </div>
              )}

              {/* Tiêu đề câu hỏi */}
              <div className="flex items-start space-x-3 mb-4">
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    isUserCorrect
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {idx + 1}
                </span>

                <div className="flex-1">
                  <h4 className="text-base font-bold text-slate-800 leading-snug">
                    {item.question}
                  </h4>
                </div>

                {/* Nhãn Đúng / Sai */}
                <div className="flex-shrink-0">
                  {isUserCorrect ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" /> Đúng (+2 đ)
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                      <XCircle className="w-4 h-4 mr-1 text-rose-600" /> Chưa đúng (0 đ)
                    </span>
                  )}
                </div>
              </div>

              {/* So sánh Đáp án em chọn và Đáp án đúng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 pl-0 sm:pl-11">
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    isUserCorrect
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                      : userAns
                      ? 'bg-rose-50/60 border-rose-200 text-rose-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="text-xs font-semibold">Đáp án em đã chọn:</span>
                  <span className="font-bold text-base px-2.5 py-0.5 rounded-md bg-white shadow-xs">
                    {userAns || <span className="text-slate-400 font-normal italic">Bỏ trống</span>}
                  </span>
                </div>

                <div className="p-3 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-900 flex items-center justify-between">
                  <span className="text-xs font-semibold">Đáp án chính xác:</span>
                  <span className="font-bold text-base px-2.5 py-0.5 rounded-md bg-emerald-600 text-white shadow-xs">
                    {item.correctAnswer}
                  </span>
                </div>
              </div>

              {/* Lời giải thích chi tiết */}
              <div className="pl-0 sm:pl-11">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700">
                  <div className="flex items-center space-x-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    <span>Giải thích chi tiết:</span>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-700">
                    {item.explanation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
