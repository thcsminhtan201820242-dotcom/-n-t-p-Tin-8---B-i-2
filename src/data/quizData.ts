/**
 * Dữ liệu bài ôn trắc nghiệm môn Tin học 8
 * 5 câu hỏi chuẩn xác theo đề bài của giáo viên
 */

export interface Question {
  id: number;
  passage?: string; // Đoạn văn / tình huống (nếu có, ví dụ câu 5)
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export const QUIZ_DURATION_MINUTES = 5; // Dễ dàng thay đổi thời gian đếm ngược tại đây

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Khi Khoa chụp lại bức ảnh ruộng bậc thang và gửi cho An qua thư điện tử, đặc điểm nào của thông tin số được thể hiện rõ nhất?",
    options: [
      { key: 'A', text: "Bức ảnh gốc của Khoa sẽ tự động mất đi sau khi gửi cho An." },
      { key: 'B', text: "Thông tin số dễ dàng được nhân bản và chia sẻ mà người gửi không bị mất đi bức ảnh gốc." },
      { key: 'C', text: "Thông tin số chỉ có thể lưu trữ trên một thiết bị duy nhất." },
      { key: 'D', text: "Thông tin số không thể gửi đi xa nếu không gặp trực tiếp người nhận." }
    ],
    correctAnswer: 'B',
    explanation: "Vì sao B đúng: Bức ảnh số được tạo ra không tốn vật liệu và khi Khoa gửi cho An, Khoa không bị mất đi bức ảnh gốc. Thông tin số có đặc điểm nổi bật là dễ dàng được nhân bản, sao chép và chia sẻ qua môi trường kỹ thuật số."
  },
  {
    id: 2,
    question: "Vì sao người sử dụng Internet cần phải cẩn trọng và có trách nhiệm khi chia sẻ hay đăng tải thông tin lên môi trường mạng?",
    options: [
      { key: 'A', text: "Vì thông tin số một khi đã đăng tải thì dễ dàng bị lan truyền và rất khó bị xóa bỏ hoàn toàn." },
      { key: 'B', text: "Vì dung lượng lưu trữ của máy chủ Internet sẽ bị quá tải ngay lập tức." },
      { key: 'C', text: "Vì mọi thông tin số sẽ tự động bị thay đổi nội dung sau vài giờ." },
      { key: 'D', text: "Vì các tệp thông tin số chỉ tồn tại được trong một ngày rồi tự biến mất." }
    ],
    correctAnswer: 'A',
    explanation: "Vì sao A đúng: Thông tin số khi được chia sẻ lên mạng xã hội hay ứng dụng nhắn tin sẽ được lưu trữ, đồng bộ và tiếp tục lan truyền nhanh chóng đến nhiều người, khiến thông tin đó rất khó bị xóa bỏ hoàn toàn. Do đó, người dùng cần quản lý, khai thác an toàn và có trách nhiệm."
  },
  {
    id: 3,
    question: "Để kiểm tra tính đáng tin cậy của một bài viết trên mạng, tiêu chí đánh giá \"Tính thời sự của thông tin\" yêu cầu người đọc thực hiện điều gì?",
    options: [
      { key: 'A', text: "Đếm số lượt yêu thích (like) và lượt chia sẻ (share) của bài viết." },
      { key: 'B', text: "Xem xét thời điểm công bố hoặc lần cập nhật gần nhất của thông tin." },
      { key: 'C', text: "Kiểm tra xem bài viết có sử dụng nhiều hình ảnh minh họa hay không." },
      { key: 'D', text: "Đánh giá xem giao diện trang web có màu sắc bắt mắt hay không." }
    ],
    correctAnswer: 'B',
    explanation: "Vì sao B đúng: Thời điểm công bố thông tin rất quan trọng vì nó quyết định thông tin đó còn giá trị hay đã trở nên lỗi thời. Những nội dung trên trang web đã lâu không được cập nhật thường có độ tin cậy thấp."
  },
  {
    id: 4,
    question: "Trong các phát biểu sau đây, phát biểu nào phản ánh một sự kiện/dữ kiện khách quan chứ không phải ý kiến chủ quan?",
    options: [
      { key: 'A', text: "\"Môn Tin học 8 là môn học hay nhất và thú vị nhất.\"" },
      { key: 'B', text: "\"Bộ phim hoạt hình này rất đáng xem đối với lứa tuổi học sinh.\"" },
      { key: 'C', text: "\"Năm 1642, Blaise Pascal đã sáng chế ra chiếc máy tính cơ khí Pascaline.\"" },
      { key: 'D', text: "\"Tôi tin rằng việc học trực tuyến hiệu quả hơn học trực tiếp.\"" }
    ],
    correctAnswer: 'C',
    explanation: "Vì sao C đúng: Phát biểu C trình bày một sự kiện lịch sử cụ thể, có mốc thời gian và bằng chứng thực tế kiểm chứng được, nên đó là sự kiện khách quan."
  },
  {
    id: 5,
    passage: "Tình huống: Học sinh A thấy một bài quảng cáo trên mạng xã hội khẳng định: \"Uống loại trà thảo mộc này sẽ giúp thông minh hơn và đạt điểm tối đa mọi kỳ thi mà không cần học bài\".",
    question: "Cách xử lý nào sau đây thể hiện kỹ năng đánh giá thông tin khoa học và chuẩn xác nhất?",
    options: [
      { key: 'A', text: "Tin tưởng ngay vì bài viết nhận được hàng nghìn bình luận khen ngợi từ các tài khoản trên mạng." },
      { key: 'B', text: "Tìm kiếm bằng chứng khoa học, đối chứng thông tin từ các nguồn uy tín (như Bộ Y tế, chuyên gia) và phân biệt lời quảng cáo phóng đại với thực tế." },
      { key: 'C', text: "Mua về dùng thử ngay lập tức vì trang web thiết kế rất đẹp mắt và chuyên nghiệp." },
      { key: 'D', text: "Vội vàng chia sẻ ngay cho bạn bè cùng lớp vì nghĩ thông tin này có lợi." }
    ],
    correctAnswer: 'B',
    explanation: "Vì sao B đúng: Người bán hàng hoặc sản xuất có thể phóng đại lợi ích của dịch vụ hay sản phẩm. Để xác định thông tin đáng tin cậy, học sinh cần phối hợp các kỹ năng: kiểm tra thẩm quyền/uy tín của nguồn cấp, kiểm tra chứng cứ của kết luận và phân biệt giữa nhận xét chủ quan với sự thật khách quan. Việc này giúp đưa ra quyết định đúng đắn và tránh lãng phí hay rủi ro."
  }
];

export function getFeedbackMessage(correctCount: number): string {
  if (correctCount === 5) {
    return "Em thật xuất sắc";
  } else if (correctCount >= 3) {
    return "Em nắm vững kiến thức";
  } else if (correctCount >= 1) {
    return "Em cần xem lại nội dung bài học";
  } else {
    return " Em cần cố gắng nhiều hơn";
  }
}
