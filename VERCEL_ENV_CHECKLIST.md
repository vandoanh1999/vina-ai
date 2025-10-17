# ✅ Vercel Environment Variables Checklist

## 🔴 CRITICAL - Bắt buộc phải có (Server sẽ lỗi nếu thiếu):

### 1. AUTH_SECRET
- **Mô tả**: Secret key cho NextAuth authentication
- **Cách tạo**: 
  ```bash
  openssl rand -base64 32
  ```
  Hoặc truy cập: https://generate-secret.vercel.app/32
- **Example**: `Kd8xM2pQ7vL9nR4tY6wE3sA5bN8cV1fG`
- **Environment**: Production, Preview, Development

### 2. POSTGRES_URL
- **Mô tả**: PostgreSQL database connection string
- **Đây là biến Vercel tự động tạo** khi bạn add Vercel Postgres
- **Format**: `postgres://default:xxxxx@xxxxx.postgres.vercel-storage.com:5432/verceldb?sslmode=require`
- **Cách lấy**:
  1. Vào Vercel Dashboard → Storage tab
  2. Chọn "Create Database" → "Postgres"
  3. Vercel sẽ tự động add POSTGRES_URL vào env vars
- **Environment**: Production, Preview, Development

### 3. GROQ_API_KEY
- **Mô tả**: API key cho Groq AI (miễn phí)
- **Cách lấy**:
  1. Truy cập: https://console.groq.com/
  2. Đăng ký/Đăng nhập
  3. Vào "API Keys" → "Create API Key"
- **Example**: `gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Environment**: Production, Preview, Development

---

## ⚠️ RECOMMENDED - Nên có để tránh lỗi:

### 4. BLOB_READ_WRITE_TOKEN
- **Mô tả**: Token cho Vercel Blob Storage (lưu files, images)
- **Vercel tự động tạo** khi add Blob Storage
- **Cách lấy**:
  1. Vercel Dashboard → Storage → "Create Store" → "Blob"
  2. Vercel tự động add token vào env vars
- **Environment**: Production, Preview, Development

### 5. NEXTAUTH_URL (Optional - NextAuth tự detect)
- **Mô tả**: URL của website cho NextAuth callbacks
- **Value**: `https://vina-ai.com` (hoặc `https://www.vina-ai.com`)
- **Environment**: Production

---

## 📝 Optional - Có thể bỏ qua ban đầu:

### 6. REDIS_URL
- **Mô tả**: Redis cache URL (cho performance)
- **Cách lấy**: Vercel Dashboard → Storage → Create Redis
- **Environment**: Production

### 7. AI_GATEWAY_API_KEY
- **Mô tả**: Vercel AI Gateway API key
- **Note**: Vercel deployments dùng OIDC tokens tự động
- **Environment**: Chỉ cần cho non-Vercel deployments

---

## 🚀 Các bước thực hiện trên Vercel:

### Option A: Dùng Vercel CLI (Nhanh nhất)
```bash
# Login to Vercel
vercel login

# Link project
vercel link

# Add environment variables
vercel env add AUTH_SECRET production
vercel env add GROQ_API_KEY production
```

### Option B: Dùng Web Interface
1. Mở: https://vercel.com/vandoanh1999s-projects/vina-ai/settings/environment-variables
2. Click "Add New" cho mỗi biến
3. Paste value và chọn environments (Production, Preview, Development)
4. Click "Save"

### Option C: Import từ .env.local (Khuyên dùng!)
1. Tạo file local với tất cả env vars
2. Vercel Dashboard → Settings → Environment Variables
3. Click "Import .env" button
4. Upload file .env của bạn

---

## ✅ Sau khi add xong:

### 1. Redeploy project:
```bash
vercel --prod
```

Hoặc trên web:
- Vào Deployments tab → Click "..." → "Redeploy"

### 2. Check logs:
```bash
vercel logs
```

Hoặc:
- Deployments → Click vào deployment → "Runtime Logs"

---

## 🔍 Debug tips:

### Nếu vẫn lỗi 500:
1. Check Runtime Logs: `vercel logs --follow`
2. Verify env vars: Settings → Environment Variables
3. Test database connection:
   ```bash
   psql "POSTGRES_URL_HERE"
   ```
4. Test locally:
   ```bash
   vercel dev
   ```

### Kiểm tra env vars đã được set:
Vào: https://vercel.com/vandoanh1999s-projects/vina-ai/settings/environment-variables

Phải thấy:
- ✅ AUTH_SECRET (Production, Preview, Development)
- ✅ POSTGRES_URL (Production, Preview, Development)  
- ✅ GROQ_API_KEY (Production, Preview, Development)

---

## 📞 Nếu cần help:

1. Check Vercel logs: https://vercel.com/vandoanh1999s-projects/vina-ai/logs
2. Paste error message để debug tiếp
3. Verify database đã được tạo trong Storage tab
