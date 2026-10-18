# Project Execution Plan: Zest Chennai

A friend-driven restaurant recommendation & taste graph platform for Chennai, India.

---

## 1. What We Have Done (Completed)

| ID | Module / Feature | Description | Status | Tech / Files |
| :--- | :--- | :--- | :---: | :--- |
| **DONE-01** | **Product & Tech Blueprint** | Complete specifications for Stakeholders, Investors, VP of Tech, and Principal Engineer | ✅ Completed | [`chennai_mvp_product_spec.md`](../.gemini/antigravity/brain/bafd83a5-0171-43ef-a715-70b8063893fc/chennai_mvp_product_spec.md) |
| **DONE-02** | **Project Scaffolding** | Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 PWA setup | ✅ Completed | [`package.json`](./package.json), [`next.config.ts`](./next.config.ts) |
| **DONE-03** | **Central Chennai Seed Data** | Curated iconic spots in Alwarpet, Mylapore, Nungambakkam, and T. Nagar with verified tags | ✅ Completed | [`src/data/centralChennaiSeed.ts`](./src/data/centralChennaiSeed.ts) |
| **DONE-04** | **Recommendation Logic** | Mathematical formulation for Repeat Index, friend weights, and recency decay | ✅ Completed | [`src/lib/recommendation.ts`](./src/lib/recommendation.ts) |
| **DONE-05** | **10-Second Micro Logger** | Fast review wizard (Loved & Repeat, Good Once, Skip), dish pills, and vibe chips | ✅ Completed | [`src/components/QuickLoggerModal.tsx`](./src/components/QuickLoggerModal.tsx) |
| **DONE-06** | **Friday Night Consensus** | Group decider engine that overlaps friend wishlists, past visits, and filters vetoes | ✅ Completed | [`src/components/ConsensusDrawer.tsx`](./src/components/ConsensusDrawer.tsx) |
| **DONE-07** | **Interactive Vector Map** | Leaflet-based dark mode map with custom friend repeat pins (`🔥`) and popups | ✅ Completed | [`src/components/MapView.tsx`](./src/components/MapView.tsx) |
| **DONE-08** | **WhatsApp Sharing** | Instant group chat snippet generator with direct WhatsApp web/app deep link | ✅ Completed | [`src/components/WhatsAppShareModal.tsx`](./src/components/WhatsAppShareModal.tsx) |
| **DONE-09** | **Auth Modal Interface** | Google OAuth flow + modular Phone OTP simulator (Dev code `1234`) | ✅ Completed | [`src/components/AuthModal.tsx`](./src/components/AuthModal.tsx) |
| **DONE-10** | **Typography & UI Polish** | Plus Jakarta Sans, JetBrains Mono, glassmorphism, floating iOS dock, dietary tags | ✅ Completed | [`src/app/globals.css`](./src/app/globals.css), [`layout.tsx`](./src/app/layout.tsx) |
| **DONE-11** | **Git Local Repository** | Clean git initialization, all assets committed to local `main` branch | ✅ Completed | Git commit `1cb1232` |

---

## 2. What Needs to Be Done (Next Immediate Tasks)

### Phase 1: GitHub Push & Cloud Deployment (Immediate)

| ID | Task | Actionable Steps | Priority | Status |
| :--- | :--- | :--- | :---: | :---: |
| **TASK-01** | **Create GitHub Repository** | Create empty repo `zest-chennai` on [github.com/new](https://github.com/new) under `@Chakels007` | **P0** | ✅ Completed |
| **TASK-02** | **Push Codebase to GitHub** | Codebase pushed to `https://github.com/Chakels007/zest-chennai.git` (`main` branch) | **P0** | ✅ Completed |
| **TASK-03** | **Vercel 1-Click Deployment** | Connect GitHub repo to Vercel for public HTTPS preview URL | **P1** | 📋 Next |
| **TASK-04** | **PWA Install Banner** | Add "Add to Home Screen" prompt for mobile Safari and Android Chrome | **P1** | 📋 Next |

---

### Phase 2: Live Backend & Database (Weeks 1–2)

| ID | Task | Actionable Steps | Priority | Status |
| :--- | :--- | :--- | :---: | :---: |
| **TASK-05** | **Cloud PostgreSQL Setup** | Connect Supabase or Neon PostgreSQL instance with PostGIS enabled | **P0** | 📋 Planned |
| **TASK-06** | **Drizzle ORM Migrations** | Run schema migrations for `users`, `restaurants`, `visits`, `wishlists` | **P0** | 📋 Planned |
| **TASK-07** | **Live Google OAuth** | Configure NextAuth.js / Supabase Auth with Google Cloud Client ID & Secret | **P1** | 📋 Planned |
| **TASK-08** | **Live WhatsApp/SMS Gateway** | Connect MSG91 or Twilio / WhatsApp Cloud API for live Indian mobile OTP | **P2** | 📋 Planned |

---

### Phase 3: Chennai Venue Expansion & Viral Loops (Month 1)

| ID | Task | Actionable Steps | Priority | Status |
| :--- | :--- | :--- | :---: | :---: |
| **TASK-09** | **Expand Chennai Seed Data** | Scale from 10 to 150+ venues across Besant Nagar, ECR, Anna Nagar, and OMR | **P1** | 📋 Planned |
| **TASK-10** | **Taste Onboarding Quiz** | 60-second quiz (rate 5 iconic Chennai spots) to match taste twins | **P2** | 📋 Planned |
| **TASK-11** | **Dynamic OG Image Engine** | Auto-generate branded link preview images (`/api/og`) for WhatsApp group shares | **P2** | 📋 Planned |
| **TASK-12** | **Foodie Tastemaker Pilot** | Onboard 50 food lovers from IIT-M, Anna University, and DLF tech parks | **P1** | 📋 Planned |
