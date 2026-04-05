# Architecture - PixelNova

> Document evolutif - Mis a jour a chaque decision technique

## Stack technique

### V1-V2 (actuel)

| Couche | Technologie | Version |
|--------|-------------|---------|
| Framework | Next.js (App Router) | 16.2.1 |
| Langage | TypeScript | 6.x |
| ORM | Prisma + @prisma/adapter-libsql | 7.5.0 |
| Base de donnees | SQLite (local) / Turso (prod) via libSQL | - |
| CSS | Tailwind CSS | 4.2.2 |
| Graphiques | Chart.js + react-chartjs-2 | 4.x |
| Auth | NextAuth.js v4 (credentials) | 4.24 |
| Tests | Vitest + Playwright | 4.1 / 1.58 |
| CI/CD | GitHub Actions | 3 jobs |
| Deploiement | Vercel | - |

### V3 (prevu)

| Couche | Technologie | Pourquoi |
|--------|-------------|----------|
| Auth | Auth.js v5 + OAuth (Google, GitHub) | Auth professionnelle, providers multiples |
| Validation | Zod | Validation typee de toutes les entrees API |
| Email | Resend | Notifications, verification email, rapports |
| Temps reel | Server-Sent Events (SSE) | Dashboard live sans refresh |
| Animations | Framer Motion | Transitions fluides et professionnelles |
| i18n | next-intl | Internationalisation FR/EN |
| Cache | Redis (Vercel Marketplace) | Cache des checks recents |
| Queue | Trigger.dev ou BullMQ | Jobs de monitoring en arriere-plan |
| Containerisation | Docker + docker-compose | Setup en une commande |
| Metriques | Prometheus | Monitoring de l'app elle-meme |
| Feature flags | Vercel Edge Config | Activation/desactivation de features |
| API docs | Swagger / OpenAPI | Documentation API interactive |
| Bot | Slack + Discord + Telegram | Notifications et commandes |
| PWA | next-pwa | Installation mobile native |

---

## Structure du projet (V2 actuel)

