# Vue 2 + Flask CI/CD Demo

Project nhỏ để tự học CI/CD với GitHub Actions + Docker.
Gồm 2 phần tách rời:

- **client** (Vue 2) — trang **lý thuyết CI/CD & Docker**, kèm phần gọi API thật và bài tự kiểm tra.
- **server** (Flask) — API mà client gọi sang.

Trang client cố ý nói về đúng pipeline đang chạy trong repo này, nên đọc lý thuyết xong là mở [ci-cd.yml](.github/workflows/ci-cd.yml) ra đối chiếu được ngay.

## Cấu trúc

```
.
├── client/                     # Frontend — Vue 2 (Vue CLI 5)
│   ├── src/
│   │   ├── content/
│   │   │   ├── lessons.js      # TOÀN BỘ nội dung lý thuyết (dạng dữ liệu)
│   │   │   └── quiz.js         # Câu hỏi tự kiểm tra
│   │   ├── components/
│   │   │   ├── TheSidebar.vue      # mục lục, gom nhóm + tô sáng mục đang đọc
│   │   │   ├── LessonSection.vue   # khung một bài học
│   │   │   ├── ContentBlock.vue    # render 1 block theo type (p/code/table/note...)
│   │   │   ├── ApiDemo.vue         # gọi API Flask thật để minh hoạ
│   │   │   └── QuizBox.vue         # chấm điểm + hiện lời giải
│   │   ├── api/client.js       # Lớp gọi API bằng axios
│   │   ├── App.vue
│   │   └── main.js
│   ├── tests/unit/             # Unit test bằng Jest + @vue/test-utils
│   ├── public/index.html
│   ├── .env                    # VUE_APP_API_BASE_URL
│   ├── vue.config.js
│   ├── Dockerfile              # build bằng Node -> phục vụ tĩnh bằng nginx
│   └── nginx.conf
│
├── server/                     # Backend — Flask
│   ├── app/__init__.py         # Flask app (factory pattern) + CORS
│   ├── tests/test_app.py       # Unit test bằng pytest
│   ├── run.py                  # Điểm chạy app
│   ├── requirements.txt        # Dependency cho production
│   ├── requirements-dev.txt    # Thêm pytest, flake8 để test/lint
│   └── Dockerfile
│
├── docker-compose.yml          # Chạy cả 2 phần bằng 1 lệnh
└── .github/workflows/ci-cd.yml # Pipeline CI/CD
```

## API hiện có

| Method | Đường dẫn | Trả về |
|---|---|---|
| GET | `/` | `{ "message": "..." }` |
| GET | `/health` | `{ "status": "ok" }` |
| GET | `/sum/<int:a>/<int:b>` | `{ "a": 2, "b": 3, "result": 5 }` |

Server bật **CORS** (`Flask-Cors`) vì client chạy ở cổng khác (8080), trình duyệt sẽ chặn request nếu không có header CORS.

## Chạy thử ở local

Cần **2 terminal**: một cho server, một cho client.

### Terminal 1 — server (Flask)

```bash
cd server
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt

python -m pytest -v              # chạy test
python run.py                    # chạy app -> http://localhost:5000
```

### Terminal 2 — client (Vue 2)

```bash
cd client
npm install

npm run test:unit                # chạy test
npm run lint                     # kiểm tra style
npm run serve                    # chạy dev server -> http://localhost:8080
```

Mở http://localhost:8080.

Phần lý thuyết là nội dung tĩnh nên **đọc được kể cả khi server Flask chưa chạy** — chỉ riêng mục "Gọi API Flask thật" sẽ báo "Không gọi được API".

### Sửa nội dung bài học

Toàn bộ chữ nghĩa nằm ở [client/src/content/lessons.js](client/src/content/lessons.js), tách hẳn khỏi giao diện. Thêm một bài là thêm một object vào mảng, không phải đụng tới component nào:

```js
{
  id: "bai-moi",            // dùng làm anchor #bai-moi, không được trùng
  part: "Docker",           // nhóm hiển thị ở mục lục
  title: "Tên bài",
  blocks: [
    { type: "p", text: "Một đoạn văn." },
    { type: "code", lang: "bash", text: "docker ps" },
    { type: "table", head: ["A", "B"], rows: [["a1", "b1"]] },
    { type: "note", tone: "warn", text: "Điều cần cẩn thận." },
  ],
}
```

Các `type` hợp lệ: `p`, `list`, `steps`, `code`, `table`, `note`. Gõ sai type thì test `lessons.spec.js` sẽ báo đỏ, và trang cũng in ra chỗ sai thay vì im lặng bỏ qua.

> Muốn trỏ client sang API khác thì sửa `VUE_APP_API_BASE_URL` trong [client/.env](client/.env). Giá trị này được **nhúng vào bundle lúc build**, nên sửa xong phải chạy lại `npm run serve` / `npm run build`.

