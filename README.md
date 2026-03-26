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
</p>

---

## Fonctionnalites

- **Monitoring automatique** — Verification HTTP periodique de vos services (1, 5, 15 ou 30 min)
- **Dashboard temps reel** — Vue d'ensemble avec compteurs UP/DOWN et cartes de statut
- **Graphiques de latence** — Courbe de performance avec historique via Chart.js
- **Gestion CRUD** — Ajouter, modifier et supprimer des services a surveiller
- **Systeme d'alertes** — Bandeau d'alerte et badge de notification quand un service tombe
- **Page de detail** — Stats (uptime %, latence moy/min/max), historique des checks
- **Responsive** — Interface adaptee desktop, tablette et mobile
- **Retention intelligente** — Conserve les 10 derniers checks UP, garde tous les DOWN

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 16 (App Router) |
| Langage | TypeScript (strict) |
| ORM | Prisma 7 + libSQL adapter |
| Base de donnees | SQLite |
| CSS | Tailwind CSS 4 |
| Graphiques | Chart.js + react-chartjs-2 |

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

## Structure du projet

```
src/
├── app/
│   ├── page.tsx                    # Dashboard
│   ├── services/
│   │   ├── page.tsx                # Gestion des services
│   │   └── [id]/page.tsx           # Detail d'un service
│   └── api/
│       ├── monitor/route.ts        # Monitoring automatique
│       └── services/
│           ├── route.ts            # GET all, POST
│           └── [id]/
│               ├── route.ts        # GET, PUT, DELETE
│               ├── checks/route.ts # Historique des checks
│               └── check/route.ts  # Check manuel
├── components/
│   ├── Navbar.tsx                  # Navigation + badge alertes
│   ├── StatusCard.tsx              # Carte de statut d'un service
│   ├── LatencyChart.tsx            # Graphique de latence
│   ├── ServiceForm.tsx             # Formulaire ajout/edition
│   ├── DeleteModal.tsx             # Modal de confirmation
│   ├── AlertBanner.tsx             # Bandeau d'alerte DOWN
│   ├── MonitorWorker.tsx           # Worker de monitoring auto
│   └── Logo.tsx                    # Logo SVG custom
├── lib/
│   ├── db.ts                       # Instance Prisma + SQLite
│   └── monitor.ts                  # Logique de check HTTP
└── types/
    └── index.ts                    # Types partages
```

## API Endpoints

| Methode | Route | Description |
|---------|-------|-------------|
| GET | /api/services | Liste tous les services |
| POST | /api/services | Cree un service |
| GET | /api/services/:id | Detail d'un service |
| PUT | /api/services/:id | Modifie un service |
| DELETE | /api/services/:id | Supprime un service |
| GET | /api/services/:id/checks | Historique des checks |
| POST | /api/services/:id/check | Check manuel |
| POST | /api/monitor | Verifie les services expires |

## Roadmap V2

- [ ] Migration vers Drizzle ORM + Supabase (PostgreSQL)
- [ ] Authentification utilisateur
- [ ] Notifications email/SMS
- [ ] Monitoring TCP/UDP
- [ ] Export CSV des donnees
- [ ] Dark/Light mode
- [ ] Tests unitaires et d'integration

## Auteur

**Nicolas Rando** — [GitHub](https://github.com/NicolasRando)

---

Realise en 3 jours comme projet portfolio fullstack.
