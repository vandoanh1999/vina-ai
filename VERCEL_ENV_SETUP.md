# 🚀 Cấu hình Environment Variables cho Vercel

## 📋 Danh sách biến môi trường CẦN có trên Vercel

### ✅ Đã có thông tin:

#### 1. AUTH_SECRET (CRITICAL)
```
AUTH_SECRET=tcY1Doy9A5za1slYhMp1M+9eB6TO1IM/bm158dlgs2g=
```
- **Mục đích**: Bảo mật NextAuth sessions
- **Environments**: Production, Preview, Development

#### 2. NEXTAUTH_URL (CRITICAL)
```
NEXTAUTH_URL=https://vina-ai.com
```
- **Mục đích**: Base URL cho NextAuth callbacks
- **Environments**: Production only
- **Preview**: Vercel tự động set
- **Development**: `http://localhost:3000`

#### 3. REDIS_URL (Optional - Có sẵn)
```
REDIS_URL=redis://default:HVqulojIyqydGKF01O8Z4gIFrxCjsdr6@redis-13428.c100.us-east-1-4.ec2.redns.redis-cloud.com:13428
```
- **Mục đích**: Caching để tăng performance
- **Provider**: Redis Cloud
- **Environments**: Production, Preview

---

### ❌ CẦN BỔ SUNG (quan trọng):

#### 4. POSTGRES_URL (CRITICAL)
```
POSTGRES_URL=postgresql://username:password@host:5432/database
```
- **Mục đích**: Database chính cho users, chats, documents
- **Cách lấy**: 
  1. Vercel Dashboard → Storage → Create Database → Postgres
  2. Hoặc dùng Vercel Postgres từ project settings
  3. Copy connection string có dạng: `postgres://...vercel-storage.com/...`
- **Environments**: Production, Preview, Development

#### 5. GROQ_API_KEY (CRITICAL)
```
GROQ_API_KEY=gsk_...
```
- **Mục đích**: AI model provider (miễn phí, nhanh)
- **Cách lấy**:
  1. Truy cập: https://console.groq.com/
  2. Sign up / Login
  3. API Keys → Create API Key
  4. Copy key (bắt đầu với `gsk_`)
- **Environments**: Production, Preview, Development

---

### ⚪ Optional nhưng NÊN có:

#### 6. BLOB_READ_WRITE_TOKEN
```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```
- **Mục đích**: Upload/download files (images, documents)
- **Cách lấy**: Vercel Dashboard → Storage → Blob
- **Environments**: Production, Preview

#### 7. AI_GATEWAY_API_KEY
```
AI_GATEWAY_API_KEY=ag_...
```
- **Mục đích**: Vercel AI Gateway (rate limiting, caching)
- **Cách lấy**: Vercel Dashboard → AI Gateway
- **Note**: Tự động có OIDC token trên Vercel, chỉ cần cho non-Vercel deploys
- **Environments**: Production only

---

## 🔧 Cách thêm vào Vercel:

### Phương pháp 1: Qua Dashboard (Khuyên dùng)

1. **Truy cập project settings:**
   ```
   https://vercel.com/vandoanh1999s-projects/vina-ai/settings/environment-variables
   ```

2. **Thêm từng biến:**
   - Click "Add New"
   - Name: `AUTH_SECRET`
   - Value: Paste giá trị
   - Environments: Check cả 3 (Production, Preview, Development)
   - Save

3. **Redeploy sau khi thêm:**
   - Deployments tab → ... (menu) → Redeploy
   - Hoặc push code mới lên GitHub

### Phương pháp 2: Qua Vercel CLI (Nhanh hơn)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Add environment variables
vercel env add AUTH_SECRET production
# Paste value khi được hỏi

# Hoặc import từ .env.local
vercel env pull .env.local
```

---

## ✅ Checklist hoàn thành:

- [ ] AUTH_SECRET → Production, Preview, Development
- [ ] NEXTAUTH_URL → Production (`https://vina-ai.com`)
- [ ] POSTGRES_URL → Production, Preview, Development
- [ ] GROQ_API_KEY → Production, Preview, Development
- [ ] REDIS_URL → Production, Preview
- [ ] BLOB_READ_WRITE_TOKEN → Production, Preview (optional)
- [ ] AI_GATEWAY_API_KEY → Production (optional)

---

## 🧪 Test sau khi cấu hình:

1. **Redeploy project:**
   ```bash
   git commit --allow-empty -m "trigger: redeploy with env vars"
   git push origin main
   ```

2. **Kiểm tra logs:**
   - Vercel Dashboard → Deployments → Click latest → Runtime Logs
   - Xem có error về missing env vars không

3. **Test website:**
   - Truy cập: https://vina-ai.com
   - Thử guest login
   - Check console không có 500 errors

---

## 🐛 Troubleshooting:

### Error: "AUTH_SECRET is missing"
- Đảm bảo đã thêm AUTH_SECRET vào cả 3 environments
- Redeploy sau khi thêm

### Error: "Database connection failed"
- Kiểm tra POSTGRES_URL format đúng
- Test connection: `psql $POSTGRES_URL`
- Đảm bảo database đã được migrate

### Error: "GROQ API rate limit"
- Check API key còn quota: https://console.groq.com/
- Tạo key mới nếu cần

### Build warnings về bcrypt-ts
- ✅ Đã fix - đã migrate sang Web Crypto API
- Không còn Node.js APIs trong Edge Runtime

---

## 📚 Tài liệu tham khảo:

- Vercel Environment Variables: https://vercel.com/docs/projects/environment-variables
- NextAuth.js Config: https://next-auth.js.org/configuration/options
- Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
- Groq API: https://console.groq.com/docs
