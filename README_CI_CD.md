# Lý thuyết CI/CD với GitHub Actions

Tài liệu học đi kèm file [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml).

---

## 1. CI/CD là gì?

### CI — Continuous Integration (Tích hợp liên tục)

Mỗi khi có người đẩy code lên, một hệ thống **tự động** lấy code đó về, cài đặt, rồi chạy lint và test.

- **Mục tiêu:** phát hiện lỗi **sớm nhất có thể**, khi thay đổi còn nhỏ và dễ sửa.
- **Không có CI:** mỗi người code riêng vài tuần rồi mới gộp lại, đến lúc đó lỗi chồng lên nhau, khó tìm ra lỗi do ai gây ra ("integration hell").
- **Kết quả:** mỗi commit hoặc PR có dấu ✅ hoặc ❌ trên GitHub.

### CD — có 2 nghĩa, dễ nhầm

| Thuật ngữ | Nghĩa | Bước cuối |
|---|---|---|
| **Continuous Delivery** (Phân phối liên tục) | Code qua CI thì được **đóng gói sẵn sàng phát hành** (vd: Docker image trên registry) | Đưa lên production vẫn **do người bấm** |
| **Continuous Deployment** (Triển khai liên tục) | Code qua CI thì được **tự động đưa lên production** | Không cần người can thiệp |

Workflow trong repo này là **Continuous Delivery**: nó build và push Docker image lên `ghcr.io`, nhưng chưa tự chạy image đó trên server nào.

### Pipeline

Pipeline là chuỗi các bước code phải đi qua, từ lúc commit đến lúc phát hành:

```
Commit → Build → Lint → Test → Đóng gói (image) → Đẩy lên registry → (Deploy)
         └──────── CI ────────┘ └──────────────── CD ─────────────────┘
```

Bước nào lỗi thì pipeline dừng ở đó. Các bước sau không chạy.

---

## 2. Các khái niệm trong GitHub Actions

```
Workflow (1 file .yml trong .github/workflows/)
 └── được kích hoạt bởi Event (on: push, pull_request, ...)
 └── gồm nhiều Job (mỗi job chạy trên 1 Runner riêng)
      └── gồm nhiều Step (chạy tuần tự)
           └── mỗi step là "run:" (lệnh shell) hoặc "uses:" (Action có sẵn)
```

| Khái niệm | Giải thích | Trong `ci-cd.yml` |
|---|---|---|
| **Workflow** | Một quy trình tự động, định nghĩa trong 1 file YAML | `name: CI/CD` |
| **Event** | Sự kiện kích hoạt workflow | `on: push`, `on: pull_request` |
| **Job** | Một nhóm step chạy trên cùng 1 máy | `test`, `build-and-push` |
| **Runner** | Máy ảo chạy job, GitHub cấp mới mỗi lần và xoá khi chạy xong | `runs-on: ubuntu-latest` |
| **Step** | Một bước trong job | `Checkout code`, `Run tests`... |
| **Action** | Đoạn code dùng lại được, người khác viết sẵn | `actions/checkout@v4` |

### Những điểm hay bị hiểu sai

1. **Các job mặc định chạy SONG SONG.** Muốn job B chờ job A thì phải khai báo `needs: A`.
2. **Mỗi job chạy trên một máy ảo riêng.** Job sau **không** thấy file của job trước. Vì vậy job `build-and-push` phải `checkout` lại code. Muốn chuyển file giữa các job thì dùng *artifacts* (`actions/upload-artifact` / `download-artifact`).
3. **Các step trong cùng một job dùng chung máy.** File mà step trước tạo ra thì step sau dùng được.
4. **Số sau `@` là phiên bản của action** (`@v4`). Nên ghim phiên bản để workflow không tự hỏng khi action đó cập nhật.

---

## 3. Event (trigger) thường dùng

