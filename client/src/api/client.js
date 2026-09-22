import axios from "axios";

// baseURL lấy từ biến môi trường VUE_APP_API_BASE_URL (xem file .env).
// Vue CLI nhúng sẵn giá trị này vào bundle lúc build, nên đổi API
// thì phải build lại, không sửa được khi app đang chạy.
const http = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || "http://localhost:5000",
  timeout: 5000,
});

export default {
  // GET / -> { message: "..." }
  getGreeting() {
    return http.get("/").then((res) => res.data);
  },

  // GET /health -> { status: "ok" }
  getHealth() {
    return http.get("/health").then((res) => res.data);
  },

  // GET /sum/<a>/<b> -> { a, b, result }
  sum(a, b) {
    return http.get(`/sum/${a}/${b}`).then((res) => res.data);
  },
};
