# 📱 Hướng Dẫn Chạy Vina AI trên Android RAM 2GB

## 🚨 QUAN TRỌNG - ĐỌC TRƯỚC KHI BẮT ĐẦU

### 1. Lấy Groq API Key (MIỄN PHÍ)
1. Mở trình duyệt, truy cập: https://console.groq.com/
2. Đăng ký tài khoản miễn phí 
3. Tạo API Key mới
4. Copy API Key vừa tạo

### 2. Cập nhật API Key
```bash
# Mở file .env.local và thay đổi dòng này:
GROQ_API_KEY=YOUR_GROQ_API_KEY_HERE
# Thành:
GROQ_API_KEY=gsk_your_actual_api_key_here
```

### 3. Chạy ứng dụng (chọn 1 trong 3 cách)

#### Cách 1: Tối ưu cho Android (Khuyên dùng)
```bash
pnpm run mobile
```

#### Cách 2: Chế độ Android đơn giản  
```bash
pnpm run android
```

#### Cách 3: Termux (nếu dùng Termux)
```bash
pnpm run termux:dev
```

## 🔧 Khi gặp vấn đề

### Nếu hết RAM:
1. Đóng tất cả app khác
2. Restart lại thiết bị
3. Chỉ mở terminal và browser

### Nếu chạy chậm:
1. Dùng `pnpm run android` thay vì `pnpm run dev`
2. Tắt turbo mode
3. Giảm số tab browser

### Nếu crash:
```bash
# Dọn cache và chạy lại
rm -rf .next
pnpm run mobile
```

## 🌐 Truy cập ứng dụng

Sau khi chạy thành công:
- Local: http://localhost:3000
- Network: http://YOUR_IP:3000

## ⚡ Mẹo tối ưu Android RAM 2GB

1. **Trước khi chạy:**
   - Đóng hết app khác
   - Xóa cache hệ thống
   - Khởi động lại điện thoại

2. **Khi chạy:**
   - Chỉ mở 1-2 tab browser
   - Tắt thông báo không cần thiết
   - Sử dụng Chrome Lite nếu có

3. **Nếu lag:**
   - Ctrl+C để dừng
   - Đợi 10 giây
   - Chạy lại `pnpm run mobile`

## 🚀 Deploy lên internet (sau khi test local OK)

### Cách đơn giản nhất - Vercel:
```bash
# 1. Đăng ký Vercel.com miễn phí
# 2. Kết nối GitHub account
# 3. Import repository này
# 4. Thêm environment variables trên Vercel dashboard
# 5. Deploy tự động
```

### Hoặc dùng Railway (miễn phí):
```bash
# 1. Đăng ký Railway.app
# 2. Connect GitHub repo  
# 3. Deploy tự động
```

## 📞 Cần hỗ trợ?

Nếu gặp khó khăn, hãy:
1. Đảm bảo đã có Groq API key
2. Kiểm tra file .env.local đã đúng
3. Thử các lệnh chạy khác nhau
4. Restart thiết bị nếu cần

**Lưu ý:** Với RAM 2GB, quá trình khởi động có thể mất 2-3 phút. Hãy kiên nhẫn! 🙏