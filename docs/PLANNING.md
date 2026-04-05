# Planning - PixelNova

> Document evolutif - Mis a jour au fur et a mesure de l'avancement

## Vue d'ensemble

| Version | Jours | Statut |
|---------|-------|--------|
| V1 | J1 - J3 | Termine |
| V2 | J4 - J5 | Termine |
| V3 | J6 - J18 | En cours |

---

# V1 — Fondations

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

# V2 — Auth, Dark Mode, Tests, CI/CD

## Jour 4 - Auth + Cron Vercel

### Matin
- [x] NextAuth.js setup (provider credentials, session JWT, bcrypt)
- [x] Creer la table User dans le schema Prisma + ensureTables
- [x] Pages login et register (avec auto-login apres inscription)
- [x] Protection des routes API (auth requise, filtrage par userId)
- [x] Middleware auth (redirection vers /login si non connecte)

### Apres-midi
- [x] Cron Vercel (vercel.json, 1x/jour plan gratuit)
- [x] MonitorWorker garde comme complement (60s quand connecte)
- [x] Endpoint /api/cron/monitor securise avec CRON_SECRET
- [x] Migration auto schema (detection colonne userId manquante)

### Livrable J4
> Authentification complete, monitoring serverless autonome

---

## Jour 5 - Dark Mode + Tests + CI/CD

### Matin
- [x] Dark mode : ThemeProvider, toggle dans la navbar
- [x] Tailwind dark: classes sur tous les composants
- [x] Persistance du theme dans localStorage
- [x] Adapter tous les composants existants au dark mode

### Apres-midi
- [x] Tests unitaires avec Vitest (17 tests : validation, logique metier)
- [x] Tests E2E avec Playwright (9 tests : auth, navigation)
- [x] CI/CD GitHub Actions (3 jobs paralleles : lint+build, unit tests, E2E)

### Livrable J5
> App professionnelle avec dark mode, tests complets, CI/CD automatise

---

# V3 — Features avancees, Auth officielle, Monitoring pro

## Vue d'ensemble V3

| Jour | Theme | Statut |
|------|-------|--------|
| J6 | Auth officielle + Profil | En attente |
| J7 | Validation + Securite | En attente |
| J8 | Monitoring avance | En attente |
| J9 | Notifications & Alertes | En attente |
| J10 | Incidents & Maintenance | En attente |
| J11 | Status page publique | En attente |
| J12 | Dashboard enrichi | En attente |
| J13 | Teams & Collaboration | En attente |
| J14 | Integrations externes | En attente |
| J15 | Analytics & Rapports | En attente |
| J16 | UX/UI avance | En attente |
| J17 | Infra & DevOps | En attente |
| J18 | Tests & Polish final | En attente |

---

## Jour 6 - Auth officielle + Profil

### Matin
- [ ] Migration NextAuth v4 -> Auth.js v5 (nouveau standard)
- [ ] Provider OAuth Google (connexion avec compte Google)
- [ ] Provider OAuth GitHub (connexion avec compte GitHub)
- [ ] Adapter Prisma pour Auth.js (tables Account, Session, VerificationToken)

