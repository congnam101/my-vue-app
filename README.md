# 🧾 ERP System Setup with Docker Compose

Một hệ thống ERP đơn giản gồm các service: PostgreSQL, Backend, Frontend, Adminer và pgAdmin. Dưới đây là hướng dẫn sử dụng nhanh.

---

## 🚀 Khởi động hệ thống

Build và chạy toàn bộ các container ở chế độ nền:

```bash
docker compose up -d --build
# 🧾 ERP System Setup with Docker Compose

Một hệ thống ERP đơn giản gồm các service: PostgreSQL, Backend, Frontend, Adminer và pgAdmin. Dưới đây là hướng dẫn sử dụng nhanh.

---

## 🚀 Khởi động hệ thống

Build và chạy toàn bộ các container ở chế độ nền:

```bash
docker compose up -d --build
```
## 🚀 Xem logs
## 🚀 Xem logs
```bash
docker compose logs -f backend     # Log của backend
docker compose logs -f frontend    # Log của frontend
```