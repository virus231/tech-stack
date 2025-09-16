# Vercel Deployment Setup

## 🚀 Deployment Steps

### 1. Environment Variables

Add these to your Vercel Dashboard (`Settings` → `Environment Variables`):

```bash
# Production Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# JWT Secret (generate strong secret)
JWT_SECRET="your-super-secret-jwt-key-256-bit"

# Node Environment
NODE_ENV="production"

# CORS Origins (your frontend domain)
CORS_ORIGINS="https://your-project.vercel.app"
```

### 2. Database Options

#### Option A: Vercel Postgres (Recommended)
```bash
# Install Vercel Postgres
vercel storage create postgres

# Copy connection string to env vars
```

#### Option B: Railway
```bash
# 1. Create account at railway.app
# 2. Create PostgreSQL database
# 3. Copy connection string
```

#### Option C: Supabase
```bash
# 1. Create project at supabase.com
# 2. Go to Settings → Database
# 3. Copy connection string
```

### 3. Deploy Commands

```bash
# Connect to Vercel
vercel login

# Link project
vercel link

# Deploy
vercel --prod
```

### 4. After Deployment

1. **Run migrations**:
   ```bash
   # In Vercel Functions tab, run:
   npx prisma migrate deploy
   ```

2. **Test API**:
   ```bash
   curl https://your-project.vercel.app/api/health
   ```

## 🔧 Project Structure

```
├── vercel.json              # Vercel configuration
├── .vercelignore           # Files to ignore
├── backend/
│   ├── api/index.ts        # Vercel Function entry
│   ├── .env.production     # Production env template
│   └── prisma/
│       └── migrate-prod.ts # Production migrations
└── frontend/               # Next.js app
```

## 📝 Manual Setup Steps

1. **Create Vercel project**
2. **Add environment variables** (see above)
3. **Choose database provider**
4. **Deploy**: `vercel --prod`
5. **Run migrations** in Vercel dashboard
6. **Test endpoints**

## 🚨 Important Notes

- **Never commit** real secrets to git
- **Use strong JWT secret** (256-bit recommended)
- **Enable SSL** for production database
- **Set CORS origins** correctly
- **Test thoroughly** before production use