# Diet Plan

App Next.js (App Router) tính toán dinh dưỡng và lên thực đơn cho khách hàng.

> **Repo này không chứa bất kỳ khoá/thông tin đăng nhập thật nào.** Mọi giá trị
> nhạy cảm đều nằm trong `.env.local` (đã bị `.gitignore` bỏ qua). Xem
> `.env.example` để biết cần điền những gì.

## Chạy lần đầu

```bash
# 1. Cài dependencies
npm install

# 2. Tạo file env riêng của bạn rồi thay hết các [PLACEHOLDER]
cp .env.example .env.local

# 3. Đẩy schema lên database
npx prisma db push

# 4. Tạo tài khoản admin đầu tiên (đọc SEED_ADMIN_* từ .env.local)
npm run seed

# 5. Nạp thư viện món ăn dựng sẵn (tuỳ chọn)
npx tsx prisma/seed-foods.ts

# 6. Chạy dev server
npm run dev
```

Mở http://localhost:3000.

## Biến môi trường

| Biến | Bắt buộc | Dùng để làm gì |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | Postgres connection string qua pooler — cho query lúc chạy |
| `DIRECT_URL` | ✅ | Postgres direct connection — bắt buộc cho `prisma db push` |
| `JWT_SECRET` | ✅ | Ký cookie phiên đăng nhập + token reset mật khẩu |
| `GEMINI_API_KEYS` | ✅ | Danh sách key Gemini phân cách bằng dấu phẩy (app tự xoay vòng) |
| `GMAIL_USER` | — | Tài khoản Gmail gửi mail chào mừng / quên mật khẩu |
| `GMAIL_APP_PASSWORD` | — | App Password 16 ký tự của Gmail (không phải mật khẩu thường) |
| `EMAIL_FROM` | — | Tên hiển thị người gửi |
| `SEED_ADMIN_NAME` / `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | — | Chỉ dùng cho `npm run seed` |

Bỏ trống `GMAIL_USER` / `GMAIL_APP_PASSWORD` → app vẫn chạy bình thường, chỉ là
không gửi email (no-op).

Tạo nhanh một `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

## Bảng màu & font

- Nền: `#FDE2DC` — sắc độ phụ `#FFF3F0` (nổi), `#FBD5CC` (chìm), `#F6C5BA` (viền)
- Thương hiệu (nút, viền, icon, mảng đặc): `#F15B5C` — hover `#D94447`
- Chữ nhấn màu thương hiệu: `#B02F30` (coral đậm — coral nhạt trên nền hồng chỉ đạt 2.7:1, không đủ đọc)
- Chữ trên nền coral: `#FFFFFF`
- Chữ: `#14110E`
- Ngữ nghĩa: `#5C6E48` (thành công), `#3A5567` (thông tin), `#A33A2A` (lỗi)
- Font: **Nunito** (nạp qua `next/font/google` trong `app/layout.tsx`)

Các biến này khai báo ở `app/globals.css` — đổi một chỗ là đổi cả app.

## Scripts

| Lệnh | Việc |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | `prisma generate` + build production |
| `npm start` | Chạy bản build |
| `npm run lint` | ESLint |
| `npm run seed` | Tạo tài khoản admin đầu tiên |
