# Smart Bus AI — Deployment Guide

## Free Hosting Stack

This project uses a free-tier hosting stack:

| Service | Provider | Free Tier | Purpose |
|---------|----------|-----------|---------|
| Web App | Vercel | 100GB bandwidth, 125k hours | Next.js passenger app |
| Database | Supabase | 500MB DB, 10k users | PostgreSQL, Auth, Realtime |
| API | Render | 750 hours/month | NestJS API gateway |
| Mobile | Expo | 100 build minutes | React Native apps |

## 1. Vercel (Web App)

### Setup
1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Import your `smart-bus` repository
3. Vercel will auto-detect `vercel.json` and configure the build
4. Set these environment variables in the Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://smart-bus-api.onrender.com/api/v1
NEXT_PUBLIC_SUPABASE_URL=https://qykvyxmkorcomjtcjwso.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_we7wj95ECwpcQvTWs3dKQg_x_gX9-BZ
```

### Build Settings
- **Framework**: Next.js
- **Build Command**: `npm run build --workspace=apps/passenger`
- **Output Directory**: `apps/passenger/.next`
- **Install Command**: `npm install --workspaces --legacy-peer-deps`

## 2. Supabase (Database)

### Setup
1. Go to [supabase.com](https://supabase.com) and create a project
2. Your project is already created at: `https://qykvyxmkorcomjtcjwso.supabase.co`
3. Get your `service_role` key from: **Settings → API**
4. Apply migrations:

```bash
# Set environment variables
export SUPABASE_URL=https://qykvyxmkorcomjtcjwso.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Apply migrations and seeds
node database/apply-migrations.js
```

### Manual Migration (Alternative)
If the script doesn't work, run migrations manually:
1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql)
2. Run each file in `database/migrations/` in order
3. Run each file in `database/seeds/` in order
4. Enable Realtime: **Database → Replication → add `public.buses`**

## 3. Render (API)

### Setup
1. Go to [render.com](https://render.com) and sign up with GitHub
2. Create a new **Web Service**
3. Connect your `smart-bus` repository
4. Configure:
   - **Root Directory**: `services/api`
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`
   - **Start Command**: `npm run start`
   - **Environment**: Node.js

5. Add environment variables:

```
PORT=3001
NODE_ENV=production
API_VERSION=v1
SUPABASE_URL=https://qykvyxmkorcomjtcjwso.supabase.co
SUPABASE_ANON_KEY=sb_publishable_we7wj95ECwpcQvTWs3dKQg_x_gX9-BZ
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
JWT_SECRET=your-jwt-secret-min-32-chars-long
JWT_EXPIRY=7d
FRONTEND_URL=https://smart-bus-ai.vercel.app
WS_URL=wss://smart-bus-api.onrender.com
```

## 4. Expo (Mobile)

### Setup
1. Install EAS CLI: `npm install -g eas-cli`
2. Configure `eas.json` in `apps/driver/` and `apps/passenger/`
3. Build: `eas build --platform ios` or `eas build --platform android`

## Verification

After deployment, verify:

```bash
# Test API
curl https://smart-bus-api.onrender.com/api/v1/buses

# Test Supabase
curl -H "apikey: sb_publishable_we7wj95ECwpcQvTWs3dKQg_x_gX9-BZ" \
  https://qykvyxmkorcomjtcjwso.supabase.co/rest/v1/buses?limit=1

# Test Web App
curl https://smart-bus-ai.vercel.app
```

## Local Development

```bash
# Start all services
npm run dev

# Or start individually
npm run dev --workspace=apps/passenger
npm run dev --workspace=services/api
npm run dev --workspace=services/simulator
```

## Troubleshooting

- **Vercel 404**: Ensure `vercel.json` is at the project root
- **Supabase table not found**: Run migrations from `database/migrations/`
- **API connection refused**: Check `NEXT_PUBLIC_API_URL` in Vercel env vars
- **Realtime not working**: Enable replication on `buses` table in Supabase
