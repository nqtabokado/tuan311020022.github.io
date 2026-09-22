// Bộ câu hỏi tự kiểm tra. "answer" là CHỈ SỐ của đáp án đúng trong mảng options.
// "explain" hiện ra sau khi nộp bài, kể cả khi làm đúng — đọc lời giải vẫn
// có ích hơn là chỉ thấy dấu tick.
export default [
  {
    id: "q1",
    question: "Các job trong cùng một workflow mặc định chạy thế nào?",
    options: [
      "Tuần tự từ trên xuống theo thứ tự khai báo",
      "Song song, trừ khi khai báo needs",
      "Song song, và không thể bắt chạy tuần tự",
    ],
    answer: 1,
    explain:
      "Mặc định các job chạy song song trên các máy ảo khác nhau. Muốn job B chờ job A " +
      "thì phải khai báo needs: A.",
  },
  {
    id: "q2",
    question: "Job build-and-push phải checkout lại code, vì sao?",
    options: [
      "Vì code trong job trước đã bị xoá khỏi GitHub",
      "Vì mỗi job chạy trên một máy ảo riêng, không thấy file của job khác",
      "Vì actions/checkout bắt buộc phải gọi 2 lần",
    ],
    answer: 1,
    explain:
      "Mỗi job được cấp một máy ảo mới và sạch. Muốn chuyển file giữa các job thì phải " +
      "dùng artifact (upload-artifact / download-artifact).",
  },
  {
    id: "q3",
    question: "Khác nhau cơ bản giữa RUN và CMD trong Dockerfile?",
    options: [
      "RUN chạy lúc build, CMD chạy lúc khởi động container",
      "RUN chạy lúc khởi động container, CMD chạy lúc build",
      "Hai lệnh giống hệt nhau, chỉ khác tên",
    ],
    answer: 0,
    explain:
      "RUN thực thi lúc build và kết quả được ghi vào image (ví dụ: cài thư viện). " +
      "CMD là lệnh mặc định chạy mỗi khi bật container (ví dụ: khởi động app).",
  },
  {
    id: "q4",
    question: "Vì sao nên COPY package*.json và chạy npm ci TRƯỚC khi COPY toàn bộ code?",
    options: [
      "Vì npm bắt buộc phải như vậy mới chạy được",
      "Để layer cài thư viện được tái sử dụng từ cache khi chỉ sửa code",
      "Để image cuối cùng nhỏ hơn",
    ],
    answer: 1,
    explain:
      "Docker cache theo layer và hỏng cache từ lệnh đầu tiên có thay đổi trở xuống. " +
      "Tách phần ít đổi (danh sách thư viện) lên trên giúp sửa code không làm cài lại từ đầu.",
  },
  {
    id: "q5",
    question: "Deploy production nên dùng tag nào?",
    options: [
      ":latest cho tiện, luôn là bản mới nhất",
      "Tag theo commit SHA hoặc version cố định",
      "Không cần tag, image nào cũng như nhau",
    ],
    answer: 1,
    explain:
      ":latest bị ghi đè mỗi lần build nên bạn không biết production đang chạy commit nào, " +
      "và không có bản cũ để rollback. Tag SHA hoặc v1.2.0 thì cố định vĩnh viễn.",
  },
  {
    id: "q6",
    question: "Mở một Pull Request vào main thì điều gì xảy ra với pipeline của repo này?",
    options: [
      "Cả 3 job đều chạy, image được đẩy lên ghcr.io",
      "Chỉ 2 job CI chạy, job build-and-push bị bỏ qua",
      "Không job nào chạy cho tới khi PR được merge",
    ],
    answer: 1,
    explain:
      "Job build-and-push có điều kiện if: github.event_name == 'push', mà PR là sự kiện " +
      "pull_request nên nó bị skip. Code chưa duyệt thì chưa phát hành.",
  },
];
