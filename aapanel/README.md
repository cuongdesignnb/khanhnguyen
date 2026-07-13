# Deploy Khanh Nguyên lên aaPanel

## Quy trình image production mới

Deploy thông thường không build source trên aaPanel. GitHub Actions tạo image `linux/amd64`, đẩy tag `master` và commit SHA lên `ghcr.io/cuongdesignnb/khanhnguyen`.

Nếu package private, đăng nhập một lần bằng token chỉ có quyền `read:packages` (nhập token tại prompt, không lưu token trong repo):

```bash
docker login ghcr.io -u cuongdesignnb
```

Deploy immutable SHA và kiểm tra:

```bash
cd /www/wwwroot/xenangkhanhnguyen.com/aapanel
git pull --ff-only
./deploy.sh <commit-sha>
curl -fsS http://127.0.0.1:4317/api/health
docker compose --env-file .env.production -f docker-compose.production.yml logs --tail=100 app
```

Rollback chỉ app: `./rollback.sh`. Build khẩn cấp tại server: `./build-local.sh`. Hai thao tác đều giữ nguyên PostgreSQL và volume uploads. `RUN_DB_PUSH`/`RUN_DB_SEED` phải để `false`; migration production là bước release chủ động bằng `prisma migrate deploy` khi đã có migration hợp lệ.

Bộ cấu hình này chạy Next.js và PostgreSQL bằng Docker. aaPanel Nginx chịu trách nhiệm domain, SSL và reverse proxy. PostgreSQL không mở cổng ra Internet; ứng dụng chỉ bind vào `127.0.0.1:4317`.

## 1. Chuẩn bị DNS

Tạo bản ghi:

- `A` cho `xenangkhanhnguyen.com` trỏ tới IP VPS.
- `A` cho `www.xenangkhanhnguyen.com` trỏ tới IP VPS.

Chờ DNS cập nhật trước khi cấp SSL.

## 2. Chuẩn bị aaPanel

1. Cài Docker và Docker Compose trong App Store của aaPanel.
2. Cài Nginx nếu server chưa có.
3. Tạo website `xenangkhanhnguyen.com`, thêm domain phụ `www.xenangkhanhnguyen.com`.
4. Upload hoặc clone toàn bộ repo vào `/www/wwwroot/xenangkhanhnguyen.com`.

Không chỉ upload riêng thư mục `aapanel`, vì Docker cần source ở thư mục cha để build.

## 3. Tạo biến môi trường production

```bash
cd /www/wwwroot/xenangkhanhnguyen.com/aapanel
cp env.production.example .env.production
openssl rand -hex 32
openssl rand -base64 48
```

Sửa `.env.production`:

- Thay toàn bộ `CHANGE_ME`.
- `POSTGRES_PASSWORD` nên dùng chuỗi hex từ `openssl rand -hex 32`.
- Điền cùng mật khẩu đó vào phần password của `DATABASE_URL`.
- `BETTER_AUTH_SECRET` và `AI_SETTINGS_SECRET` phải là hai chuỗi khác nhau.
- Đặt mật khẩu Admin mạnh, không dùng mật khẩu mặc định.
- Chỉ điền `OPENAI_API_KEY` nếu muốn dùng tính năng AI.

Phân quyền file:

```bash
chmod 600 .env.production
chmod +x deploy.sh rollback.sh build-local.sh backup.sh restore-database.sh entrypoint.production.sh
```

## 4. Pull image và chạy

```bash
./deploy.sh <commit-sha>
```

Kiểm tra:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml ps
docker compose --env-file .env.production -f docker-compose.production.yml logs -f app
curl -I http://127.0.0.1:4317
```

## 5. Reverse proxy trong aaPanel

Trong website `xenangkhanhnguyen.com`:

1. Mở **Reverse Proxy**.
2. Proxy name: `khanhnguyen-nextjs`.
3. Target URL: `http://127.0.0.1:4317`.
4. Sent Domain: `$host`.
5. Nếu aaPanel cho sửa config Nginx, dùng nội dung trong `nginx-reverse-proxy.conf`.

