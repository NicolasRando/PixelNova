# PixelNova — Network Monitor Dashboard

<p align="center">
  <img src="public/favicon.svg" alt="PixelNova Logo" width="80" height="80">
</p>

<p align="center">
  <strong>Dashboard de monitoring reseau en temps reel</strong><br>
  Surveillez la disponibilite et les performances de vos services web.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma" alt="Prisma">
  <img src="https://img.shields.io/badge/Chart.js-4-FF6384?logo=chart.js&logoColor=white" alt="Chart.js">
  <img src="https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white" alt="Vitest">
  <img src="https://img.shields.io/badge/Playwright-1.58-45ba4b?logo=playwright&logoColor=white" alt="Playwright">
</p>

---

## Demo

**Production** : https://pixel-nova-sigma.vercel.app

---

## Fonctionnalites

### V1 — Fondations
- **Monitoring automatique** — Verification HTTP periodique (1, 5, 15 ou 30 min)
- **Dashboard temps reel** — Compteurs UP/DOWN et cartes de statut
- **Graphiques de latence** — Courbe de performance via Chart.js
- **Gestion CRUD** — Ajouter, modifier, supprimer des services
- **Systeme d'alertes** — Bandeau d'alerte et badge notification
- **Page de detail** — Stats uptime, latence moy/min/max, historique
- **Responsive** — Desktop, tablette et mobile
- **Retention intelligente** — 10 derniers UP, tous les DOWN conserves

### V2 — Auth, Dark Mode, Tests
- **Authentification** — NextAuth.js avec credentials, bcrypt, JWT
- **Protection des routes** — Middleware auth + filtrage par userId
- **Cron serverless** — Vercel Cron (1x/jour) + MonitorWorker client
- **Dark mode** — Toggle avec persistance localStorage
- **Tests unitaires** — 17 tests Vitest (validation, logique metier)
- **Tests E2E** — 9 tests Playwright (auth, navigation)
- **CI/CD** — GitHub Actions (3 jobs : lint+build, unit, E2E)

### V3 — En cours de developpement
- **Auth officielle** — Auth.js v5 avec OAuth Google/GitHub, verification email, reset password
- **Profil utilisateur** — Avatar, preferences, gestion du compte
- **Validation Zod** — Validation typee de toutes les entrees API
- **Securite** — Rate limiting, API keys, audit log, CSRF
- **Monitoring avance** — SSL, TCP/UDP, DNS, keyword, uptime %
- **Notifications** — Email (Resend), Discord, Slack, Telegram, webhooks
- **Incidents** — Creation auto, timeline, post-mortem, maintenance planifiee
- **Status page publique** — Page partageable avec heatmap et SLA
- **Dashboard enrichi** — SSE temps reel, filtres, export CSV/PDF
- **Teams** — Organisations, roles (owner/admin/editor/viewer), invitations
- **Integrations** — API publique Swagger, bots Slack/Discord, Zapier
- **Analytics** — Rapports auto, predictions, metriques MTTR/MTTA
- **UX/UI** — Framer Motion, drag & drop, raccourcis clavier, PWA, i18n FR/EN
- **Infra** — Docker, Redis, Prometheus, feature flags, CI/CD avance

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 16 (App Router) |
| Langage | TypeScript 6 (strict) |
| ORM | Prisma 7 + libSQL adapter |
| BDD | SQLite (dev) / Turso (prod) |
| CSS | Tailwind CSS 4 |
| Graphiques | Chart.js + react-chartjs-2 |
| Auth | NextAuth.js v4 (V2) -> Auth.js v5 (V3) |
| Tests | Vitest + Playwright |
| CI/CD | GitHub Actions |
| Deploy | Vercel |

## Installation

```bash
# Cloner le repo
git clone https://github.com/NicolasRando/PixelNova.git
cd PixelNova

# Installer les dependances
npm install

# Generer le client Prisma
npx prisma generate

# Lancer en developpement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de developpement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | Linter ESLint |
| `npm test` | Tests unitaires (Vitest) |
| `npm run test:watch` | Tests en mode watch |
| `npm run test:e2e` | Tests E2E (Playwright) |

## Structure du projet

```
src/
├── app/
│   ├── page.tsx                    # Dashboard
│   ├── not-found.tsx               # Page 404
│   ├── login/page.tsx              # Connexion
│   ├── register/page.tsx           # Inscription
│   ├── services/
│   │   ├── page.tsx                # Gestion des services
│   │   └── [id]/page.tsx           # Detail d'un service
│   └── api/
│       ├── auth/                   # Auth (register, NextAuth)
│       ├── cron/monitor/route.ts   # Cron Vercel
│       ├── monitor/route.ts        # Monitoring client
│       └── services/               # CRUD services + checks
├── components/                     # Composants React
├── lib/                            # Logique metier (db, auth, monitor)
├── middleware.ts                    # Auth middleware
└── types/                          # Types TypeScript
tests/
├── unit/                           # Tests Vitest (17 tests)
└── e2e/                            # Tests Playwright (9 tests)
```

## Auteur

**Nicolas Rando** — [GitHub](https://github.com/NicolasRando)

---

Realise comme projet portfolio fullstack — V1 (3 jours), V2 (2 jours), V3 (13 jours en cours).
