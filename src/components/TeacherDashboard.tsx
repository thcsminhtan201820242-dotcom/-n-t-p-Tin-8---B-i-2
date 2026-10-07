import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  BarChart3, 
  Users, 
  Clock, 
  ArrowUpDown, 
  Search, 
  RefreshCw, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Eye, 
  EyeOff,
  X,
  Trash2,
  Share2,
  Check,
  Download
} from 'lucide-react';
import type { TeacherDashboardData, QuizSubmission } from '../types';

interface TeacherDashboardProps {
  onBackToStudent: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBackToStudent }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authToken, setAuthToken] = useState('');

  const [dashboardData, setDashboardData] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sorting & Filtering
  const [sortField, setSortField] = useState<'score' | 'time'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Student Detail Modal
  const [selectedSubmission, setSelectedSubmission] = useState<QuizSubmission | null>(null);

  // Link copy toast
  const [copiedLink, setCopiedLink] = useState(false);

  // Check saved session
  useEffect(() => {
    const savedToken = sessionStorage.getItem('quiz_teacher_token');
    if (savedToken) {
      setAuthToken(savedToken);
      setIsAuthenticated(true);
      fetchTeacherData(savedToken);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const res = await fetch('/api/teacher/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Mật khẩu không chính xác!');
        return;
      }

      setAuthToken(data.token);
      setIsAuthenticated(true);
      sessionStorage.setItem('quiz_teacher_token', data.token);
      fetchTeacherData(data.token);
    } catch {
      setAuthError('Không thể kết nối đến máy chủ. Vui lòng thử lại!');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('quiz_teacher_token');
    setIsAuthenticated(false);
    setAuthToken('');
    setPassword('');
    setDashboardData(null);
  };

  const fetchTeacherData = async (token = authToken) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/teacher/data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          return;
        }
        throw new Error('Lỗi khi tải dữ liệu từ máy chủ');
      }

      const data: TeacherDashboardData = await res.json();
      setDashboardData(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể tải dữ liệu giáo viên');
    } finally {
      setLoading(false);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('CẢNH BÁO: Thao tác này sẽ xóa toàn bộ bài nộp của học sinh để đưa cơ sở dữ liệu về RỖNG hoàn toàn. Thầy/Cô có chắc chắn muốn xóa không?')) {
      return;
    }

    try {
      const res = await fetch('/api/teacher/reset-all', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.ok) {
        alert('Đã xóa toàn bộ bài nộp thành công!');
        fetchTeacherData(authToken);
      }
    } catch {
      alert('Không thể xóa dữ liệu');
    }
  };

  const handleCopyQuizLink = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-8">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-indigo-900 p-6 text-white text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 flex items-center justify-center mb-3 backdrop-blur-xs">
              <Lock className="w-7 h-7 text-indigo-300" />
            </div>
            <h2 className="text-xl font-bold">CỔNG DÀNH CHO GIÁO VIÊN</h2>
            <p className="text-xs text-indigo-200 mt-1">
              Khu vực bảo mật quản lý và thống kê bài kiểm tra
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label htmlFor="teacherPass" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Nhập mật khẩu quản trị:
              </label>
              <div className="relative">
                <input
                  id="teacherPass"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer text-base"
            >
              <Unlock className="w-5 h-5" />
              <span>ĐĂNG NHẬP QUẢN TRỊ</span>
            </button>

            <button
              type="button"
              onClick={onBackToStudent}
              className="w-full py-2.5 text-slate-500 hover:text-slate-800 font-semibold text-sm transition cursor-pointer"
            >
              ← Quay lại trang làm bài của học sinh
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Loaded Dashboard
  const submissions = dashboardData?.submissions || [];
  const totalCount = dashboardData?.totalSubmissions || 0;
  const avgScore = dashboardData?.averageScore || 0;
  const questionStats = dashboardData?.questionStats || [];

  // Filter & Sort
  const filteredSubmissions = submissions
    .filter((s) => {
      const term = searchTerm.toLowerCase().trim();
      if (!term) return true;
      return s.studentName.toLowerCase().includes(term) || s.studentClass.toLowerCase().includes(term);
    })
    .sort((a, b) => {
      if (sortField === 'score') {
        return sortOrder === 'desc' ? b.scoreScale10 - a.scoreScale10 : a.scoreScale10 - b.scoreScale10;
      } else {
        const timeA = new Date(a.submittedAt).getTime();
        const timeB = new Date(b.submittedAt).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      }
    });

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Top Navbar Giáo Viên */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            GV
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              TRANG QUẢN TRỊ GIÁO VIÊN
            </h1>
            <p className="text-xs text-slate-500">
              Bài ôn trắc nghiệm môn Tin học 8 • Đánh giá thông tin số
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          <a
            href="/api/download-zip"
            download="bai-on-tinhoc8.zip"
            className="px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
            title="Tải gói mã nguồn .ZIP về máy tính"
          >
            <Download className="w-4 h-4" />
            <span>Tải mã nguồn (.ZIP)</span>
          </a>

          <button
            type="button"
            onClick={handleCopyQuizLink}
            className="px-3.5 py-2 bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
            title="Sao chép link làm bài gửi học sinh"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Đã sao chép link!' : 'Copy link học sinh'}</span>
          </button>

          <button
            type="button"
            onClick={() => fetchTeacherData()}
            disabled={loading}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>

          <button
            type="button"
            onClick={onBackToStudent}
            className="px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Xem giao diện học sinh
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Thẻ Thống Kê Tổng Quan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Tổng bài đã nộp</p>
            <p className="text-2xl font-black text-slate-800">{totalCount} <span className="text-sm font-medium text-slate-500">học sinh</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Điểm trung bình lớp</p>
            <p className="text-2xl font-black text-slate-800">{totalCount > 0 ? avgScore : '0'} <span className="text-sm font-medium text-slate-500">/ 10 điểm</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Tình trạng hệ thống</p>
            <p className="text-sm font-bold text-slate-800">
              {totalCount === 0 ? 'Dữ liệu rỗng (chưa có bài)' : 'Đang nhận bài trực tuyến'}
            </p>
          </div>
        </div>
      </div>

      {/* PHẦN 13: BIỂU ĐỒ CỘT “TỈ LỆ HỌC SINH LÀM SAI TỪNG CÂU” */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>BIỂU ĐỒ CỘT: TỈ LỆ HỌC SINH LÀM SAI TỪNG CÂU</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Công thức: Chiều cao cột = (Số học sinh làm sai câu đó ÷ Số học sinh đã nộp) × 100%
            </p>
          </div>
          {totalCount > 0 && (
            <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
              Dựa trên {totalCount} bài nộp thực tế
            </span>
          )}
        </div>

        {/* Kiểm tra: Nếu chưa có bài nộp nào thì ghi “chưa có dữ liệu”, không vẽ số khống */}
        {totalCount === 0 ? (
          <div className="py-12 text-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-300">
            <BarChart3 className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <h3 className="text-base font-bold text-slate-600">Chưa có dữ liệu</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Chưa có học sinh nào nộp bài. Khi học sinh làm bài và nộp, biểu đồ tỉ lệ làm sai của từng câu sẽ tự động hiển thị tại đây.
            </p>
          </div>
        ) : (
          /* Biểu đồ cột trực quan */
          <div className="space-y-6 pt-2">
            <div className="grid grid-cols-5 gap-2 sm:gap-4 items-end h-64 border-b border-slate-200 pb-2 px-2">
              {questionStats.map((qs) => {
                const rate = qs.wrongRate; // 0 to 100%
                const barHeight = Math.max(rate, 4); // Ít nhất 4% để thấy đế nếu 0%

                // Màu cột cảnh báo: nếu sai nhiều thì đỏ, vừa thì vàng, ít hoặc 0% thì xanh lá
                let barColor = 'bg-emerald-500 hover:bg-emerald-600';
                if (rate > 50) barColor = 'bg-rose-500 hover:bg-rose-600';
                else if (rate > 20) barColor = 'bg-amber-500 hover:bg-amber-600';

                return (
                  <div key={qs.questionId} className="flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip khi di chuột */}
                    <div className="opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity absolute -top-14 z-20 bg-slate-900 text-white text-xs rounded-lg py-1.5 px-2.5 shadow-lg whitespace-nowrap">
                      <div>Câu {qs.questionId}: {qs.wrongCount}/{totalCount} em sai</div>
                      <div className="font-bold text-yellow-300">Tỉ lệ sai: {rate}%</div>
                      <div className="text-[10px] text-slate-300">Đáp án đúng: {qs.correctAnswer}</div>
                    </div>

                    {/* Số % trên đỉnh cột */}
                    <span className="text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                      {rate}%
                    </span>

                    {/* Thanh cột */}
                    <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-44">
                      <div
                        className={`w-full ${barColor} rounded-t-lg transition-all duration-500 flex items-center justify-center text-white text-[10px] font-bold`}
                        style={{ height: `${barHeight}%` }}
                      />
                    </div>

                    {/* Nhãn câu hỏi ở chân cột */}
                    <span className="text-xs sm:text-sm font-bold text-slate-800 mt-2 block">
                      Câu {qs.questionId}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Đ/án: {qs.correctAnswer}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bảng chi tiết phân tích lỗi sai từng câu */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
              {questionStats.map((qs) => (
                <div key={qs.questionId} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Câu {qs.questionId}</span>
                    <span className={qs.wrongRate > 0 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                      Sai: {qs.wrongRate}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Số em sai: <strong className="text-slate-700">{qs.wrongCount}</strong> / {totalCount}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Số em đúng: <strong className="text-emerald-700">{qs.correctCount}</strong>
                  </p>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                    A: {qs.optionCounts.A} | B: {qs.optionCounts.B} | C: {qs.optionCounts.C} | D: {qs.optionCounts.D}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PHẦN 12: BẢNG KẾT QUẢ CẢ LỚP */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>BẢNG KẾT QUẢ CẢ LỚP</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chỉ ghi nhận và hiển thị các bài nộp thật của học sinh
            </p>
          </div>

          {/* Công cụ tìm kiếm và lọc sắp xếp */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm tên hoặc lớp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (sortField === 'score') {
                  setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
                } else {
                  setSortField('score');
                  setSortOrder('desc');
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center space-x-1 cursor-pointer ${
                sortField === 'score'
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Xếp theo điểm ({sortField === 'score' && sortOrder === 'asc' ? 'Tăng' : 'Giảm'})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (sortField === 'time') {
                  setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
                } else {
                  setSortField('time');
                  setSortOrder('desc');
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center space-x-1 cursor-pointer ${
                sortField === 'time'
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Xếp theo giờ ({sortField === 'time' && sortOrder === 'asc' ? 'Cũ nhất' : 'Mới nhất'})</span>
            </button>
          </div>
        </div>

        {/* Nội dung bảng */}
        {totalCount === 0 ? (
          <div className="py-14 text-center bg-slate-50/70 rounded-2xl border border-slate-200">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <h3 className="text-base font-bold text-slate-700">Chưa có bài nộp nào</h3>
            <p className="text-xs text-slate-400 mt-1">
              Cơ sở dữ liệu đang rỗng. Hãy chia sẻ link để học sinh bắt đầu làm bài!
            </p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-sm">
            Không tìm thấy học sinh nào phù hợp với từ khóa "{searchTerm}".
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-center w-12">STT</th>
                  <th className="px-4 py-3">Họ và Tên</th>
                  <th className="px-4 py-3 text-center">Lớp</th>
                  <th className="px-4 py-3 text-center">Số câu đúng</th>
                  <th className="px-4 py-3 text-center">Điểm (thang 10)</th>
                  <th className="px-4 py-3">Nhận xét</th>
                  <th className="px-4 py-3">Thời gian nộp</th>
                  <th className="px-4 py-3 text-center">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredSubmissions.map((sub, idx) => (
                  <tr key={sub.id} className="hover:bg-blue-50/40 transition">
                    <td className="px-4 py-3 text-center font-semibold text-slate-500 text-xs">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">
                      {sub.studentName}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-blue-700">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-xs">
                        {sub.studentClass}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-700">
                      {sub.scoreRaw} / 5 câu
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                          sub.scoreScale10 >= 8
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : sub.scoreScale10 >= 6
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : sub.scoreScale10 >= 4
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {sub.scoreScale10} đ
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 italic">
                      "{sub.feedback}"
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 font-mono">
                      {sub.submittedAtFormatted}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedSubmission(sub)}
                        className="p-1.5 bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 rounded-lg transition cursor-pointer"
                        title="Xem chi tiết bài làm của học sinh"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Chức năng quản trị an toàn cho giáo viên */}
        {totalCount > 0 && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Dữ liệu lưu trữ an toàn trên máy chủ backend.</span>
            <button
              type="button"
              onClick={handleResetData}
              className="text-rose-600 hover:text-rose-800 font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa toàn bộ bài nộp (Đưa về trạng thái rỗng ban đầu)</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal xem chi tiết bài làm của từng học sinh */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Chi tiết bài làm: {selectedSubmission.studentName}
                </h3>
                <p className="text-xs text-slate-500">
                  Lớp: {selectedSubmission.studentClass} • Điểm: <strong className="text-blue-700">{selectedSubmission.scoreScale10}/10 đ</strong> ({selectedSubmission.scoreRaw}/5 câu đúng)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedSubmission.results.map((res, index) => (
                <div
                  key={res.questionId}
                  className={`p-4 rounded-xl border ${
                    res.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  {res.passage && (
                    <div className="mb-2 p-2 rounded bg-amber-50 text-amber-900 text-xs">
                      {res.passage}
                    </div>
                  )}
                  <p className="text-sm font-bold text-slate-800 mb-2">
                    Câu {index + 1}: {res.question}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs mb-2">
                    <span className="font-semibold text-slate-600">
                      Em chọn: <strong className={res.isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>{res.selectedAnswer || 'Bỏ trống'}</strong>
                    </span>
                    <span className="font-semibold text-slate-600">
                      Đáp án đúng: <strong className="text-emerald-700 font-bold">{res.correctAnswer}</strong>
                    </span>
                    <span className={res.isCorrect ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                      {res.isCorrect ? '✓ Đúng' : '✗ Sai'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <strong className="text-blue-700">Giải thích:</strong> {res.explanation}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 text-right">
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-bold transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
