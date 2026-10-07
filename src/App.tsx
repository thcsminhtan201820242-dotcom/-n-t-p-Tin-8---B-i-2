/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Lock, 
  UserCheck, 
  Share2, 
  Check, 
  School,
  Sparkles 
} from 'lucide-react';
import { StudentWelcome } from './components/StudentWelcome';
import { StudentQuiz } from './components/StudentQuiz';
import { StudentResult } from './components/StudentResult';
import { TeacherDashboard } from './components/TeacherDashboard';
import { getOrCreateDeviceId, getLocalSubmission, saveLocalSubmission } from './utils/device';
import type { QuizSubmission } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'student' | 'teacher'>('student');
  const [studentStage, setStudentStage] = useState<'welcome' | 'quiz' | 'result'>('welcome');

  // Student info
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  
  // Submission result
  const [submissionResult, setSubmissionResult] = useState<QuizSubmission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  // Link copy feedback
  const [copiedLink, setCopiedLink] = useState(false);

  // On mount: check device submission status
  useEffect(() => {
    const deviceId = getOrCreateDeviceId();

    // Check local storage first
    const local = getLocalSubmission();
    if (local) {
      setSubmissionResult(local);
      setAlreadySubmitted(true);
    }

    // Check backend to verify
    fetch(`/api/check-device/${deviceId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.submitted && data.submission) {
          setSubmissionResult(data.submission);
          setAlreadySubmitted(true);
          saveLocalSubmission(data.submission);
        }
      })
      .catch((err) => {
        console.error('Lỗi kiểm tra thiết bị:', err);
      });
  }, []);

  const handleStartQuiz = (name: string, cls: string) => {
    setStudentName(name);
    setStudentClass(cls);
    setStudentStage('quiz');
  };

  const handleSubmitQuiz = async (answers: Record<number, string>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const deviceId = getOrCreateDeviceId();
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          studentClass,
          answers,
          deviceId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Có lỗi xảy ra khi nộp bài. Vui lòng thử lại!');
        setIsSubmitting(false);
        return;
      }

      // Successfully saved
      const savedSubmission: QuizSubmission = data.submission;
      setSubmissionResult(savedSubmission);
      saveLocalSubmission(savedSubmission);
      setAlreadySubmitted(true);
      setStudentStage('result');
    } catch {
      alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng internet!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-slate-50 to-indigo-50/30 text-slate-900 font-sans antialiased">
      {/* Thanh Header Chính Của Trang Web */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-sky-100 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Tiêu đề ứng dụng */}
          <div 
            onClick={() => {
              if (currentView === 'teacher') setCurrentView('student');
            }}
            className="flex items-center space-x-2.5 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <School className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 bg-clip-text text-transparent">
                TIN HỌC 8 ONLINE
              </span>
              <span className="hidden sm:block text-[11px] text-slate-500 font-medium -mt-1">
                Hệ thống ôn trắc nghiệm & đánh giá kết quả
              </span>
            </div>
          </div>

          {/* Các nút điều hướng nhanh */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Nút chia sẻ link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
              title="Sao chép liên kết làm bài để gửi qua Zalo / Nhóm lớp"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
              <span className="hidden sm:inline">{copiedLink ? 'Đã chép link!' : 'Chia sẻ link'}</span>
            </button>

            {/* Nút chuyển đổi chế độ Giáo Viên / Học Sinh */}
            {currentView === 'student' ? (
              <button
                type="button"
                onClick={() => setCurrentView('teacher')}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Giáo viên</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentView('student')}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Trang học sinh</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Nội dung chính của màn hình */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {currentView === 'teacher' ? (
          <TeacherDashboard onBackToStudent={() => setCurrentView('student')} />
        ) : (
          <>
            {studentStage === 'welcome' && (
              <StudentWelcome
                onStart={handleStartQuiz}
                alreadySubmitted={alreadySubmitted}
                existingSubmission={submissionResult}
                onViewPreviousResult={() => setStudentStage('result')}
              />
            )}

            {studentStage === 'quiz' && (
              <StudentQuiz
                studentName={studentName}
                studentClass={studentClass}
                onSubmit={handleSubmitQuiz}
                isSubmitting={isSubmitting}
              />
            )}

            {studentStage === 'result' && submissionResult && (
              <StudentResult
                submission={submissionResult}
                onCopyShareLink={handleCopyLink}
              />
            )}
          </>
        )}
      </main>

      {/* Footer chân trang */}
      <footer className="mt-auto border-t border-slate-200/60 py-6 text-center text-xs text-slate-500">
        <p className="font-medium">
          Hệ thống Ôn tập Trắc nghiệm Tin học Lớp 8 • Năm học 2026
        </p>
        <p className="mt-1 text-slate-400">
          Chỉ lưu trữ bài làm thật do học sinh nộp • Bảo mật quản lý kết quả bằng mật mã giáo viên
        </p>
      </footer>
    </div>
  );
}
