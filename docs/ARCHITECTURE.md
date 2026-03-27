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
│   │   └── api/              # Backend (API routes)
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
│   │   ├── MonitorWorker.tsx
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

MonitorWorker (client) ---POST /api/monitor---> API Routes ---HTTP GET---> Services externes
```

---

## Decisions techniques

| Decision | Choix | Pourquoi |
|----------|-------|----------|
| App Router vs Pages Router | App Router | Standard actuel de Next.js, meilleur pour apprendre |
| SQLite vs PostgreSQL | SQLite + Turso | Zero config en local, Turso cloud pour Vercel (serverless) |
| Prisma vs Drizzle | Prisma | Plus accessible pour un debutant, bonne doc |
| Chart.js vs Recharts | Chart.js | Plus leger, suffisant pour nos besoins |

---

## Notes d'architecture

- Prisma v7 ne supporte plus le driver SQLite natif, on utilise `@prisma/adapter-libsql` comme adapter.
- Les tables sont creees au demarrage via libSQL (`CREATE TABLE IF NOT EXISTS`) car les migrations Prisma natives ne sont pas compatibles avec le driver libSQL.
- Le chemin vers la BDD est resolu dynamiquement avec `process.cwd()` et les backslashes Windows sont convertis en forward slashes pour la compatibilite libSQL.
- **Turso en production** : `db.ts` detecte les variables `TURSO_DATABASE_URL` et `TURSO_AUTH_TOKEN`. Si presentes, connexion cloud. Sinon, fallback sur SQLite local.
- **Monitoring automatique** : `MonitorWorker` (composant invisible dans le layout) appelle `/api/monitor` toutes les 30s. Le endpoint verifie les services dont le dernier check depasse l'intervalle configure.
- **Retention des checks** : Seuls les 10 derniers checks UP sont conserves par service. Les checks DOWN ne sont jamais supprimes.

