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

## 2. Phát triển hỗn hợp (Hybrid Development) - CHÚ Ý LỖI KẾT NỐI DB

Nếu bạn muốn chạy máy chủ phát triển cục bộ ở máy host (`npm run dev`) trên cổng **3000** để có tốc độ hot reload nhanh hơn, nhưng vẫn sử dụng cơ sở dữ liệu PostgreSQL chạy trong Docker (cổng **55437**):

### Triệu chứng lỗi thường gặp:
Lỗi hiển thị ở terminal/console:
```
[browser] API fetch error, using fallback data: ApiErrorResponse: Lỗi lấy danh sách bài viết
```
Khi kiểm tra `http://localhost:3000/api/health` thấy `"database": "disconnected"`.

### Cách xử lý:
Cập nhật biến `DATABASE_URL` trong file `.env` cục bộ (ở máy host) trỏ đúng tới cổng PostgreSQL của Docker (`55437` thay vì cổng mặc định `5432`):

```env
# File .env của máy host (chạy npm run dev)
DATABASE_URL="postgresql://khanhnguyen:change_this_postgres_password@localhost:55437/khanhnguyen?schema=public"
```
*(Thay thế `change_this_postgres_password` bằng mật khẩu bạn đã thiết lập trong `.env.docker`)*

Sau khi sửa file `.env`, khởi động lại máy chủ dev:
```bash
npm run dev
```

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