| Event | Chạy khi | Dùng cho |
|---|---|---|
| `push` | Có commit được đẩy lên nhánh | CI, CD sau khi merge |
| `pull_request` | Mở hoặc cập nhật PR | CI kiểm tra trước khi merge |
| `workflow_dispatch` | Bấm nút "Run workflow" bằng tay | Deploy thủ công |
| `schedule` | Theo lịch cron | Chạy test định kỳ hằng đêm |
| `workflow_run` | Một workflow **khác** vừa chạy xong | Nối 2 file workflow riêng |
| `release` | Tạo release hoặc tag | Phát hành phiên bản |

**Merge một PR vào main cũng là một lần `push` vào main**, nên job CD sẽ chạy sau khi merge.

---

## 4. Nối CI với CD: `needs` và `workflow_run`

Repo này trước đây tách thành 2 file (`ci.yaml` và `cd.yaml`), bây giờ gộp lại thành 1 file. So sánh hai cách:

| | `needs:` (1 file) | `workflow_run:` (2 file) |
|---|---|---|
| Cách nối | `needs: test` | `on: workflow_run: workflows: ["CI"]` |
| Điều kiện "CI phải pass" | Tự động | Phải tự thêm `if: github.event.workflow_run.conclusion == 'success'` |
| Commit được build | Đúng commit vừa test | Phải tự chỉ định `ref: head_sha`, nếu không có thể build nhầm commit mới hơn |
| Rủi ro | Thấp | Gõ sai tên workflow thì CD **không bao giờ chạy** và cũng không báo lỗi |
| Khi nào nên dùng | Hầu hết các trường hợp | CI và CD do 2 nhóm khác nhau quản lý, hoặc cần quyền tách biệt |

➡️ **Nên bắt đầu với 1 file và `needs:`.**

---

## 5. Điều kiện `if:`

```yaml
if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```

- `github.event_name`: tên event đã kích hoạt workflow (`push`, `pull_request`...)
- `github.ref`: nhánh hoặc tag, có dạng `refs/heads/<tên-nhánh>`

Dòng trên có nghĩa là: *"chỉ phát hành khi code đã thật sự vào main, không phát hành khi mới là PR"*. Code trong PR chưa được review, nên chưa được phép thành image chính thức.

Một số biến ngữ cảnh (context) hay dùng:

| Biểu thức | Giá trị |
|---|---|
| `${{ github.sha }}` | Mã commit đang chạy |
| `${{ github.repository }}` | `owner/tên-repo` |
| `${{ github.actor }}` | Người kích hoạt workflow |
| `${{ secrets.XXX }}` | Secret đã lưu trong Settings → Secrets |
| `${{ env.XXX }}` | Biến môi trường khai báo trong `env:` |

---

## 6. `GITHUB_TOKEN` và `permissions`

- Mỗi lần workflow chạy, GitHub **tự sinh một token tạm** (`secrets.GITHUB_TOKEN`). Token này hết hạn khi job kết thúc. Bạn không cần tự tạo.
- Token được làm gì là do khối `permissions:` quyết định.
- Nguyên tắc **least privilege**: cần quyền gì thì khai báo quyền đó, không cấp thừa.

| Quyền | Cần khi |
|---|---|
| `contents: read` | Checkout code |
| `contents: write` | Push commit, tạo release |
| `packages: write` | Push Docker image lên `ghcr.io` |
| `pages: write` + `id-token: write` | Deploy GitHub Pages bằng `actions/deploy-pages` |
| `pull-requests: write` | Bot comment vào PR |

> 💡 Lỗi `Ensure GITHUB_TOKEN has permission "id-token: write"` khi deploy Pages nghĩa là job **thiếu** `id-token: write` trong `permissions:`.

### Secrets

Không bao giờ ghi mật khẩu hay API key thẳng vào file YAML, vì file này ai đọc được repo cũng thấy. Hãy lưu chúng vào **Settings → Secrets and variables → Actions** rồi dùng `${{ secrets.TEN_SECRET }}`. GitHub tự che (`***`) giá trị secret trong log.

---

## 7. Lint và Test khác nhau thế nào?

