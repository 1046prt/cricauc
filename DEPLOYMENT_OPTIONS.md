# 🚀 Deployment Options for CricAuc

## Understanding the Difference

### GitHub (Code Hosting)

- **Purpose**: Store and version control your code
- **Not for**: Running/deploying your application
- **Use it for**: Backing up code, collaboration, CI/CD

### Docker (Containerization)

- **Purpose**: Package your application in containers
- **Not a hosting platform**: It's a tool to run containers
- **Use it for**: Consistent environments, easier deployment

## 📦 Recommended Deployment Platforms

### Option 1: Vercel (Frontend) + Railway (Backend + Database) ⭐ **EASIEST**

**Best for**: Quick deployment, free tier available

#### Frontend (Vercel)

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Vercel auto-deploys Next.js apps
4. **Free tier**: Perfect for frontend

#### Backend + Database (Railway)

1. Push code to GitHub
2. Connect to Railway
3. Railway provides PostgreSQL + Redis
4. Deploy backend automatically
5. **Free tier**: $5 credit/month

**Steps:**

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/cricauc.git
git push -u origin main

# 2. Deploy Frontend on Vercel
# - Go to vercel.com
# - Import GitHub repo
# - Select frontend folder
# - Add env: NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# 3. Deploy Backend on Railway
# - Go to railway.app
# - New Project → Deploy from GitHub
# - Add PostgreSQL service
# - Add Redis service
# - Set environment variables
```

---

### Option 2: Render (All-in-One) ⭐ **SIMPLE**

**Best for**: Everything in one place

1. **Frontend**: Static Site (Next.js)
2. **Backend**: Web Service (NestJS)
3. **PostgreSQL**: Managed Database
4. **Redis**: Managed Redis

**Free tier**: Limited, but good for testing

**Steps:**

1. Push to GitHub
2. Create services on Render:
   - PostgreSQL database
   - Redis instance
   - Web service (backend)
   - Static site (frontend)
3. Connect environment variables

---

### Option 3: AWS (Production-Ready) 💰

**Best for**: Production, scalability, enterprise

**Services needed:**

- **Frontend**: AWS Amplify or S3 + CloudFront
- **Backend**: EC2 or ECS (with Docker)
- **Database**: RDS (PostgreSQL)
- **Cache**: ElastiCache (Redis)

**Cost**: Pay-as-you-go (can be expensive)

---

### Option 4: DigitalOcean (Balanced) 💰

**Best for**: Good balance of simplicity and control

**Options:**

- **App Platform**: Managed (easiest)
- **Droplets**: VPS (more control)
- **Managed Databases**: PostgreSQL + Redis

**Cost**: ~$12-25/month

---

### Option 5: Docker + Any VPS (Most Control)

**Best for**: Full control, learning

**Providers:**

- DigitalOcean Droplets
- Linode
- Vultr
- AWS EC2
- Google Cloud Compute Engine

**Steps:**

1. Get a VPS (Ubuntu server)
2. Install Docker & Docker Compose
3. Clone your repo
4. Run `docker-compose up -d`
5. Set up Nginx reverse proxy
6. Configure SSL (Let's Encrypt)

---

## 🎯 My Recommendation

### For Beginners:

**Vercel (Frontend) + Railway (Backend)**

### For Production:

**Render** or **DigitalOcean App Platform**

### For Learning/Full Control:

**DigitalOcean Droplet + Docker**

---

## 📝 Quick Start: Vercel + Railway

### Step 1: Push to GitHub

```bash
cd D:\Program_Files\CricAuc
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cricauc.git
git push -u origin main
```

### Step 2: Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. **Root Directory**: Select `frontend`
6. **Framework Preset**: Next.js (auto-detected)
7. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```
8. Click "Deploy"

### Step 3: Deploy Backend + Database (Railway)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Click "Deploy from GitHub repo"
5. Select your repository
6. **Add PostgreSQL**: Click "+ New" → PostgreSQL
7. **Add Redis**: Click "+ New" → Redis
8. **Deploy Backend**:
   - Click "+ New" → GitHub Repo
   - Select repo
   - **Root Directory**: `backend`
   - **Start Command**: `npm run start:prod`
