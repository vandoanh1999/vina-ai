# 🔍 Phân Tích Biến Môi Trường - Vina AI

## ❌ VẤN ĐỀ TÌM THẤY

### **Các biến môi trường BẮT BUỘC đang THIẾU:**

1. **POSTGRES_URL** ❌
   - Cần thiết cho: Database connection
   - Sử dụng trong: `lib/db/queries.ts`, `drizzle.config.ts`
   - Nếu thiếu: Website sẽ **500 ERROR** khi tạo guest user

2. **GROQ_API_KEY** ❌
   - Cần thiết cho: AI Chat (Groq Llama models)
   - Sử dụng trong: `lib/ai/providers.ts`
   - Nếu thiếu: Chat sẽ không hoạt động

3. **AUTH_SECRET** ✅
   - Đã có trong `.env.local`
   - Cần kiểm tra trên Vercel production

## 📝 CÁCH SỬA LỖI

### Bước 1: Thêm vào `.env.local` (Development)

```bash
# Copy từ .env.example và điền giá trị thực:

# PostgreSQL Database (Vercel Postgres)
POSTGRES_URL=postgres://user:pass@host:5432/dbname

# Groq API Key (Free - từ https://console.groq.com/)
GROQ_API_KEY=gsk_...

# Auth Secret (đã có)
AUTH_SECRET=...
```

### Bước 2: Thêm vào Vercel (Production)

1. Vào: https://vercel.com/vandoanh1999s-projects/vina-ai
2. Settings → Environment Variables
3. Thêm:
   - `POSTGRES_URL` = [Connection string từ Vercel Postgres]
   - `GROQ_API_KEY` = [API key từ Groq Console]
   - `AUTH_SECRET` = [Same as local]

### Bước 3: Redeploy

```bash
git push origin main
# Hoặc trigger manual deploy trên Vercel Dashboard
```

## 🎯 OPTIONAL (Có thể thêm sau)

```bash
# Vercel Blob Storage (cho file uploads)
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# Redis (cho caching)
REDIS_URL=redis://...

# AI Gateway (cho Vercel AI)
AI_GATEWAY_API_KEY=...
```

## ✅ VALIDATION ĐÃ THÊM

Tạo file `lib/env.ts` để:
- ✅ Kiểm tra tất cả biến môi trường khi build
- ✅ Hiển thị error message rõ ràng nếu thiếu
- ✅ Export typed environment variables an toàn

## 🔗 LINKS HỮU ÍCH

1. **Groq API Key (Free)**: https://console.groq.com/keys
2. **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres/quickstart
3. **Generate AUTH_SECRET**: https://generate-secret.vercel.app/32

## 📊 TỔNG KẾT

| Biến             | Status | Cần cho        | Ưu tiên |
|------------------|--------|----------------|---------|
| AUTH_SECRET      | ✅ Có  | Authentication | HIGH    |
| POSTGRES_URL     | ❌ Thiếu | Database      | HIGH    |
| GROQ_API_KEY     | ❌ Thiếu | AI Chat       | HIGH    |
| BLOB_READ_WRITE  | ⚪ Optional | File Upload | LOW     |
| REDIS_URL        | ⚪ Optional | Caching     | LOW     |

---

**Next Steps:**
1. Lấy GROQ_API_KEY từ https://console.groq.com (free, 1 phút)
2. Tạo Vercel Postgres database (từ Vercel Dashboard)
3. Thêm 2 biến vào `.env.local` và Vercel
4. Build lại: `pnpm run build`
5. Deploy: `git push origin main`
