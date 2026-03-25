# Cahier des Charges - PixelNova

> Document evolutif - Version texte du cahier des charges Notion

## Lien Notion

[Ouvrir le Cahier des Charges sur Notion](https://www.notion.so/32e43669aabf8146a3a9cd5c295198aa)

---

## 1. Presentation

| | |
|---|---|
| **Projet** | PixelNova - Network Monitor Dashboard |
| **Contexte** | Projet portfolio pour integration dans une equipe de developpement |
| **Objectif** | Dashboard de monitoring reseau en temps reel |
| **Cible** | Agence lab / Equipe developpement |
| **Delai** | 3 jours |
| **Auteur** | Nicolas Rando |

---

## 2. Fonctionnalites

### F1 - Gestion des services (CRUD)
- Ajouter un service : nom, URL, intervalle (1, 5, 15, 30 min)
- Lister tous les services avec statut actuel
- Modifier les parametres d'un service
- Supprimer un service avec confirmation (cascade sur les checks)
- Validation : nom obligatoire (max 50 car.), URL valide, intervalle predefini

### F2 - Monitoring automatique
- Check HTTP GET vers l'URL du service
- Mesure de la latence en millisecondes
- Enregistrement du code HTTP retourne
- Status UP (code 2xx) ou DOWN (autre cas / timeout 10s)
- Stockage en base avec timestamp

### F3 - Dashboard principal
- Compteurs globaux UP / DOWN
- Carte de statut par service (nom, URL, pastille coloree, latence)
- Graphique de disponibilite sur 24h
- Indicateur visuel global (vert / rouge)

### F4 - Page detail d'un service
- Courbe de latence dans le temps
- Pourcentage uptime (24h, 7j, 30j)
- Tableau historique des checks
- Stats : latence moyenne, min, max

### F5 - Systeme d'alertes
- Detection changement UP <-> DOWN
- Bandeau d'alerte en haut du dashboard
- Badge notification sur la navbar
- Historique des incidents

---

## 3. Stack technique

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| Framework | Next.js 14 | Fullstack, SSR, API routes integrees |
| Langage | TypeScript | Typage, fiabilite, standard pro |
| ORM | Prisma | Accessible, migrations auto, typage |
| BDD | SQLite | Zero config, leger, ideal pour prototype |
| CSS | Tailwind CSS | Rapide, responsive, utility-first |
| Graphiques | Chart.js | Simple, performant, bonne doc |
| Deploy | Vercel | Gratuit, optimise Next.js |

---

## 4. Contraintes

- Responsive : desktop, tablette, mobile
- Performance : check HTTP < 10 secondes
- TypeScript strict : pas de `any`
- Code propre : composants reutilisables
- Git : commits clairs et structures

---

## 5. Livrables

- [ ] Repository GitHub public
- [ ] README complet avec captures d'ecran
- [ ] Application deployee sur Vercel
- [ ] Documentation technique (docs/)
- [ ] Mind map et CdC (Figma + Notion)

---

## 6. Evolutions V2 (hors scope)

- Authentification utilisateur
- Notifications email/SMS
- Monitoring TCP/UDP
- Export CSV
- Dark mode
- Tests unitaires
- Migration Drizzle + Supabase

---

## Notes

> _Ajouter ici les modifications du scope, nouvelles exigences..._

