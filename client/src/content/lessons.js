// ============================================================================
// Toàn bộ NỘI DUNG lý thuyết của trang nằm ở đây, tách hẳn khỏi giao diện.
// Muốn thêm/sửa bài học thì chỉ động vào file này, không phải đụng component.
//
// Mỗi bài (section) gồm nhiều "block". Mỗi block có trường "type",
// ContentBlock.vue dựa vào type đó để chọn cách hiển thị:
//
//   p     — đoạn văn
//   list  — danh sách gạch đầu dòng
//   steps — danh sách đánh số
//   code  — khối code (kèm nhãn ngôn ngữ)
//   table — bảng
//   note  — khung ghi chú (tone: "info" | "warn")
//
// Code mẫu nhiều dòng được viết bằng mảng chuỗi rồi .join("\n"), cố ý KHÔNG
// dùng template literal (dấu backtick). Lý do: trong template literal, ${...}
// là cú pháp nội suy biến của JavaScript, nên code mẫu của GitHub Actions có
// ${{ }} sẽ bị hiểu nhầm là biến và làm vỡ file. Dùng chuỗi thường thì ${{ }}
// chỉ là ký tự bình thường, không phải escape gì cả.
// ============================================================================

export default [
  // ==========================================================================
  // PHẦN 1 — CI/CD
  // ==========================================================================
  {
    id: "ci-cd-la-gi",
    part: "CI/CD",
    title: "CI/CD là gì?",
    blocks: [
      {
        type: "p",
        text:
          "Ngày xưa, lập trình viên viết code cả tháng rồi mới gộp vào nhánh chính. " +
          "Lúc gộp mới phát hiện code của mỗi người đá nhau, sửa mất cả tuần. " +
          "CI/CD sinh ra để giải quyết đúng chuyện đó: gộp sớm, gộp thường xuyên, và để MÁY kiểm tra thay người.",
      },
      {
        type: "table",
        head: ["Chữ viết tắt", "Tên đầy đủ", "Nghĩa"],
        rows: [
          [
            "CI",
            "Continuous Integration",
            "Mỗi lần đẩy code lên, hệ thống tự lấy code về, cài thư viện, chạy lint và test.",
          ],
          [
            "CD",
            "Continuous Delivery",
            "Code qua test thì tự đóng gói thành bản phát hành, chờ người bấm nút deploy.",
          ],
          [
            "CD",
            "Continuous Deployment",
            "Mạnh hơn một bậc: đóng gói xong tự deploy lên production luôn, không cần ai bấm.",
          ],
        ],
      },
      {
        type: "note",
        tone: "info",
        text:
          "Repo này dừng ở Continuous Delivery: pipeline build Docker image và đẩy lên registry, " +
          "nhưng chưa tự deploy lên server nào. Đó là bước học tiếp theo.",
      },
      {
        type: "p",
        text: "Cái lợi thật sự của CI không nằm ở chỗ 'tự động cho oai', mà ở vòng phản hồi:",
      },
      {
        type: "list",
        items: [
          "Lỗi bị bắt sau 3 phút, lúc bạn còn nhớ mình vừa sửa gì — thay vì sau 3 tuần.",
          "Nhánh main luôn ở trạng thái chạy được, vì code hỏng không qua được cổng test.",
          "Không còn cảnh 'máy tôi chạy được mà' — CI chạy trên máy ảo sạch, giống nhau mọi lần.",
        ],
      },
    ],
  },

  {
    id: "workflow-job-step",
    part: "CI/CD",
    title: "Workflow → Job → Step",
    blocks: [
      {
        type: "p",
        text:
          "GitHub Actions có đúng 3 tầng. Nắm được 3 tầng này là đọc được mọi file .yml của người khác.",
      },
      {
        type: "code",
        lang: "cấu trúc",
        text: [
          "Workflow  (1 file .yml trong .github/workflows/)",
          " └── kích hoạt bởi Event  (on: push, pull_request, ...)",
          " └── gồm nhiều Job        (mỗi job = 1 máy ảo riêng)",
          "      └── gồm nhiều Step  (chạy tuần tự trong cùng 1 máy)",
          "           └── mỗi step là:",
          '                run:  "lệnh shell"',
          '                uses: "action người khác viết sẵn"',
        ].join("\n"),
      },
      {
        type: "table",
        head: ["Khái niệm", "Giải thích", "Ví dụ trong repo này"],
        rows: [
          ["Workflow", "Một quy trình tự động, định nghĩa trong 1 file YAML", "name: CI/CD"],
          ["Event", "Sự kiện kích hoạt workflow", "on: push / on: pull_request"],
          ["Job", "Một nhóm step chạy trên cùng 1 máy", "test-server, test-client, build-and-push"],
          ["Runner", "Máy ảo chạy job, GitHub cấp mới mỗi lần rồi xoá", "runs-on: ubuntu-latest"],
          ["Step", "Một bước trong job", "Checkout code, Run tests"],
          ["Action", "Đoạn code dùng lại được do người khác viết", "actions/checkout@v4"],
        ],
      },
      {
        type: "note",
        tone: "warn",
        text:
          "Ba điều hay bị hiểu sai: (1) các job mặc định chạy SONG SONG, muốn tuần tự phải khai báo needs; " +
          "(2) mỗi job một máy ảo riêng, job sau KHÔNG thấy file job trước tạo ra, nên phải checkout lại; " +
          "(3) các step trong cùng một job thì dùng chung máy, file step trước tạo thì step sau dùng được.",
      },
    ],
  },

  {
    id: "event-trigger",
    part: "CI/CD",
    title: "Event: khi nào pipeline chạy?",
    blocks: [
      {
        type: "table",
        head: ["Event", "Chạy khi nào", "Dùng để"],
        rows: [
          ["push", "Có commit đẩy lên nhánh được chỉ định", "Chạy CI, rồi build/deploy"],
          ["pull_request", "Mở hoặc cập nhật PR", "Kiểm tra code TRƯỚC khi cho merge"],
          ["workflow_dispatch", "Người dùng bấm nút trên giao diện", "Deploy thủ công, chạy lại tay"],
          ["schedule", "Theo lịch cron", "Chạy test định kỳ hằng đêm"],
          ["release", "Khi tạo release mới", "Phát hành bản chính thức"],
        ],
      },
      {
        type: "code",
        lang: "yaml",
        text: [
          "on:",
          "  push:",
          '    branches: ["main"]',
          "  pull_request:",
          '    branches: ["main"]',
        ].join("\n"),
      },
      {
        type: "note",
        tone: "info",
        text:
          "Merge một Pull Request vào main CŨNG là một lần push vào main. " +
          "Vì vậy sau khi bạn bấm Merge, job CD sẽ chạy — nhiều người tưởng nó không chạy.",
      },
    ],
  },

  {
    id: "needs-cong-chan",
    part: "CI/CD",
    title: "Nối CI với CD bằng needs",
    blocks: [
      {
        type: "p",
        text:
          "Nguyên tắc sống còn của CI/CD: code chưa qua kiểm tra thì KHÔNG BAO GIỜ được phát hành. " +
          "Trong GitHub Actions, thứ thực thi nguyên tắc đó là từ khoá needs.",
      },
      {
        type: "code",
        lang: "yaml",
        text: [
          "build-and-push:",
          "  # Chờ CẢ HAI job kia xong VÀ thành công mới chạy.",
          "  # Chỉ cần 1 job fail là job này bị bỏ qua (skipped).",
          "  needs: [test-server, test-client]",
          "",
          "  # Điều kiện thêm: chỉ build khi là push vào main,",
          "  # nên khi mở PR thì chỉ chạy CI chứ không phát hành.",
          "  if: github.event_name == 'push' && github.ref == 'refs/heads/main'",
        ].join("\n"),
      },
      {
        type: "p",
        text:
          "needs chỉ dùng được khi các job nằm CÙNG một file workflow. Nếu bạn tách CI và CD ra 2 file, " +
          "phải dùng workflow_run — phức tạp hơn, và gõ lệch tên workflow một chữ là CD không bao giờ chạy.",
      },
    ],
  },

  {
    id: "lint-va-test",
    part: "CI/CD",
    title: "Lint khác Test thế nào?",
    blocks: [
      {
        type: "table",
        head: ["", "Lint", "Test"],
        rows: [
          ["Có chạy code không?", "Không — chỉ đọc code", "Có — chạy code thật"],
          ["Bắt loại lỗi nào?", "Style, import thừa, biến không dùng, cú pháp đáng ngờ", "Logic sai: hàm trả về kết quả không đúng"],
          ["Công cụ ở repo này", "flake8 (Python), ESLint (Vue)", "pytest (Python), Jest (Vue)"],
          ["Tốc độ", "Rất nhanh (vài giây)", "Chậm hơn (giây đến phút)"],
        ],
      },
      {
        type: "note",
        tone: "info",
        text:
          "Luôn đặt lint TRƯỚC test. Lint nhanh hơn nhiều, nên nếu code sai style thì pipeline " +
          "báo đỏ sau vài giây thay vì bắt bạn chờ hết bộ test.",
      },
      {
        type: "note",
        tone: "warn",
        text:
          "Trong CI, đừng để lint tự sửa code (--fix). CI sửa hộ thì lỗi bị giấu đi, " +
          "lần sau bạn vẫn commit sai y như cũ. Để CI BÁO lỗi, còn sửa thì sửa ở máy mình.",
      },
    ],
  },

  // ==========================================================================
  // PHẦN 2 — DOCKER
  // ==========================================================================
  {
    id: "docker-la-gi",
    part: "Docker",
    title: "Docker giải quyết vấn đề gì?",
    blocks: [
      {
        type: "p",
        text:
          'Câu nói kinh điển: "máy tôi chạy được mà". App của bạn chạy ngon ở local vì máy bạn có Python 3.12, ' +
          "có đúng version thư viện, có biến môi trường đã set. Máy người khác thiếu một thứ là hỏng. " +
          "Docker đóng gói app CÙNG VỚI toàn bộ môi trường chạy của nó thành một gói duy nhất.",
      },
      {
        type: "table",
        head: ["Khái niệm", "Là gì", "Ví von"],
        rows: [
          ["Dockerfile", "File text ghi các bước để dựng môi trường", "Công thức nấu ăn"],
          ["Image", "Kết quả build ra từ Dockerfile, bất biến, copy đi đâu cũng giống nhau", "Món ăn đóng hộp"],
          ["Container", "Một image đang được chạy", "Hộp đã mở ra và đang ăn"],
          ["Registry", "Kho chứa image trên mạng", "Siêu thị bán đồ hộp"],
        ],
      },
      {
        type: "note",
        tone: "info",
        text:
          "Từ 1 image chạy được nhiều container cùng lúc, giống như từ 1 công thức nấu được nhiều phần ăn. " +
          "Container xoá đi là mất sạch dữ liệu bên trong — muốn giữ lại phải dùng volume.",
      },
    ],
  },

  {
    id: "doc-dockerfile",
    part: "Docker",
    title: "Đọc một Dockerfile",
    blocks: [
      { type: "p", text: "Đây là Dockerfile của server Flask trong repo này, đọc từ trên xuống:" },
      {
        type: "code",
        lang: "dockerfile",
        text: [
          "FROM python:3.12-slim        # 1. Lấy môi trường nền có sẵn Python",
          "",
          "WORKDIR /code                # 2. Mọi lệnh sau chạy trong /code",
          "",
          "COPY requirements.txt .      # 3. Copy DANH SÁCH thư viện vào trước",
          "RUN pip install --no-cache-dir -r requirements.txt",
          "",
          "COPY app/ ./app/             # 4. Rồi mới copy code",
          "COPY run.py .",
          "",
          "EXPOSE 5000                  # 5. Khai báo cổng app lắng nghe",
          "",
          'CMD ["python", "run.py"]     # 6. Lệnh chạy khi container khởi động',
        ].join("\n"),
      },
      {
        type: "table",
        head: ["Lệnh", "Làm gì"],
        rows: [
          ["FROM", "Chọn image nền. Đuôi -slim hoặc -alpine cho image nhẹ hơn nhiều."],
          ["WORKDIR", "Đặt thư mục làm việc, thay cho việc phải cd ở từng lệnh."],
          ["COPY", "Chép file từ máy build vào image."],
          ["RUN", "Chạy lệnh LÚC BUILD, kết quả được ghi vào image."],
          ["CMD", "Lệnh chạy LÚC KHỞI ĐỘNG container. Khác RUN ở chỗ này."],
          ["EXPOSE", "Chỉ là tài liệu. Muốn truy cập thật vẫn phải -p 5000:5000 lúc docker run."],
        ],
      },
      {
        type: "note",
        tone: "warn",
        text:
          "RUN và CMD rất hay bị nhầm. RUN chạy một lần lúc build (ví dụ: cài thư viện). " +
          "CMD chạy mỗi lần bật container (ví dụ: khởi động app). Một Dockerfile chỉ nên có 1 CMD.",
      },
    ],
  },

  {
    id: "layer-cache",
    part: "Docker",
    title: "Layer và cache: vì sao thứ tự lệnh lại quan trọng",
    blocks: [
      {
        type: "p",
        text:
          "Mỗi lệnh trong Dockerfile tạo ra một LAYER. Khi build lại, Docker tái sử dụng layer cũ " +
          "cho tới lệnh đầu tiên có thay đổi — từ đó trở xuống phải làm lại hết. " +
          "Vì vậy: thứ gì ít đổi thì đặt LÊN TRÊN, thứ gì đổi liên tục thì đặt XUỐNG DƯỚI.",
      },
      {
        type: "code",
        lang: "dockerfile",
        text: [
          "# ✅ ĐÚNG — copy package*.json trước, cài xong rồi mới copy code",
          "COPY package*.json ./",
          "RUN npm ci                   # sửa code không làm layer này vỡ cache",
          "COPY . .",
          "",
          "# ❌ SAI — copy hết rồi mới cài",
          "COPY . .",
          "RUN npm ci                   # sửa 1 dòng code là cài lại toàn bộ, chậm kinh khủng",
        ].join("\n"),
      },
      {
        type: "note",
        tone: "info",
        text:
          "File .dockerignore hoạt động như .gitignore: loại node_modules, .git, __pycache__ ra khỏi " +
          "context gửi cho Docker. Quên nó thì mỗi lần build phải gửi hàng trăm MB rác.",
      },
    ],
  },

  {
    id: "multi-stage",
    part: "Docker",
    title: "Multi-stage build",
    blocks: [
      {
        type: "p",
        text:
          "Client Vue cần Node để BUILD, nhưng khi CHẠY thì chỉ là mấy file HTML/CSS/JS tĩnh — " +
          "không cần Node nữa. Multi-stage cho phép build ở một stage rồi chỉ bê kết quả sang stage cuối.",
      },
      {
        type: "code",
        lang: "dockerfile",
        text: [
          "# ---------- Stage 1: BUILD ----------",
          "FROM node:18-alpine AS build",
          "WORKDIR /app",
          "COPY package*.json ./",
          "RUN npm ci",
          "COPY . .",
          "RUN npm run build            # tạo ra thư mục /app/dist",
          "",
          "# ---------- Stage 2: RUNTIME ----------",
          "FROM nginx:1.27-alpine",
          "COPY --from=build /app/dist /usr/share/nginx/html",
          "# ↑ chỉ lấy dist sang, Node và node_modules bị bỏ lại hoàn toàn",
        ].join("\n"),
      },
      {
        type: "table",
        head: ["Cách build", "Image cuối chứa gì", "Dung lượng"],
        rows: [
          ["Một stage", "Node + node_modules + source + dist", "Hàng trăm MB"],
          ["Multi-stage", "nginx + dist", "Vài chục MB"],
        ],
      },
      {
        type: "note",
        tone: "info",
        text:
          "Image nhỏ không chỉ nhẹ: ít phần mềm thừa nghĩa là ít lỗ hổng bảo mật hơn, " +
          "và deploy nhanh hơn vì phải tải về ít hơn.",
      },
    ],
  },

  {
    id: "registry-tag",
    part: "Docker",
    title: "Registry và tag",
    blocks: [
      {
        type: "p",
        text:
          "Build xong image thì để ở đâu? Đẩy lên registry. Repo này dùng GitHub Container Registry (ghcr.io) " +
          "vì nó có sẵn cùng GitHub, không cần tạo tài khoản hay secret riêng.",
      },
      {
        type: "table",
        head: ["Tag", "Đặc điểm", "Dùng khi nào"],
        rows: [
          [":latest", "Bị ghi đè mỗi lần build mới", "Lấy nhanh bản mới nhất để thử"],
          [":<commit-sha>", "Cố định vĩnh viễn, không bao giờ bị ghi đè", "Truy vết image ↔ commit, và ROLLBACK"],
          [":v1.2.0", "Do người đặt theo semantic version", "Phát hành chính thức cho người dùng"],
        ],
      },
      {
        type: "note",
        tone: "warn",
        text:
          "Đừng bao giờ deploy production bằng :latest. Khi có sự cố bạn sẽ không biết bản đang chạy là commit nào, " +
          "và cũng không có bản cũ để quay về. Deploy bằng tag SHA hoặc version.",
      },
      {
        type: "code",
        lang: "bash",
        text: [
          "# Pipeline của repo này đẩy lên 2 image riêng:",
          "docker pull ghcr.io/<owner>/<repo>/server:latest",
          "docker pull ghcr.io/<owner>/<repo>/client:latest",
          "",
          "docker run -p 5000:5000 ghcr.io/<owner>/<repo>/server:latest",
          "docker run -p 8080:80   ghcr.io/<owner>/<repo>/client:latest",
        ].join("\n"),
      },
    ],
  },

  // ==========================================================================
  // PHẦN 3 — Áp dụng vào chính repo này
  // ==========================================================================
  {
    id: "pipeline-repo-nay",
    part: "Repo này",
    title: "Pipeline của chính repo này",
    blocks: [
      {
        type: "p",
        text:
          "Trang bạn đang đọc được build bởi chính pipeline dưới đây. " +
          "Mỗi lần có commit vào main, ba job này chạy theo đúng sơ đồ:",
      },
      {
        type: "code",
        lang: "sơ đồ",
        text: [
          "push / PR vào main",
          "       │",
          "       ├──────────────┬──────────────┐",
          "       ▼              ▼              │",
          " test-server     test-client         │  2 job CI chạy song song",
          " flake8          eslint              │  (mỗi job 1 máy ảo riêng)",
          " pytest          jest + build        │",
          "       │              │              │",
          "       └──────┬───────┘              │",
          "              ▼ cả hai đều pass      │",
          "      build-and-push (CD)  ◀─────────┘",
          "      build 2 image, chỉ khi push vào main",
        ].join("\n"),
      },
      {
        type: "table",
        head: ["Job", "Chạy khi nào", "Làm gì"],
        rows: [
          ["test-server", "push & PR", "flake8 + pytest trong server/"],
          ["test-client", "push & PR", "eslint + jest + npm run build trong client/"],
          ["build-and-push", "Chỉ khi push vào main VÀ cả 2 job trên pass", "Build & push 2 Docker image lên ghcr.io"],
        ],
      },
      {
        type: "p",
        text:
          "Job CD dùng strategy.matrix để chạy 2 lượt (một cho server, một cho client) " +
          "thay vì phải chép đi chép lại các bước build:",
      },
      {
        type: "code",
        lang: "yaml",
        text: [
          "strategy:",
          "  matrix:",
          "    include:",
          "      - name: server",
          "        context: ./server",
          "      - name: client",
          "        context: ./client",
          "",
          "# Mỗi lượt chạy tự thay giá trị vào chỗ dùng biến:",
          "#   context: ${{ matrix.context }}",
          "#   tags:    ghcr.io/${{ github.repository }}/${{ matrix.name }}:latest",
        ].join("\n"),
      },
      {
        type: "note",
        tone: "warn",
        text:
          "Repo có nhiều phần (monorepo) thì mỗi job phải chạy đúng thư mục của mình bằng " +
          "defaults.run.working-directory. Lưu ý nó CHỈ áp dụng cho run:, không áp dụng cho uses: — " +
          "nên tham số đường dẫn của action (như cache-dependency-path) vẫn phải viết đầy đủ từ gốc repo.",
      },
    ],
  },

  {
    id: "loi-hay-gap",
    part: "Repo này",
    title: "Các lỗi hay gặp",
    blocks: [
      {
        type: "table",
        head: ["Triệu chứng", "Nguyên nhân thường gặp"],
        rows: [
          ["Workflow không chạy", "File không nằm trong .github/workflows/, sai thụt lề YAML, hoặc push lên nhánh không có trong branches:"],
          ["ModuleNotFoundError khi test", "Chạy pytest thay vì python -m pytest, hoặc thiếu thư viện trong requirements"],
          ["denied: permission_denied khi push image", "Thiếu packages: write trong permissions:"],
          ["Job CD bị skipped", "Một job CI fail, hoặc điều kiện if: không thoả (đang là PR chẳng hạn)"],
          ["repository name must be lowercase", "Tên owner hoặc repo có chữ hoa"],
          ["npm ci thất bại trên CI", "Chưa commit package-lock.json, hoặc lock file lệch với package.json"],
          ["Cache không hoạt động", "Thiếu cache-dependency-path khi file requirements/lock không nằm ở thư mục gốc"],
        ],
      },
    ],
  },
];
