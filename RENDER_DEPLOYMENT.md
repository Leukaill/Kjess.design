# Deploying KJESS Designs to Render.com

## Environment Variables Required

Configure these environment variables in your Render service:

### Database Configuration
- `DATABASE_URL` - PostgreSQL connection string from Render database
- `PGHOST` - Database host (auto-configured by Render)
- `PGPORT` - Database port (auto-configured by Render) 
- `PGDATABASE` - Database name (auto-configured by Render)
- `PGUSER` - Database user (auto-configured by Render)
- `PGPASSWORD` - Database password (auto-configured by Render)

### Supabase Configuration (for file storage)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

### Security & Sessions
- `SESSION_SECRET` - Random string for session security (generate a strong random string)

### AI Integration
- `GEMINI_API_KEY` - Your Google Gemini API key for AI chatbot

### Application Configuration
- `NODE_ENV` - Set to "production"
- `PORT` - Set to 10000 (Render default)

## Step-by-Step Deployment Instructions

### 1. Prepare Your Repository

1. Make sure your code is pushed to GitHub/GitLab/Bitbucket
2. The `render.yaml` file is already created and configured
3. Your project structure should match this repository

### 2. Create Render Account & Database

1. Go to [render.com](https://render.com) and sign up
2. Create a new PostgreSQL database:
   - Go to Dashboard → New → PostgreSQL
   - Name: `kjess-designs-db`
   - Database Name: `kjessdesigns`
   - User: `kjess_user`
   - Plan: Starter (or higher)
   - Click "Create Database"

### 3. Deploy Web Service

1. In Render Dashboard, click "New" → "Web Service"
2. Connect your GitHub/GitLab repository
3. Select your KJESS Designs repository
4. Configure the service:
   - **Name**: `kjess-designs`
   - **Runtime**: Node
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Starter (or higher)

### 4. Configure Environment Variables

In your web service settings, add these environment variables:

#### Auto-configured (from database connection):
- `DATABASE_URL` (copy from your PostgreSQL database internal URL)

#### Manual configuration needed:
```
NODE_ENV=production
PORT=10000
SESSION_SECRET=your-super-secure-random-string-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
```

### 5. Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Install dependencies (`npm ci`)
   - Build the application (`npm run build`)
   - Start the server (`npm start`)

### 6. Set Up Database Schema

After deployment:
1. Go to your web service
2. Open the "Shell" tab
3. Run: `npm run db:push`
4. This will create all necessary database tables

### 7. Access Your Application

- Your app will be available at: `https://kjess-designs.onrender.com`
- Admin panel: `https://kjess-designs.onrender.com/admin`
- Create your admin account on first visit

## Troubleshooting

### Build Issues
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Database Connection Issues
- Verify DATABASE_URL is correctly set
- Check database is in same region as web service
- Ensure database allows connections

### Environment Variable Issues
- Double-check all required variables are set
- Verify Supabase credentials are correct
- Ensure Gemini API key is valid

## Production Considerations

### Performance
- Consider upgrading to Starter or higher plan for better performance
- Enable auto-scaling if needed

### Database
- Regular backups are recommended
- Monitor database usage and upgrade plan if needed

### Security
- Use strong SESSION_SECRET
- Keep API keys secure
- Regular security updates

### Monitoring
- Set up uptime monitoring
- Monitor application logs
- Set up error tracking if needed

---

Your KJESS Designs application is now ready for production on Render.com!