```
pixelnova/
├── docs/                     # Documentation du projet
│   ├── PLANNING.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── MINDMAP.md
│   └── CAHIER_DES_CHARGES.md
├── src/
│   ├── app/                  # Pages (App Router Next.js)
│   │   ├── layout.tsx        # Layout principal
│   │   ├── page.tsx          # Dashboard (accueil)
│   │   ├── not-found.tsx     # Page 404 custom
│   │   ├── services/
│   │   │   ├── page.tsx      # Gestion des services
│   │   │   └── [id]/
│   │   │       └── page.tsx  # Detail d'un service
│   │   ├── login/page.tsx    # Connexion
│   │   ├── register/page.tsx # Inscription
│   │   └── api/              # Backend (API routes)
│   │       ├── auth/
│   │       │   ├── register/route.ts
│   │       │   └── [...nextauth]/route.ts
│   │       ├── cron/monitor/route.ts
│   │       ├── monitor/route.ts
│   │       └── services/
│   │           ├── route.ts
│   │           └── [id]/
│   │               ├── route.ts
│   │               ├── checks/route.ts
│   │               └── check/route.ts
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── StatusCard.tsx
│   │   ├── LatencyChart.tsx
│   │   ├── ServiceForm.tsx
│   │   ├── AlertBanner.tsx
│   │   ├── DeleteModal.tsx
│   │   ├── MonitorWorker.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── SessionProvider.tsx
│   │   └── Logo.tsx
│   ├── lib/
│   │   ├── db.ts             # Instance Prisma (local / Turso)
│   │   ├── auth.ts           # Config NextAuth.js
│   │   ├── session.ts        # Helper auth session
│   │   └── monitor.ts        # Logique de check HTTP
│   ├── middleware.ts          # Auth middleware (protection pages)
│   └── types/
│       ├── index.ts
│       └── next-auth.d.ts
├── tests/
│   ├── setup.ts              # Setup Vitest
│   ├── unit/
│   │   └── validation.test.ts  # 17 tests unitaires
│   └── e2e/
│       ├── auth.spec.ts      # 6 tests E2E auth
│       └── navigation.spec.ts # 3 tests E2E navigation
├── prisma/
│   └── schema.prisma
├── .github/workflows/ci.yml  # CI/CD GitHub Actions
├── vercel.json               # Config Vercel Cron
├── vitest.config.ts
├── playwright.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### Structure V3 (prevue)

```
Nouvelles additions V3 :
├── src/
│   ├── app/
│   │   ├── profile/page.tsx          # Page profil utilisateur
│   │   ├── status/[userId]/page.tsx  # Status page publique
│   │   ├── incidents/page.tsx        # Dashboard incidents
│   │   ├── analytics/page.tsx        # Analytics & rapports
│   │   ├── settings/page.tsx         # Parametres organisation
│   │   └── api/
│   │       ├── auth/                 # Auth.js v5 routes
│   │       │   ├── forgot-password/
│   │       │   └── reset-password/
│   │       ├── incidents/            # CRUD incidents
│   │       ├── notifications/        # Preferences notifications
│   │       ├── organizations/        # Teams & orgs
│   │       ├── api-keys/             # Gestion API keys
│   │       ├── audit-log/            # Historique d'activite
│   │       ├── reports/              # Generation rapports
│   │       ├── status/               # Status page data
│   │       ├── webhooks/             # Webhooks sortants
│   │       ├── health/               # Health check
│   │       └── metrics/              # Prometheus metrics
│   ├── components/
│   │   ├── incidents/                # Composants incidents
│   │   ├── notifications/            # Composants notifications
│   │   ├── organizations/            # Composants teams
│   │   └── analytics/               # Composants rapports
│   ├── lib/
│   │   ├── email.ts                  # Client Resend
│   │   ├── zod-schemas.ts            # Schemas de validation
│   │   ├── rate-limit.ts             # Rate limiting
│   │   ├── api-keys.ts               # Logique API keys
│   │   ├── incidents.ts              # Logique incidents
│   │   ├── notifications.ts          # Logique notifications
│   │   ├── ssl-check.ts              # Verification SSL
│   │   ├── dns-check.ts              # Verification DNS
│   │   ├── tcp-check.ts              # Ping TCP/UDP
│   │   └── predictions.ts            # ML predictions
│   └── i18n/                         # Traductions FR/EN
├── docker-compose.yml
├── Dockerfile
└── swagger.yaml                      # OpenAPI spec
```

---

## Flux de donnees

### V2 (actuel)

```
Utilisateur (navigateur)
       |
       v
Next.js Frontend (React + SSR)
       |
       v  fetch("/api/...")
API Routes (backend Next.js)
       |
       v  Prisma ORM
SQLite local (dev) / Turso cloud (prod)

Auth Middleware ──── verifie session ──── bloque si non authentifie
       |
       v
MonitorWorker (client) ---POST /api/monitor---> API Routes ---HTTP GET---> Services externes

Vercel Cron ---GET /api/cron/monitor (CRON_SECRET)---> API Routes ---HTTP GET---> Services externes
```

### V3 (prevu)

```
Utilisateur (navigateur / PWA mobile)
       |
       ├── OAuth (Google, GitHub) ──> Auth.js v5 ──> Session
       |
       v
Next.js Frontend (React + Framer Motion + SSE temps reel)
       |
       ├── fetch("/api/...") ──> Zod validation ──> Rate limiter ──> API Routes
       |                                                                  |
       |                                                                  v
       |                                                            Prisma ORM
       |                                                                  |
       |                                                                  v
       |                                                     SQLite (dev) / Turso (prod) + Redis cache
       |
       ├── SSE /api/events ──> Mise a jour temps reel du dashboard
       |
       └── API keys ──> Integrations externes (Slack, Discord, Telegram, Zapier)

Vercel Cron ──> Queue de jobs ──> Checks HTTP/SSL/TCP/DNS ──> Notifications multi-canal
                                                                     |
                                                              ┌──────┴──────┐
                                                              |    Email    |
                                                              |   Discord   |
                                                              |    Slack    |
                                                              |  Telegram   |
                                                              |  Webhooks   |
                                                              └─────────────┘

