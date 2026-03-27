# Architecture - PixelNova

> Document evolutif - Mis a jour a chaque decision technique

## Stack technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| Framework | Next.js (App Router) | 16.2.1 |
| Langage | TypeScript | 6.x |
| ORM | Prisma + @prisma/adapter-libsql | 7.5.0 |
| Base de donnees | SQLite (local) / Turso (prod) via libSQL | - |
| CSS | Tailwind CSS | 4.2.2 |
| Graphiques | Chart.js + react-chartjs-2 | 4.x |
| Auth | NextAuth.js | - |
| Tests | Vitest + Playwright | - |
| CI/CD | GitHub Actions | - |
| Deploiement | Vercel | - |

---

## Structure du projet

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
│   │   ├── services/
│   │   │   ├── page.tsx      # Gestion des services
│   │   │   └── [id]/
│   │   │       └── page.tsx  # Detail d'un service
│   │   ├── login/            # Page de connexion (V2)
│   │   │   └── page.tsx
│   │   ├── register/         # Page d'inscription (V2)
│   │   │   └── page.tsx
│   │   └── api/              # Backend (API routes)
│   │       ├── auth/                 # Auth routes (V2)
│   │       │   ├── register/
│   │       │   │   └── route.ts
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts
│   │       ├── cron/                 # Cron routes (V2)
│   │       │   └── monitor/
│   │       │       └── route.ts
│   │       └── services/
│   │           ├── route.ts          # GET all, POST
│   │           └── [id]/
│   │               ├── route.ts      # GET one, PUT, DELETE
│   │               ├── checks/
│   │               │   └── route.ts  # GET checks
│   │               └── check/
│   │                   └── route.ts  # POST trigger check
│   ├── components/           # Composants reutilisables
│   │   ├── Navbar.tsx
│   │   ├── StatusCard.tsx
│   │   ├── LatencyChart.tsx
│   │   ├── ServiceForm.tsx
│   │   ├── AlertBanner.tsx
│   │   ├── DeleteModal.tsx
│   │   ├── ThemeProvider.tsx  # Provider dark mode (V2)
│   │   ├── ThemeToggle.tsx    # Toggle dark/light (V2)
│   │   └── Logo.tsx
│   ├── lib/                  # Logique metier et utilitaires
│   │   ├── db.ts             # Instance Prisma (local / Turso)
│   │   └── monitor.ts        # Logique de check HTTP
│   └── types/                # Types TypeScript
│       └── index.ts          # Types partages
├── prisma/
│   ├── schema.prisma         # Schema de la BDD
│   └── migrations/           # Historique des migrations
├── public/                   # Assets statiques
│   └── favicon.svg
├── tests/                    # Tests (V2)
│   ├── unit/                 # Tests Vitest
│   └── e2e/                  # Tests Playwright
├── .github/
│   └── workflows/            # CI/CD GitHub Actions (V2)
│       └── ci.yml
├── vercel.json               # Config Vercel Cron (V2)
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Flux de donnees

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

Auth Middleware (V2) ──── verifie session ──── bloque si non authentifie
       |
       v
MonitorWorker (client) ---POST /api/monitor---> API Routes ---HTTP GET---> Services externes

Vercel Cron (V2) ---POST /api/cron/monitor (CRON_SECRET)---> API Routes ---HTTP GET---> Services externes
```

---

## Decisions techniques

| Decision | Choix | Pourquoi |
|----------|-------|----------|
| App Router vs Pages Router | App Router | Standard actuel de Next.js, meilleur pour apprendre |
| SQLite vs PostgreSQL | SQLite + Turso | Zero config en local, Turso cloud pour Vercel (serverless) |
| Prisma vs Drizzle | Prisma | Plus accessible pour un debutant, bonne doc |
| Chart.js vs Recharts | Chart.js | Plus leger, suffisant pour nos besoins |
| NextAuth vs Clerk | NextAuth.js | Plus flexible, gratuit, controle total (V2) |
| Vitest vs Jest | Vitest | Plus rapide, natif ESM, meilleure DX (V2) |
| Cron Vercel vs MonitorWorker | Cron Vercel | Fiable 24/7, pas de dependance client (V2) |

---

## Notes d'architecture

- Prisma v7 ne supporte plus le driver SQLite natif, on utilise `@prisma/adapter-libsql` comme adapter.
- Les tables sont creees au demarrage via libSQL (`CREATE TABLE IF NOT EXISTS`) car les migrations Prisma natives ne sont pas compatibles avec le driver libSQL.
- Le chemin vers la BDD est resolu dynamiquement avec `process.cwd()` et les backslashes Windows sont convertis en forward slashes pour la compatibilite libSQL.
- **Turso en production** : `db.ts` detecte les variables `TURSO_DATABASE_URL` et `TURSO_AUTH_TOKEN`. Si presentes, connexion cloud. Sinon, fallback sur SQLite local.
- **Monitoring automatique** : `MonitorWorker` (composant invisible dans le layout) appelle `/api/monitor` toutes les 30s. Le endpoint verifie les services dont le dernier check depasse l'intervalle configure.
- **Retention des checks** : Seuls les 10 derniers checks UP sont conserves par service. Les checks DOWN ne sont jamais supprimes.
- **Cron serverless (V2)** : Vercel Cron remplace le MonitorWorker client. Le endpoint `/api/cron/monitor` est appele automatiquement par Vercel selon la config `vercel.json`. Securise par `CRON_SECRET` pour empecher les appels externes.
- **Auth middleware (V2)** : NextAuth.js protege toutes les routes API. Les requetes sans session valide sont rejetees (401). Les pages frontend redirigent vers `/login` si non authentifie.
- **Dark mode (V2)** : Strategie Tailwind `dark:` class. Un `ThemeProvider` gere l'etat global, le toggle est dans la navbar, et le choix est persiste dans `localStorage`.

