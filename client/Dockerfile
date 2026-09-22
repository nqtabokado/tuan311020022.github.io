# ---------- Stage 1: BUILD ----------
# Dùng Node để biên dịch Vue SFC (.vue) thành HTML/CSS/JS tĩnh.
FROM node:18-alpine AS build

WORKDIR /app

# Copy riêng package*.json trước để tận dụng cache layer của Docker:
# chỉ khi 2 file này đổi thì mới phải cài lại node_modules.
COPY package*.json ./
RUN npm ci

COPY . .

# URL của API Flask được NHÚNG vào bundle lúc build (không đọc lúc chạy).
# Đổi API => phải build lại image:
#   docker build --build-arg VUE_APP_API_BASE_URL=https://api.example.com -t client .
ARG VUE_APP_API_BASE_URL=http://localhost:5000
ENV VUE_APP_API_BASE_URL=$VUE_APP_API_BASE_URL

RUN npm run build

# ---------- Stage 2: RUNTIME ----------
# Image cuối chỉ chứa nginx + thư mục dist (~vài chục MB),
# không mang theo Node và node_modules (~hàng trăm MB).
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