Status page publique (/status/:userId) ──> Accessible sans auth ──> SEO optimise
Incidents ──> Creation auto apres X DOWN ──> Timeline ──> Post-mortem ──> Resolution
Analytics ──> Rapports auto ──> Email hebdo/mensuel ──> Predictions ML
```

---

## Decisions techniques

### V1

| Decision | Choix | Pourquoi |
|----------|-------|----------|
| App Router vs Pages Router | App Router | Standard actuel de Next.js, meilleur pour apprendre |
| SQLite vs PostgreSQL | SQLite + Turso | Zero config en local, Turso cloud pour Vercel (serverless) |
| Prisma vs Drizzle | Prisma | Plus accessible pour un debutant, bonne doc |
| Chart.js vs Recharts | Chart.js | Plus leger, suffisant pour nos besoins |

### V2

| Decision | Choix | Pourquoi |
|----------|-------|----------|
| NextAuth vs Clerk | NextAuth.js v4 | Plus flexible, gratuit, controle total |
| Vitest vs Jest | Vitest | Plus rapide, natif ESM, meilleure DX |
| Cron Vercel vs Worker | Cron Vercel | Fiable 24/7, pas de dependance client |
| Tailwind dark variant | @variant dark class | Compatible Tailwind CSS 4, localStorage |

### V3 (prevu)

| Decision | Choix | Pourquoi |
|----------|-------|----------|
| NextAuth v4 vs Auth.js v5 | Auth.js v5 | Standard actuel, meilleur support OAuth, adapters natifs |
| Validation manuelle vs Zod | Zod | Type-safe, reutilisable, standard de l'ecosysteme |
| SendGrid vs Resend | Resend | API moderne, 100 emails/jour gratuit, DX excellente |
| WebSocket vs SSE | SSE | Plus simple, suffisant pour du push unidirectionnel |
| CSS animations vs Framer Motion | Framer Motion | Animations complexes, layout animations, gestures |
| next-i18next vs next-intl | next-intl | Meilleur support App Router, plus moderne |
| Bull vs Trigger.dev | Trigger.dev | Serverless natif, pas besoin de Redis pour les jobs |
| Feature flags custom vs Edge Config | Edge Config | Integre Vercel, latence ultra-faible, global |

---

## Notes d'architecture

### V1-V2
- Prisma v7 ne supporte plus le driver SQLite natif, on utilise `@prisma/adapter-libsql` comme adapter.
- Les tables sont creees au demarrage via libSQL (`CREATE TABLE IF NOT EXISTS`) car les migrations Prisma natives ne sont pas compatibles avec le driver libSQL.
- Le chemin vers la BDD est resolu dynamiquement avec `process.cwd()` et les backslashes Windows sont convertis en forward slashes pour la compatibilite libSQL.
- **Turso en production** : `db.ts` detecte les variables `TURSO_DATABASE_URL` et `TURSO_AUTH_TOKEN`. Si presentes, connexion cloud. Sinon, fallback sur SQLite local.
- **Monitoring automatique** : `MonitorWorker` appelle `/api/monitor` toutes les 60s quand l'utilisateur est connecte. Cron Vercel appele 1x/jour (limite Hobby).
- **Retention des checks** : Seuls les 10 derniers checks UP sont conserves par service. Les checks DOWN ne sont jamais supprimes.
- **Auth middleware** : `getToken` de next-auth/jwt pour Next.js 16 (export default de next-auth/middleware non supporte).
- **Dark mode** : `@variant dark (&:where(.dark, .dark *))` en Tailwind CSS 4. `suppressHydrationWarning` sur `<html>` pour eviter les conflits React/classList.

### V3 (prevu)
- **Auth.js v5** : migration depuis NextAuth v4. Nouveaux adapters Prisma, tables Account/Session/VerificationToken ajoutees au schema.
- **Zod** : chaque endpoint API aura un schema de validation. Les schemas seront partages entre frontend et backend.
- **SSE** : un endpoint `/api/events` maintiendra une connexion ouverte pour pousser les mises a jour en temps reel au dashboard.
- **Redis** : cache des derniers checks pour accelerer le chargement du dashboard. Invalidation lors de nouveaux checks.
- **Incidents automatiques** : apres 3 checks DOWN consecutifs, un incident est cree automatiquement avec une timeline. Resolution auto quand le service remonte.
- **Status page** : route publique sans auth. Les donnees sont filtrees cote serveur pour n'exposer que l'uptime et les incidents.
- **PWA** : manifest.json + service worker pour installation mobile. Notifications push via Web Push API.
- **Docker** : multi-stage build pour image legere. docker-compose avec Redis + app.