9. **Environment Variables** (in Railway):
   ```
   NODE_ENV=production
   PORT=4000
   DB_HOST=${{Postgres.PGHOST}}
   DB_PORT=${{Postgres.PGPORT}}
   DB_USERNAME=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   DB_NAME=${{Postgres.PGDATABASE}}
   REDIS_HOST=${{Redis.REDISHOST}}
   REDIS_PORT=${{Redis.REDISPORT}}
   JWT_SECRET=<generate-strong-secret>
   FRONTEND_URL=https://your-app.vercel.app
   ```
10. Get backend URL and update Vercel env var

---

## 🔧 Alternative: Render Deployment

### Step 1: Push to GitHub (same as above)

### Step 2: Create Services on Render

1. **PostgreSQL Database**:
   - New → PostgreSQL
   - Name: `cricauc-db`
   - Note the connection string

2. **Redis Instance**:
   - New → Redis
   - Name: `cricauc-redis`
   - Note the connection details

3. **Backend Web Service**:
   - New → Web Service
   - Connect GitHub repo
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     PORT=10000
     DB_HOST=<from-postgres-service>
     DB_PORT=5432
     DB_USERNAME=<from-postgres-service>
     DB_PASSWORD=<from-postgres-service>
     DB_NAME=<from-postgres-service>
     REDIS_HOST=<from-redis-service>
     REDIS_PORT=<from-redis-service>
     JWT_SECRET=<generate-secret>
     FRONTEND_URL=https://your-frontend.onrender.com
     ```

4. **Frontend Static Site**:
   - New → Static Site
   - Connect GitHub repo
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `.next`
   - **Environment Variables**:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
     ```

---

## 🐳 Docker Deployment (VPS)

If you want to use Docker on a VPS:

### Step 1: Get a VPS

- DigitalOcean Droplet ($6/month)
- Ubuntu 22.04

### Step 2: Setup Server

```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Install Nginx
apt install nginx -y

# Install Certbot (for SSL)
apt install certbot python3-certbot-nginx -y
```

### Step 3: Deploy Application

```bash
# Clone your repo
git clone https://github.com/yourusername/cricauc.git
cd cricauc

# Create production .env files
# Edit backend/.env with production values
# Edit frontend/.env.local with production values

# Build and start
docker-compose -f docker-compose.prod.yml up -d
```

### Step 4: Configure Nginx

```nginx
# /etc/nginx/sites-available/cricauc
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

### Step 5: SSL Certificate

```bash
certbot --nginx -d yourdomain.com
```

---

## 📊 Comparison Table

| Platform             | Ease       | Cost      | Best For     |
| -------------------- | ---------- | --------- | ------------ |
| **Vercel + Railway** | ⭐⭐⭐⭐⭐ | Free tier | Quick start  |
| **Render**           | ⭐⭐⭐⭐   | Free tier | All-in-one   |
| **DigitalOcean**     | ⭐⭐⭐     | $12-25/mo | Balance      |
| **AWS**              | ⭐⭐       | Variable  | Enterprise   |
| **VPS + Docker**     | ⭐⭐       | $6-20/mo  | Full control |

---

## ✅ Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Environment variables prepared
- [ ] Strong JWT_SECRET generated
- [ ] Database credentials ready
- [ ] Frontend URL configured
- [ ] Backend URL configured
- [ ] CORS settings updated
- [ ] SSL/HTTPS enabled
- [ ] Domain name configured (optional)

---

## 🎯 Quick Answer

**For easiest deployment:**

1. Push code to **GitHub** (code hosting)
2. Deploy frontend on **Vercel** (free)
3. Deploy backend + database on **Railway** (free tier)

**GitHub** = Store your code
**Docker** = Package your app (optional)
**Vercel/Railway/Render** = Actually run your app (deployment)

---

**Need help with a specific platform? Let me know!**
