# Flask CI/CD Demo

Project nhỏ để tự học CI/CD với GitHub Actions + Docker.

## Cấu trúc

```
flask-ci-cd-demo/
├── app/
│   └── __init__.py        # Flask app (factory pattern)
├── tests/
│   └── test_app.py        # Unit test bằng pytest
├── run.py                 # Điểm chạy app
├── requirements.txt       # Dependency cho production
├── requirements-dev.txt   # Thêm pytest, flake8 để test/lint
├── Dockerfile
├── .dockerignore
└── .github/
    └── workflows/
        └── ci-cd.yml       # Pipeline CI/CD
```

## Chạy thử ở local

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt

# chạy test
pytest -v

# chạy app
python run.py
# mở http://localhost:5000
```

## Chạy bằng Docker

```bash
docker build -t flask-ci-cd-demo .
docker run -p 5000:5000 flask-ci-cd-demo
```

## Thiết lập CI/CD trên GitHub

1. Tạo repo mới trên GitHub, push toàn bộ project lên (nhánh `main`).
2. **Không cần tạo secret nào cả** — pipeline dùng `GITHUB_TOKEN` có sẵn để đẩy image lên **GitHub Container Registry (ghcr.io)**.
3. Mỗi lần push hoặc mở Pull Request vào `main`:
   - Job **test** sẽ chạy: cài dependency, lint bằng flake8, chạy pytest.
4. Khi push thẳng vào `main` (và job `test` pass):
   - Job **build-and-push** sẽ build Docker image và đẩy lên `ghcr.io/<username>/<repo>` với 2 tag: `latest` và tag theo commit SHA.
5. Xem image đã push ở đâu: vào trang GitHub profile/repo của bạn → tab **Packages**.
6. Image mặc định ở chế độ **private**. Muốn pull công khai (không cần đăng nhập), vào package đó → **Package settings** → **Change visibility** → Public.

### Kéo image về chạy thử (sau khi đã public, hoặc đã `docker login ghcr.io`)

```bash
docker pull ghcr.io/<username>/<repo>:latest
docker run -p 5000:5000 ghcr.io/<username>/<repo>:latest
```

## Các bước học gợi ý (tăng dần độ khó)

1. **Bước 1 – CI cơ bản (đã có sẵn)**: mỗi lần push/PR, code được lint + test tự động.
2. **Bước 2 – Badge trạng thái**: thêm badge CI vào README để thấy pass/fail trực quan.
3. **Bước 3 – CD build image (đã có sẵn)**: build & push Docker image lên Docker Hub khi merge vào `main`.
4. **Bước 4 – Deploy thật**: thêm job deploy image lên một nền tảng free như Render, Railway, Fly.io, hoặc SSH vào VPS rồi `docker pull && docker run`.
5. **Bước 5 – Môi trường staging/production**: dùng GitHub Environments, yêu cầu approve thủ công trước khi deploy production.
6. **Bước 6 – Versioning & rollback**: gắn tag semantic version (`v1.0.0`), học cách rollback về image cũ khi lỗi.

## Ghi chú

- Workflow tách 2 job `test` và `build-and-push`, job sau phụ thuộc job trước (`needs: test`) — đúng tinh thần CI/CD: không bao giờ build/deploy code chưa qua test.
- Nếu sau này muốn đổi sang Docker Hub, chỉ cần thay lại bước login/tag trong `ci-cd.yml` và thêm 2 secret `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`.