### Apres-midi
- [ ] Verification email (lien de confirmation a l'inscription)
- [ ] Mot de passe oublie (flow reset password par email)
- [ ] Page profil utilisateur (avatar, nom, email, mot de passe)
- [ ] Migration des comptes existants vers le nouveau systeme

### Livrable J6
> Authentification professionnelle avec OAuth, verification email, profil utilisateur

---

## Jour 7 - Validation + Securite

### Matin
- [ ] Zod : validation de toutes les entrees API (services, auth, checks)
- [ ] Rate limiting sur les endpoints publics (login, register)
- [ ] Protection CSRF renforcee
- [ ] Sanitization des inputs (XSS prevention)

### Apres-midi
- [ ] API keys : generation, revocation, authentification par token
- [ ] Audit log : table ActivityLog (who, what, when, IP)
- [ ] Middleware de logging des actions utilisateur
- [ ] Dashboard audit log dans le profil utilisateur

### Livrable J7
> API securisee avec validation Zod, rate limiting, API keys et audit trail

---

## Jour 8 - Monitoring avance

### Matin
- [ ] SSL certificate check (verification expiration HTTPS)
- [ ] Keyword monitoring (verifier qu'une page contient un mot-cle)
- [ ] TCP/UDP ping (verifier des ports : BDD, serveur de jeu, etc.)
- [ ] DNS monitoring (verifier les enregistrements DNS)

### Apres-midi
- [ ] Uptime historique : pourcentage sur 24h / 7j / 30j
- [ ] Cron job monitoring (heartbeat / dead man's switch)
- [ ] API response validation (verifier que le JSON retourne les bons champs)
- [ ] Monitoring multi-regions (ping depuis plusieurs zones)

### Livrable J8
> Monitoring complet : HTTP, SSL, TCP, DNS, keyword, uptime tracking

---

## Jour 9 - Notifications & Alertes

### Matin
- [ ] Integration Resend (envoi d'emails transactionnels)
- [ ] Email d'alerte quand un service tombe (avec cooldown)
- [ ] Email de recuperation quand un service remonte
- [ ] Preferences de notification par utilisateur

### Apres-midi
- [ ] Webhooks configurables (Discord, Slack)
- [ ] Telegram bot (notifications push mobile)
- [ ] Escalade : si pas de reaction en 15min, 2e niveau de notification
- [ ] Page de gestion des notifications dans le profil

### Livrable J9
> Systeme de notifications multi-canal : email, Discord, Slack, Telegram

---

## Jour 10 - Incidents & Maintenance

### Matin
- [ ] Table Incident (debut, fin, duree, serviceId, statut)
- [ ] Creation automatique d'incident apres X checks DOWN consecutifs
- [ ] Timeline d'incident (evenements chronologiques)
- [ ] Resolution automatique quand le service remonte

### Apres-midi
- [ ] Post-mortem : formulaire de resume apres resolution
- [ ] Maintenance planifiee : programmer des fenetres sans alertes
- [ ] Historique des incidents par service
- [ ] Dashboard incidents (ouverts, resolus, en maintenance)

### Livrable J10
> Gestion d'incidents complete avec timeline, post-mortem et maintenance planifiee

---

## Jour 11 - Status page publique

### Matin
- [ ] Page `/status/:userId` accessible sans authentification
- [ ] Affichage uptime par service (barres vertes/rouges par jour)
- [ ] Heatmap de disponibilite (style GitHub contributions)
- [ ] Incidents publics visibles sur la status page

### Apres-midi
- [ ] SLA tracking : definir un objectif (99.9%) et suivre le respect
- [ ] Personnalisation de la status page (titre, description, logo)
- [ ] Lien partageable + embed iframe
- [ ] SEO optimise pour la status page (meta tags, OG)

### Livrable J11
> Status page publique partageable avec heatmap, SLA et personnalisation

---

## Jour 12 - Dashboard enrichi

### Matin
- [ ] Server-Sent Events (SSE) pour mise a jour temps reel sans refresh
- [ ] Graphiques avances : uptime timeline, comparaison multi-services
- [ ] Filtres : par statut (UP/DOWN), tri par latence, recherche par nom
- [ ] Pagination des services

### Apres-midi
- [ ] Export CSV des donnees de monitoring
- [ ] Export PDF des rapports
- [ ] Comparaison de periodes (cette semaine vs semaine derniere)
- [ ] Widgets configurables sur le dashboard

### Livrable J12
> Dashboard temps reel avec SSE, filtres, export et graphiques avances

---

## Jour 13 - Teams & Collaboration

### Matin
- [ ] Table Organization + Membership (owner, admin, editor, viewer)
- [ ] Creation d'organisation et invitation par email
- [ ] Roles et permissions granulaires
- [ ] Switch entre organisations dans la navbar

### Apres-midi
- [ ] Commentaires sur incidents (discussion en temps reel)
- [ ] Notifications d'equipe (nouveau membre, incident, etc.)
- [ ] Page de gestion de l'organisation (membres, roles)
- [ ] Transfert de propriete d'un service

### Livrable J13
> Systeme collaboratif avec organisations, roles et permissions

---

## Jour 14 - Integrations externes

### Matin
- [ ] API publique RESTful documentee (Swagger / OpenAPI)
- [ ] Authentification API via API keys (crees en J7)
- [ ] Slack bot : commandes `/status`, `/add-service`, alertes dans un channel
- [ ] Discord bot : memes fonctionnalites que Slack

### Apres-midi
- [ ] Zapier / n8n webhook : connecter PixelNova a d'autres outils
- [ ] PagerDuty / Opsgenie integration (outils d'astreinte pro)
- [ ] Cron job monitoring endpoint (heartbeat receiver)
- [ ] Documentation API interactive (Swagger UI)

### Livrable J14
> API publique documentee + integrations Slack, Discord, Zapier

---

## Jour 15 - Analytics & Rapports

### Matin
- [ ] Rapports hebdomadaires automatiques par email
- [ ] Rapports mensuels avec resume uptime et incidents
- [ ] Metriques avancees : MTTR, MTTA, temps moyen entre pannes
- [ ] Tendances de latence (amelioration/degradation)

### Apres-midi
- [ ] Prediction de panne (detection de patterns de degradation)
- [ ] Alertes proactives (latence en hausse avant la panne)
- [ ] Dashboard analytics avec graphiques de tendance
- [ ] Comparaison de periodes avec indicateurs visuels

### Livrable J15
> Analytics avancees avec rapports auto, predictions et metriques MTTR/MTTA

---

## Jour 16 - UX/UI avance

### Matin
- [ ] Framer Motion : animations de transition sur les pages et cards
- [ ] Drag & drop : reorganiser les widgets du dashboard
- [ ] Raccourcis clavier : K (recherche), N (nouveau service), etc.
- [ ] Onboarding guide : tutoriel interactif au premier login

### Apres-midi
- [ ] Themes custom : couleurs personnalisables au-dela de dark/light
- [ ] Mode kiosk : affichage plein ecran pour ecran de monitoring
- [ ] PWA : installer l'app sur mobile comme une app native
- [ ] Internationalisation (i18n) : FR/EN avec next-intl

### Livrable J16
> UX professionnelle avec animations, PWA, i18n et mode kiosk

---

## Jour 17 - Infra & DevOps

### Matin
- [ ] Docker : Dockerfile + docker-compose pour lancement en une commande
- [ ] Health check endpoint (`/api/health`)
- [ ] Metriques Prometheus (`/api/metrics`)
- [ ] Cache Redis pour les resultats de checks recents

### Apres-midi
- [ ] Feature flags avec Vercel Edge Config
- [ ] Queue de jobs (Trigger.dev ou BullMQ) pour checks en arriere-plan
- [ ] CI/CD avance : preview deployments, Dependabot, tests de perf
- [ ] Monitoring de l'app elle-meme (auto-monitoring)

### Livrable J17
> Infrastructure pro avec Docker, Redis, Prometheus, feature flags

---

## Jour 18 - Tests & Polish final

### Matin
- [ ] Tests API : tester tous les endpoints avec scenarios complets
- [ ] Tests composants React : render, interactions, etats
- [ ] Coverage cible : 80%+ sur la logique metier
- [ ] Tests de performance (Lighthouse, load testing)

### Apres-midi
- [ ] Documentation finale mise a jour (ARCHITECTURE, API, DATABASE, README)
- [ ] Mise a jour Notion avec V3 complete
- [ ] Review de code globale et nettoyage
- [ ] Deploy final V3 + tests de production

### Livrable J18
> V3 complete, testee, documentee, deployee

---

## Notes et decisions en cours de route

- **Prisma v7 + libSQL** : Prisma v7 necessite un adapter (plus de driver natif SQLite). On utilise `@prisma/adapter-libsql` + `@libsql/client`. Les tables sont creees via libSQL au demarrage car `prisma migrate` natif et libSQL ne partagent pas le meme format de fichier.
- **Tous les endpoints API testes et valides** : CRUD complet, validation, check HTTP avec mesure de latence, gestion des erreurs (timeout, DNS, etc.).
- **Frontend complet** : Navbar sticky, Dashboard avec compteurs et StatusCard, page Services avec formulaire CRUD + modal suppression, page Detail avec graphique Chart.js et tableau historique. Auto-refresh 30s, loading states, empty states.
- **Monitoring automatique** : MonitorWorker en layout qui appelle `/api/monitor` toutes les 60s. Retention : 10 derniers checks UP conserves, tous les DOWN conserves.
- **Turso (cloud libSQL)** : Migration de SQLite local vers Turso pour deploiement Vercel (serverless). `db.ts` detecte automatiquement l'environnement (local vs cloud).
- **Deploiement Vercel** : https://pixel-nova-sigma.vercel.app — build OK, variables d'environnement configurees.
- **Auth V2** : NextAuth.js v4 avec provider credentials, bcrypt, JWT sessions. Middleware de protection des pages. Filtrage des donnees par userId.
- **Dark mode V2** : Tailwind CSS 4 `@variant dark`, ThemeProvider avec localStorage, toggle dans la navbar.
- **Tests V2** : 17 tests unitaires Vitest + 9 tests E2E Playwright.
- **CI/CD V2** : GitHub Actions avec 3 jobs paralleles (lint+build, unit tests, E2E).
