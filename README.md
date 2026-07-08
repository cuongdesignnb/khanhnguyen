# Khanh Nguyên Forklift Project

Dự án giới thiệu và bán/cho thuê xe nâng Khanh Nguyên Forklift sử dụng Next.js, Prisma, PostgreSQL và Better Auth.

---

## 1. Chạy ứng dụng bằng Docker (Khuyên dùng cho Production/Staging)

Docker Compose đã đóng gói đầy đủ ứng dụng Next.js + cơ sở dữ liệu PostgreSQL 16.

### Các bước khởi chạy:
1. Sao chép cấu hình môi trường Docker:
   ```bash
   copy .env.docker.example .env.docker
   ```
2. Mở file `.env.docker` và cập nhật các thông tin mật khẩu (`POSTGRES_PASSWORD`, `BETTER_AUTH_SECRET`, `ADMIN_PASSWORD`).
3. Khởi chạy các container:
   ```bash
   npm run docker:up
   ```
   *Hoặc chạy trực tiếp:*
   ```bash
   docker compose --env-file .env.docker up -d --build
   ```

### Địa chỉ truy cập:
- **Ứng dụng công cộng**: [http://localhost:4317](http://localhost:4317)
- **Khu vực quản trị admin**: [http://localhost:4317/admin](http://localhost:4317/admin)
- **Health check API**: [http://localhost:4317/api/health](http://localhost:4317/api/health)
- **Database (từ máy host)**: `localhost:55437`

### Các lệnh hỗ trợ:
- Xem danh sách container: `npm run docker:ps`
- Xem log của Next.js: `npm run docker:logs`
- Dừng Docker: `npm run docker:down`
- Reset sạch database: `docker compose --env-file .env.docker down -v`

---

## 2. Phát triển hỗn hợp (Hybrid Development) - CẤU HÌNH DATABASE_URL

Dự án đang cấu hình tránh các cổng mặc định để tránh xung đột hệ thống. Cần đặc biệt lưu ý cấu hình biến môi trường kết nối cơ sở dữ liệu:

* **Phát triển cục bộ (Local npm dev - máy host)**:
  DATABASE_URL kết nối qua cổng PostgreSQL được Docker expose ra host (`55437`):
  ```env
  DATABASE_URL="postgresql://khanhnguyen:change_this_postgres_password@localhost:55437/khanhnguyen?schema=public"
  ```
* **Ứng dụng chạy trong Docker (Next.js container)**:
  DATABASE_URL kết nối nội bộ qua mạng Docker tới service `postgres` (cổng mặc định `5432` của container):
  ```env
  DATABASE_URL="postgresql://khanhnguyen:change_this_postgres_password@postgres:5432/khanhnguyen?schema=public"
  ```

> [!WARNING]
> **Không sử dụng cổng mặc định `localhost:5432` tại máy host** khi phát triển local nếu chưa khởi chạy database local riêng biệt, vì cơ sở dữ liệu Docker đang được ánh xạ ra cổng `55437`.

### Triệu chứng lỗi nếu cấu hình sai:
Lỗi hiển thị ở terminal/console khi chạy `npm run dev`:
```
[browser] API fetch error, using fallback data: ApiErrorResponse: Lỗi lấy danh sách bài viết
```
Khi kiểm tra `http://localhost:3000/api/health` thấy `"database": "disconnected"`.

### Cách xử lý:
Cập nhật biến `DATABASE_URL` trong file `.env` cục bộ (ở máy host) trỏ đúng tới cổng `55437` như hướng dẫn phía trên và khởi động lại dev server.

---

## 3. Chạy môi trường phát triển truyền thống (Local PostgreSQL)

Nếu máy tính của bạn đã có cài sẵn PostgreSQL chạy độc lập ở cổng `5432`:

1. Sao chép `.env.example` thành `.env`.
2. Chỉnh sửa thông số kết nối cơ sở dữ liệu `DATABASE_URL`.
3. Tạo và seed dữ liệu:
   ```bash
   npm run db:push
   npm run db:seed
   ```
4. Khởi chạy dev server:
   ```bash
   npm run dev
   ```
5. Mở [http://localhost:3000](http://localhost:3000)
