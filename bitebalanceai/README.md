# BiteBalanceAI

A nutrition tracking application built with Next.js, Prisma, and Supabase.

## Features

- **Authentication**: Email/password login with NextAuth
- **Food Database**: Search and filter foods (FNRI + AI-generated)
- **Meal Logging**: Track meals by type (Breakfast, Lunch, Dinner)
- **Dashboard**: View calories and macros for the last 7 days
- **Meal Planner**: Plan meals for the week
- **Community**: Share posts and interact with others
- **Challenges**: Complete challenges and earn points
- **Subscriptions**: Manage subscription plans

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 7
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **AI**: Google Gemini API

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Gemini AI
GEMINI_API_KEY="your-gemini-api-key-here"
```

For production (Vercel), set these in your Vercel project settings.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Generate Prisma Client:
```bash
npx prisma generate
```

3. Run migrations:
```bash
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel project settings:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (your Vercel URL)
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `GEMINI_API_KEY`
4. Deploy!

The `vercel.json` file is already configured with the correct build command.

## Project Structure

```
app/
  (public)/          # Public pages (login, register, etc.)
  api/               # API routes
  dashboard/         # Dashboard page
  foods/             # Food database page
  meal-logs/         # Meal logging page
  meal-planner/      # Meal planner page
  community/         # Community feed
  challenges/        # Challenges page
  subscriptions/     # Subscriptions page
components/
  dashboard/         # Dashboard shell component
  foods/            # Food-related components
  meals/            # Meal-related components
  mobile/           # Mobile navigation
  ui/               # Reusable UI components
prisma/
  schema.prisma     # Database schema
```

## License

MIT