## Chạy bằng Docker

```bash
docker compose up --build
# Web Vue : http://localhost:8080
# API     : http://localhost:5000
```

Hoặc build từng image:

```bash
docker build -t demo-server ./server
docker run -p 5000:5000 demo-server

docker build -t demo-client ./client
docker run -p 8080:80 demo-client
```

## Pipeline CI/CD

Xem [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml) (đã chú thích từng dòng) và [README_CI_CD.md](README_CI_CD.md) (phần lý thuyết).

```
push / PR vào main
       │
       ├──────────────┬──────────────┐
       ▼              ▼              │
 test-server     test-client         │   2 job CI chạy song song
 flake8          eslint              │
 pytest          jest + build        │
       │              │              │
       └──────┬───────┘              │
              ▼ cả hai pass          │
      build-and-push (CD)  ◀─────────┘
      build 2 image, chỉ khi push vào main
```

| Job | Chạy khi nào | Làm gì |
|---|---|---|
| `test-server` | push & PR | `flake8` + `pytest` trong `server/` |
| `test-client` | push & PR | `eslint` + `jest` + `npm run build` trong `client/` |
| `build-and-push` | chỉ khi **push vào main** và cả 2 job trên pass | Build & push 2 Docker image lên `ghcr.io` |

Job CD dùng `strategy.matrix` để chạy 2 lượt (server và client) thay vì viết lặp các bước build.

## Thiết lập CI/CD trên GitHub

1. Tạo repo mới trên GitHub, push toàn bộ project lên (nhánh `main`).
2. **Không cần tạo secret nào cả** — pipeline dùng `GITHUB_TOKEN` có sẵn để đẩy image lên **GitHub Container Registry (ghcr.io)**.
3. Mỗi lần push hoặc mở Pull Request vào `main`: 2 job CI chạy lint + test cho cả client lẫn server.
4. Khi push thẳng vào `main` (và cả 2 job CI pass): job `build-and-push` build 2 image và đẩy lên:
   - `ghcr.io/<username>/<repo>/server`
   - `ghcr.io/<username>/<repo>/client`

   Mỗi image có 2 tag: `latest` và tag theo commit SHA.
5. Xem image đã push ở đâu: vào trang GitHub profile/repo của bạn → tab **Packages**.
6. Image mặc định ở chế độ **private**. Muốn pull công khai (không cần đăng nhập), vào package đó → **Package settings** → **Change visibility** → Public.

### Kéo image về chạy thử (sau khi đã public, hoặc đã `docker login ghcr.io`)

```bash
docker pull ghcr.io/<username>/<repo>/server:latest
docker run -p 5000:5000 ghcr.io/<username>/<repo>/server:latest
```

> Image client được build với `VUE_APP_API_BASE_URL=http://localhost:5000`. Deploy lên server thật thì phải build lại với `--build-arg VUE_APP_API_BASE_URL=https://api-cua-ban.com`.

## Các bước học gợi ý (tăng dần độ khó)

1. **Bước 1 – CI cơ bản (đã có sẵn)**: mỗi lần push/PR, cả client và server được lint + test tự động.
2. **Bước 2 – Badge trạng thái**: thêm badge CI vào README để thấy pass/fail trực quan.
3. **Bước 3 – CD build image (đã có sẵn)**: build & push Docker image lên ghcr.io khi merge vào `main`.
4. **Bước 4 – Deploy thật**: thêm job deploy image lên một nền tảng free như Render, Railway, Fly.io, hoặc SSH vào VPS rồi `docker pull && docker run`.
5. **Bước 5 – Môi trường staging/production**: dùng GitHub Environments, yêu cầu approve thủ công trước khi deploy production.
6. **Bước 6 – Versioning & rollback**: gắn tag semantic version (`v1.0.0`), học cách rollback về image cũ khi lỗi.
7. **Bước 7 – E2E test**: thêm job chạy server Flask thật rồi dùng Cypress/Playwright kiểm tra client gọi API đúng.

## Ghi chú

- Workflow có 3 job; job CD phụ thuộc cả 2 job CI (`needs: [test-server, test-client]`) — đúng tinh thần CI/CD: không bao giờ build/deploy code chưa qua test.
- Unit test của client **mock** module `src/api/client.js`, nên chạy được mà không cần server Flask — CI nhờ vậy nhanh và không "đỏ" vì lý do vặt.
- Nội dung bài học được test như dữ liệu: trùng `id`, sai `type`, bảng lệch số cột đều bị bắt trong [lessons.spec.js](client/tests/unit/lessons.spec.js).
- [README_CI_CD.md](README_CI_CD.md) là bản văn bản đầy đủ hơn; trang client là bản rút gọn, có tương tác.
- Nếu sau này muốn đổi sang Docker Hub, chỉ cần thay lại bước login/tag trong `ci-cd.yml` và thêm 2 secret `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`.
