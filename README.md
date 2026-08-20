# WellNest

WellNest is a wellness and health tracking web application prototype built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, and shadcn/ui components. The application provides an interface for personal health metrics tracking, daily activity logging (nutrition, hydration, exercise, sleep), health goals management, medical history tracking, and gamified achievements.

---

## 🛠 Features Implemented

### Frontend Pages & Features
- **Landing Page (`/`):** Marketing page featuring hero section, feature highlights, and navigation triggers.
- **Authentication Views (`/login`, `/signup`):** Login and registration forms with client-side validation for credentials and physical metrics (age, height, current/target weight, gender).
- **Dashboard Overview (`/dashboard`):** Central dashboard displaying daily summary metrics (calories, water, workout duration, sleep), calculated BMI and BMR values, a 14-day weight trend line chart, and a weekly activity bar chart powered by Recharts.
- **Daily Activity Logging (`/dashboard/daily-log`):** Date-based activity tracking interface allowing users to record, mark completed, and delete log entries for Food, Water, Workouts, and Sleep.
- **Profile & Weight Tracking (`/dashboard/profile`):** Profile management interface with weight history chart visualization, BMI/BMR metrics, target weight progress tracking, and manual weight entry logging.
- **Goals Management (`/dashboard/goals`):** Interface for setting, editing, and tracking progress on wellness goals, with progress metrics calculated dynamically from daily logs.
- **Health History (`/dashboard/health-history`):** Tracking interface for recording medical conditions, severity-categorized allergies, and active medications.
- **Achievements (`/dashboard/achievements`):** Gamified progress section displaying unlocked badges, total XP, user level calculations, and active achievement progress bars.
- **Settings (`/dashboard/settings`):** Configuration page featuring toggles for notification preferences, privacy visibility, light/dark themes, password updates, and connected devices list.

### Backend API Routes (`app/api/`)
- `GET /api/logs`, `POST /api/logs`, `PATCH /api/logs`, `DELETE /api/logs`: CRUD operations for daily activity entries stored in a local JSON database.
- `GET /api/weight`, `POST /api/weight`: Fetch and record weight history entries.
- `GET /api/stats`: Returns 7-day aggregated metrics (calories, water intake, sleep) and weight trend datasets.
- `GET /api/goal-progress`: Computes daily category progress against defined targets.
- `GET /api/achievements`: Returns achievement and badge configurations.

---

## 📁 Repository Structure

```
├── app/          # App Router pages (landing, login, signup, dashboard views) & API routes (/api/*)
├── components/   # UI components (shadcn/ui primitives, chat widget, theme provider)
├── data/         # Local file storage (db.json)
├── hooks/        # Custom React hooks (toast notifications, mobile detection)
├── lib/          # Helper modules (JSON file database I/O, API client methods, UI utility functions)
├── styles/       # Global CSS & Tailwind design tokens
└── types/        # TypeScript ambient type declarations
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or pnpm

### Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production Verification

```bash
npm run build
npm start
```

---

## 🔮 Future Improvements & Prototype Limitations

This repository is currently a **prototype/demo application**. To make the project live, secure, production-ready, and genuinely useful, the following engineering work needs to be implemented:

1. **Production Database & Persistence:**
   - Replace the local JSON file database (`data/db.json` and `lib/db.ts`) with a production database (e.g., PostgreSQL, Supabase, Neon, or Prisma ORM) with relational tables and multi-user data isolation.
   - Migrate in-memory state features (Medical History, User Settings) to persistent database tables.
   - Resolve local file I/O limitations that cause `fs.writeFile` operations to fail in serverless deployment environments (such as Vercel).

2. **Authentication & Authorization:**
   - Replace client-side `localStorage` session checks with server-side authentication (e.g., NextAuth.js, Supabase Auth, or HTTP-only cookie sessions).
   - Implement server-side password hashing (e.g., Argon2 / bcrypt) and authorization middleware to protect `/api/*` endpoints per user.

3. **Validation & Reliability:**
   - Add backend request body validation using Zod or Yup on all API routes to prevent malformed data.
   - Implement robust error boundaries, structured HTTP status codes, and API rate limiting.

4. **Integrations & UX:**
   - Upgrade the rule-based chat widget (`components/chat-widget.tsx`) to an AI LLM API integration with explicit medical disclaimers.
   - Add external health data synchronization (Apple HealthKit, Google Fit).
   - Populate the empty `app/dashboard/chat` directory or consolidate navigation components.

5. **Testing & Observability:**
   - Add unit tests (Jest/React Testing Library) and end-to-end testing (Playwright/Cypress).
   - Integrate monitoring and logging tools (e.g., Sentry).
