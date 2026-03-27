# Planning - PixelNova

> Document evolutif - Mis a jour au fur et a mesure de l'avancement

## Vue d'ensemble

| Jour | Objectif | Statut |
|------|----------|--------|
| J1 | Setup + Backend | Termine |
| J2 | Frontend | Termine |
| J3 | Polish + Deploy | Termine |

---

## Jour 1 - Setup + Backend

### Matin
- [x] Initialiser le projet Next.js + TypeScript
- [x] Configurer Tailwind CSS
- [x] Configurer Prisma + SQLite
- [x] Definir le schema de la base de donnees (Service, Check)
- [x] Executer la premiere migration

### Apres-midi
- [x] Creer les API routes CRUD pour les services
  - [x] GET /api/services
  - [x] POST /api/services
  - [x] GET /api/services/:id
  - [x] PUT /api/services/:id
  - [x] DELETE /api/services/:id
- [x] Creer les API routes pour les checks
  - [x] GET /api/services/:id/checks
  - [x] POST /api/services/:id/check
- [x] Implementer la logique de monitoring (HTTP check)
- [x] Tester toutes les routes avec des requetes manuelles

### Livrable J1
> API fonctionnelle, base de donnees configuree, monitoring operationnel

---

## Jour 2 - Frontend

### Matin
- [x] Creer le layout principal (Navbar, structure des pages)
- [x] Page Dashboard : compteurs UP/DOWN, cartes de statut
- [x] Composant StatusCard

### Apres-midi
- [x] Page Gestion des services : formulaire + liste
- [x] Page Detail d'un service : graphiques Chart.js, historique
- [x] Composant LatencyChart (courbe de latence)
- [x] Connecter le frontend aux API routes

### Livrable J2
> Interface complete et fonctionnelle, navigation entre les pages

---

## Jour 3 - Polish + Deploy

### Matin
- [x] Systeme d'alertes (AlertBanner DOWN, badge rouge Navbar)
- [x] Responsive design (mobile burger menu, tablette, desktop)
- [x] Loading states et empty states
- [x] Retention intelligente (10 derniers UP, tous les DOWN conserves)

### Apres-midi
- [x] Finitions (favicon SVG, page 404 custom, animations glow)
- [x] Rediger le README.md complet
- [x] Migration base de donnees vers Turso (cloud libSQL)
- [x] Deployer sur Vercel
- [x] Tests finaux sur l'URL de production

### Livrable J3
> Application deployee, accessible en ligne, README complet

---

## V2 - Authentification, Cron, Dark Mode, Tests, CI/CD

### Vue d'ensemble V2

| Jour | Objectif | Statut |
|------|----------|--------|
| J4 | Auth + Cron Vercel | En attente |
| J5 | Dark mode + Tests + CI/CD | En attente |

---

## Jour 4 - Auth + Cron Vercel

### Matin
- [ ] NextAuth.js setup (provider credentials)
- [ ] Creer la table User dans le schema Prisma
- [ ] Pages login et register
- [ ] Protection des routes API (auth requise)
- [ ] Middleware auth (redirection si non connecte)

### Apres-midi
- [ ] Cron Vercel (configuration vercel.json)
- [ ] Supprimer le MonitorWorker (remplace par cron serverless)
- [ ] Endpoint /api/cron/monitor securise avec CRON_SECRET
- [ ] Tests de fiabilite monitoring 24/7

### Livrable J4
> Authentification complete, monitoring serverless autonome

---

## Jour 5 - Dark Mode + Tests + CI/CD

### Matin
- [ ] Dark mode : ThemeProvider, toggle dans la navbar
- [ ] Tailwind dark: classes sur tous les composants
- [ ] Persistance du theme dans localStorage
- [ ] Adapter tous les composants existants au dark mode

### Apres-midi
- [ ] Tests unitaires avec Vitest (logique metier + API routes)
- [ ] Tests E2E avec Playwright (parcours utilisateur complets)
- [ ] CI/CD GitHub Actions (lint, tests, deploy auto sur Vercel)

### Livrable J5
> App professionnelle avec auth, dark mode, tests, CI/CD

---

## Notes et decisions en cours de route

- **Prisma v7 + libSQL** : Prisma v7 necessite un adapter (plus de driver natif SQLite). On utilise `@prisma/adapter-libsql` + `@libsql/client`. Les tables sont creees via libSQL au demarrage car `prisma migrate` natif et libSQL ne partagent pas le meme format de fichier.
- **Tous les endpoints API testes et valides** : CRUD complet, validation, check HTTP avec mesure de latence, gestion des erreurs (timeout, DNS, etc.).
- **Frontend complet** : Navbar sticky, Dashboard avec compteurs et StatusCard, page Services avec formulaire CRUD + modal suppression, page Detail avec graphique Chart.js et tableau historique. Auto-refresh 30s, loading states, empty states.
- **Monitoring automatique** : MonitorWorker en layout qui appelle `/api/monitor` toutes les 30s. Retention : 10 derniers checks UP conserves, tous les DOWN conserves.
- **Turso (cloud libSQL)** : Migration de SQLite local vers Turso pour deploiement Vercel (serverless). `db.ts` detecte automatiquement l'environnement (local vs cloud).
- **Deploiement Vercel** : https://pixel-nova-sigma.vercel.app — build OK, variables d'environnement TURSO_DATABASE_URL et TURSO_AUTH_TOKEN configurees.

