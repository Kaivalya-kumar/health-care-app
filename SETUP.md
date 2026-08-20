# WellNest - Developer Setup & Configuration Guide

This guide provides technical setup instructions, project configuration details, and architecture specifications for developers working on WellNest.

---

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI & Components:** React 19, Tailwind CSS v4, shadcn/ui, Lucide React
- **Data Visualization:** Recharts
- **State & Storage:** Local JSON file database (`data/db.json`), `localStorage` (client session demo)
- **Language:** TypeScript 5.7

---

## 🚀 Environment Setup

### Prerequisites

- **Node.js:** v18.0.0 or higher
- **Package Manager:** `npm` (v9+) or `pnpm` (v8+)

### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd wellnest
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open `http://localhost:3000` in your web browser.

---

## ⚙️ Configuration & Environment Variables

### Environment File Setup

Copy `.env.example` to create a local `.env.local` file:

```bash
cp .env.example .env.local
```

Available environment variables:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Base URL for application routing | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Base URL for external API calls | `http://localhost:3000/api` |

### Design System & Theme Tokens

Design tokens and CSS custom variables are maintained in `styles/globals.css`. Primary theme colors can be customized by editing the root variables:

```css
:root {
  --primary: oklch(0.54 0.15 200);   /* Teal main actions */
  --secondary: oklch(0.65 0.12 160); /* Mint green accents */
  --accent: oklch(0.68 0.14 150);    /* Aqua highlights */
}
```

---

## 🔌 API Endpoints Reference

The application exposes local serverless API endpoints defined under `app/api/`:

| Endpoint | Method | Query Parameters / Body | Description |
| :--- | :--- | :--- | :--- |
| `/api/logs` | `GET` | `?date=YYYY-MM-DD` | Fetch activity log entries |
| `/api/logs` | `POST` | `{ type, date, title, value, calories, duration, time }` | Create a new daily log entry |
| `/api/logs` | `PATCH` | `{ id, completed, ... }` | Update log entry completion status |
| `/api/logs` | `DELETE` | `?id=<log_id>` | Remove a log entry |
| `/api/weight` | `GET` | None | Fetch all weight records |
| `/api/weight` | `POST` | `{ date, weight }` | Record a new weight entry |
| `/api/stats` | `GET` | `?days=7` | Fetch aggregated weekly activity & weight trends |
| `/api/goal-progress` | `GET` | `?category=<category>&date=YYYY-MM-DD` | Calculate progress against daily targets |
| `/api/achievements` | `GET` | `?type=achievements\|badges` | Retrieve badges and active achievements |

---

## 🔐 Authentication Implementation

Currently, user sessions are simulated on the client side:
- **Signup / Login:** Form data is processed and stored as JSON in `localStorage.setItem('user', ...)` (see `app/login/page.tsx` and `app/signup/page.tsx`).
- **Route Guarding:** `app/dashboard/layout.tsx` validates `localStorage.getItem('user')` on client mount and redirects unauthenticated users to `/login`.

### Production Authentication Integration Steps

To replace client-side `localStorage` with secure server authentication:
1. Integrate an authentication provider (e.g. NextAuth.js, Supabase Auth, or Auth0).
2. Store session tokens in `HttpOnly`, `Secure` cookies.
3. Add authentication middleware in `middleware.ts` to guard `/dashboard/*` and `/api/*` routes.

---

## 🧪 Build & Production Verification

Verify the production build locally before deployment:

```bash
# Generate production bundle
npm run build

# Start production server
npm start
```

---

## 🛠 Extending the Application

### Adding a New Dashboard Route

1. Create a route folder inside `app/dashboard/`:
   ```bash
   mkdir -p app/dashboard/new-feature
   ```
2. Add `page.tsx` within the directory.
3. Update navigation items in `app/dashboard/layout.tsx`:
   ```typescript
   const navigationItems = [
     // ...
     { icon: IconName, label: 'New Feature', href: '/dashboard/new-feature' },
   ]
   ```
