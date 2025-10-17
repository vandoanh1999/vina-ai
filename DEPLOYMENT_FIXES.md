# Hướng dẫn khắc phục lỗi deployment cho vina-ai

## Nguyên nhân chính của lỗi deployment

1. **File pnpm-lock.yaml bị trống/hỏng**: Đây là nguyên nhân chính gây ra lỗi `ERR_INVALID_THIS` khi pnpm cố gắng cài đặt packages.

2. **Package resumable-stream version không phù hợp**: Version 2.2.7 bị thiếu thư mục dist, cần downgrade về 2.0.0.

3. **Cache issues**: pnpm cache và node_modules có thể bị corrupt.

## Các bước đã thực hiện để khắc phục

### 1. Làm sạch môi trường
```bash
# Xóa node_modules và lock file
rm -rf node_modules
rm pnpm-lock.yaml

# Dọn dẹp pnpm cache
pnpm store prune
```

### 2. Cài đặt lại dependencies
```bash
# Cài đặt lại từ đầu
pnpm install --no-frozen-lockfile

# Fix resumable-stream version
pnpm remove resumable-stream
pnpm add resumable-stream@2.0.0
```

### 3. Kiểm tra build
```bash
# Build thành công
pnpm run build

# Start production server
# Lưu ý: Với output: standalone, dùng:
node .next/standalone/server.js
# Thay vì:
pnpm start
```

## Warnings còn lại (không ảnh hưởng deployment)

1. **Peer Dependencies Warnings**:
   - `@vercel/otel` và `@opentelemetry/api-logs` version mismatch
   - `next-themes` với React 19 RC
   - `bufferutil` và `utf-8-validate` (đã có overrides trong pnpm config)

2. **Edge Runtime Warnings**:
   - `bcrypt-ts` sử dụng Node.js APIs không support trong Edge Runtime
   - Chỉ là warning, không ảnh hưởng deployment

## Cấu hình Vercel

File `vercel.json` đã được cấu hình đúng:
```json
{
  "buildCommand": "pnpm run build",
  "installCommand": "pnpm install --no-frozen-lockfile",
  "devCommand": "pnpm dev",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

## Trạng thái hiện tại

✅ Dependencies cài đặt thành công  
✅ Build thành công  
✅ Production server chạy được  
✅ Sẵn sàng cho deployment  

## Để deploy lên Vercel

1. Commit tất cả thay đổi:
```bash
git add .
git commit -m "Fix deployment issues - resumable-stream version and clean dependencies"
git push
```

2. Trigger deploy lại trên Vercel hoặc:
```bash
vercel --prod
```

## Version summary

- Node.js: v22.17.0
- pnpm: v10.13.1
- Next.js: 15.3.0-canary.31
- resumable-stream: 2.0.0 (đã fix từ 2.2.7)