Không proxy tới IP container PostgreSQL và không mở cổng 5432 trên firewall.

## 6. SSL và chuyển hướng domain

1. Vào tab SSL của website và cấp Let's Encrypt cho cả domain gốc lẫn `www`.
2. Bật **Force HTTPS**.
3. Chọn domain chính là `xenangkhanhnguyen.com`.
4. Redirect `www.xenangkhanhnguyen.com` về `https://xenangkhanhnguyen.com$request_uri`.

Sau đó kiểm tra:

```bash
curl -I https://xenangkhanhnguyen.com
curl -I https://www.xenangkhanhnguyen.com
curl https://xenangkhanhnguyen.com/api/health
curl https://xenangkhanhnguyen.com/robots.txt
curl https://xenangkhanhnguyen.com/sitemap.xml
```

## 7. Khởi tạo dữ liệu

Mặc định `RUN_DB_SEED=false` để tránh tự chèn dữ liệu mẫu lên production.

- Nếu chuyển từ hệ thống hiện tại: backup database và uploads ở máy cũ, sau đó restore lên server.
- Nếu là website hoàn toàn mới và muốn dùng dữ liệu seed, chạy seed như một bước khởi tạo có giám sát từ môi trường quản trị. Không bật `RUN_DB_SEED` trong container production.

Đăng nhập Admin tại `https://xenangkhanhnguyen.com/dang-nhap`, sau đó vào **Cài đặt → SEO toàn website** và xác nhận URL chính thức là `https://xenangkhanhnguyen.com`.

## 8. Backup tự động

Chạy thử:

```bash
./backup.sh
```

Trong aaPanel Cron, tạo Shell Script chạy mỗi ngày lúc 02:30:

```bash
cd /www/wwwroot/xenangkhanhnguyen.com/aapanel && ./backup.sh >> /www/wwwlogs/khanhnguyen-backup.log 2>&1
```

Script giữ backup 14 ngày. Nên đồng bộ thêm thư mục `aapanel/backups` sang một máy hoặc object storage khác.

## 9. Cập nhật phiên bản mới

```bash
cd /www/wwwroot/xenangkhanhnguyen.com
git pull --ff-only
cd aapanel
./backup.sh
./deploy.sh <commit-sha>
```

Không chạy `docker compose down -v`, vì tùy chọn `-v` sẽ xóa database và uploads.

## 10. Rollback nhanh

```bash
./rollback.sh
```

Script đọc tag thành công trước đó, chỉ pull/recreate service app và chờ health. Database cùng uploads không bị thay đổi; rollback database luôn là thao tác độc lập có kế hoạch.

## 11. Upload Media trên production

Ứng dụng chạy bằng user `node` và lưu file trong named volume `khanhnguyen_prod_uploads` tại `/app/public/uploads`. Volume cũ từng được tạo bởi container chạy `root` có thể khiến upload báo `Permission denied` dù website vẫn mở bình thường.

Kiểm tra quyền ghi:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml exec app sh -lc '
  id
  ls -ld /app/public/uploads
  touch /app/public/uploads/.write-test
  rm /app/public/uploads/.write-test
'
```

Nếu lỗi quyền, chạy script an toàn dưới đây. Script chỉ đổi owner về `node:node`, không xóa file, không sửa database và không dùng `chmod 777`:

```bash
chmod +x fix-upload-permissions.sh
./fix-upload-permissions.sh
```

`deploy.sh` luôn chạy preflight writable sau khi container mới healthy. Deploy sẽ dừng và in đúng lệnh sửa nếu volume không ghi được.

Vhost Nginx aaPanel cần có các giá trị sau trong khối `server` để nhận từng request tối đa 20 MB mà không tăng giới hạn quá mức:

```nginx
client_max_body_size 25m;
proxy_read_timeout 120s;
proxy_send_timeout 120s;
```

Sau khi sửa vhost, kiểm tra cấu hình và reload Nginx từ aaPanel. Không tự ghi đè vhost nếu chưa đối chiếu cấu hình SSL/reverse proxy đang chạy.