| | Lint (flake8) | Test (pytest) |
|---|---|---|
| Có chạy code không? | ❌ Chỉ đọc code | ✅ Chạy thật |
| Bắt được | Sai style, import thừa, biến không dùng, lỗi cú pháp | Sai logic: hàm trả kết quả sai, API trả sai status code |
| Tốc độ | Rất nhanh | Chậm hơn |

Nên đặt lint **trước** test, vì lint nhanh hơn: lỗi nào bắt được sớm thì pipeline báo sớm.

---

## 8. Docker image, registry và tag

- **Dockerfile**: công thức để đóng gói app cùng môi trường chạy.
- **Image**: kết quả build từ Dockerfile, là một gói bất biến, chạy ở đâu cũng giống nhau.
- **Registry**: kho chứa image (Docker Hub, `ghcr.io`, AWS ECR...).
- **Tag**: tên phiên bản của image.

Workflow này gắn **2 tag** cho mỗi image:

| Tag | Đặc điểm | Dùng để |
|---|---|---|
| `:latest` | Bị ghi đè mỗi lần build | Lấy bản mới nhất |
| `:<commit-sha>` | Cố định mãi mãi | Truy vết image ↔ commit, **rollback** |

Cách lấy image về chạy:

```bash
docker pull ghcr.io/<owner>/<repo>:latest
docker run -p 5000:5000 ghcr.io/<owner>/<repo>:latest
```

---

## 9. Cache

`cache: "pip"` lưu lại các gói pip đã tải cho lần chạy sau, nhờ đó CI nhanh hơn đáng kể. Cache được tạo lại khi file `requirements*.txt` thay đổi.

---

## 10. Best practices

1. **Pipeline phải nhanh.** CI chạy quá 10 phút thì mọi người sẽ ngại chờ.
2. **Fail fast.** Đặt bước nhanh (lint) trước bước chậm (test, build).
3. **Main luôn xanh.** Bật *Branch protection* (Settings → Branches) để bắt buộc CI pass mới được merge.
4. **Build một lần, triển khai nhiều nơi.** Dev, staging và prod nên dùng cùng một image, chỉ khác cấu hình.
5. **Không để secret trong code.** Dùng `secrets`.
6. **Cấp quyền tối thiểu** trong `permissions:`.
7. **Ghim phiên bản action** (`@v4`), không dùng `@main`.
8. **Chạy được ở local trước.** Lệnh nào trong CI cũng nên chạy được trên máy mình (`flake8 ...`, `python -m pytest`).

---

## 11. Các lỗi hay gặp

| Triệu chứng | Nguyên nhân thường gặp |
|---|---|
| Workflow không chạy | File không nằm trong `.github/workflows/`, sai cú pháp YAML (thụt lề), hoặc push lên nhánh không có trong `branches:` |
| `ModuleNotFoundError` khi chạy test | Chạy `pytest` thay vì `python -m pytest`, hoặc thiếu thư viện trong requirements |
| `denied: permission_denied` khi push image | Thiếu `packages: write` |
| `Failed to get ID Token` | Thiếu `id-token: write` (thường gặp khi deploy Pages hoặc đăng nhập cloud bằng OIDC) |
| Job CD bị `skipped` | Job `test` fail, hoặc điều kiện `if:` không thoả (vd: đang là PR) |
| Tên image lỗi `repository name must be lowercase` | Tên owner hoặc repo có chữ hoa |

---

## 12. Bài tập tự luyện

1. Viết một test fail cố ý, push lên và xem job `build-and-push` bị **skipped**.
2. Mở một PR vào main và quan sát: chỉ job `test` chạy, job CD không chạy. Giải thích tại sao.
3. Thêm `workflow_dispatch:` vào `on:` để có nút chạy workflow bằng tay.
4. Đổi `push.branches` thành `["**"]` để CI chạy trên mọi nhánh. Job CD có bị ảnh hưởng không? (Gợi ý: xem `if:`.)
5. Dùng `strategy.matrix` để chạy test trên cả Python `3.11` và `3.12`.
6. Sau khi image lên `ghcr.io`, `docker pull` về máy và chạy thử.
