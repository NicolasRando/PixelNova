# Planning - PixelNova

> Document evolutif - Mis a jour au fur et a mesure de l'avancement

## Vue d'ensemble

| Jour | Objectif | Statut |
|------|----------|--------|
| J1 | Setup + Backend | Termine |
| J2 | Frontend | En attente |
| J3 | Polish + Deploy | En attente |

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
- [ ] Creer le layout principal (Navbar, structure des pages)
- [ ] Page Dashboard : compteurs UP/DOWN, cartes de statut
- [ ] Composant StatusCard

### Apres-midi
- [ ] Page Gestion des services : formulaire + liste
- [ ] Page Detail d'un service : graphiques Chart.js, historique
- [ ] Composant LatencyChart (courbe de latence)
- [ ] Connecter le frontend aux API routes

### Livrable J2
> Interface complete et fonctionnelle, navigation entre les pages

---

## Jour 3 - Polish + Deploy

### Matin
- [ ] Systeme d'alertes (detection UP/DOWN, bandeau, badge)
- [ ] Responsive design (mobile, tablette, desktop)
- [ ] Loading states et empty states

### Apres-midi
- [ ] Finitions (favicon, page 404, animations)
- [ ] Rediger le README.md
- [ ] Deployer sur Vercel
- [ ] Tests finaux sur l'URL de production

### Livrable J3
> Application deployee, accessible en ligne, README complet

---

## Notes et decisions en cours de route

- **Prisma v7 + libSQL** : Prisma v7 necessite un adapter (plus de driver natif SQLite). On utilise `@prisma/adapter-libsql` + `@libsql/client`. Les tables sont creees via libSQL au demarrage car `prisma migrate` natif et libSQL ne partagent pas le meme format de fichier.
- **Tous les endpoints API testes et valides** : CRUD complet, validation, check HTTP avec mesure de latence, gestion des erreurs (timeout, DNS, etc.).

