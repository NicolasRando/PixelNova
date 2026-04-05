# API Endpoints - PixelNova

> Document evolutif - Mis a jour a chaque ajout/modification de route

## Base URL

- Local : `http://localhost:3000/api`
- Production : `https://pixel-nova-sigma.vercel.app/api`

---

# V2 (actuel)

## Authentification

> Tous les endpoints ci-dessous sont geres par NextAuth.js v4.

### POST /api/auth/register

Cree un nouveau compte utilisateur.

- **Auth** : Aucune
- **Body** :
```json
{
  "name": "Nicolas",
  "email": "nicolas@example.com",
  "password": "motdepasse123"
}
```
- **Validation** : email valide, mot de passe min 6 caracteres
- **Reponse 201** : Utilisateur cree
- **Reponse 400** : Email deja utilise ou validation echouee

### POST /api/auth/[...nextauth]

Gere login/logout/session via NextAuth.js (credentials provider).

### GET /api/auth/session

Retourne les informations de la session courante.

---

> **Note V2** : Toutes les routes `/api/services` et `/api/services/:id/*` sont protegees par le middleware auth. Les requetes sans session valide recoivent une reponse 401 Unauthorized.

## Services

### GET /api/services
Liste tous les services de l'utilisateur connecte avec leur dernier check.
- **Auth** : Requise (filtrage par userId)

### POST /api/services
Cree un nouveau service et lance un premier check.
- **Auth** : Requise
- **Validation** : name (obligatoire, max 50), url (http/https), interval (1, 5, 15, 30)

### GET /api/services/:id
Detail d'un service.
- **Auth** : Requise (verifie que le service appartient a l'utilisateur)

### PUT /api/services/:id
Modifie un service existant.
- **Auth** : Requise

### DELETE /api/services/:id
Supprime un service et tout son historique.
- **Auth** : Requise

## Checks

### GET /api/services/:id/checks
Historique des checks d'un service (limit, offset).
- **Auth** : Requise

### POST /api/services/:id/check
Declenche un check manuel immediatement.
- **Auth** : Requise

## Monitoring

### GET /api/cron/monitor
Verifie automatiquement tous les services. Appele par Vercel Cron (1x/jour).
- **Auth** : Header `Authorization: Bearer CRON_SECRET`
- **Logique** : parcourt tous les services, lance un check si expire, nettoie les anciens checks UP (garde 10)

### POST /api/monitor
Monitoring client-side. Appele par MonitorWorker toutes les 60s quand l'utilisateur est connecte.
- **Auth** : Session requise (filtre par userId)

---

## Codes d'erreur

| Code | Signification |
|------|---------------|
| 200 | Succes |
| 201 | Creation reussie |
| 400 | Requete invalide (validation) |
| 401 | Non autorise (session manquante) |
| 404 | Ressource non trouvee |
| 429 | Too many requests (V3) |
| 500 | Erreur serveur interne |

---

# V3 (prevu)

## Nouveaux endpoints Auth (Auth.js v5)

### POST /api/auth/forgot-password
Envoie un email de reset password.
- **Auth** : Aucune
- **Body** : `{ "email": "user@example.com" }`

### POST /api/auth/reset-password
Reset le mot de passe avec un token.
- **Auth** : Aucune
- **Body** : `{ "token": "...", "password": "newpassword" }`

### OAuth routes
- **GET /api/auth/signin/google** : Connexion Google
- **GET /api/auth/signin/github** : Connexion GitHub
- **GET /api/auth/callback/google** : Callback OAuth Google
- **GET /api/auth/callback/github** : Callback OAuth GitHub

## Profil utilisateur

### GET /api/profile
Retourne le profil de l'utilisateur connecte.
- **Auth** : Requise

### PUT /api/profile
Met a jour le profil (nom, avatar, locale).
- **Auth** : Requise

### PUT /api/profile/password
Change le mot de passe.
- **Auth** : Requise

## API Keys

### GET /api/api-keys
Liste les API keys de l'utilisateur.
- **Auth** : Requise

### POST /api/api-keys
Cree une nouvelle API key.
- **Auth** : Requise
- **Reponse** : `{ "key": "pn_abc123...", "prefix": "pn_abc1" }` (la cle complete n'est montree qu'une fois)

### DELETE /api/api-keys/:id
Revoque une API key.
- **Auth** : Requise

## Monitoring avance

### POST /api/services/:id/check/ssl
Verifie le certificat SSL d'un service.
- **Auth** : Requise
- **Reponse** : `{ "valid": true, "expiresAt": "2026-12-01", "daysLeft": 245 }`

### POST /api/services/:id/check/dns
Verifie les enregistrements DNS.
- **Auth** : Requise

### POST /api/services/:id/check/tcp
Ping TCP sur un port specifique.
- **Auth** : Requise

## Incidents

### GET /api/incidents
Liste les incidents de l'utilisateur (filtre par statut).
- **Auth** : Requise
- **Query** : `status=open|investigating|resolved`

### GET /api/incidents/:id
Detail d'un incident avec sa timeline.
- **Auth** : Requise

### PUT /api/incidents/:id
Met a jour le statut d'un incident.
- **Auth** : Requise

### POST /api/incidents/:id/events
Ajoute un commentaire/evenement a la timeline.
- **Auth** : Requise

### PUT /api/incidents/:id/postmortem
Redige le post-mortem.
- **Auth** : Requise

## Maintenance

### GET /api/maintenance
Liste les maintenances planifiees.
- **Auth** : Requise

### POST /api/maintenance
Cree une maintenance planifiee.
- **Auth** : Requise

### DELETE /api/maintenance/:id
Supprime une maintenance.
- **Auth** : Requise

## Notifications

### GET /api/notifications/preferences
Retourne les preferences de notification.
- **Auth** : Requise

### PUT /api/notifications/preferences
Met a jour les preferences (email, slack, discord, telegram).
- **Auth** : Requise

### POST /api/notifications/test
Envoie une notification de test.
- **Auth** : Requise

## Organisations

### GET /api/organizations
Liste les organisations de l'utilisateur.
- **Auth** : Requise

### POST /api/organizations
Cree une organisation.
- **Auth** : Requise

### POST /api/organizations/:id/invite
Invite un membre par email.
- **Auth** : Requise (role admin ou owner)

### PUT /api/organizations/:id/members/:userId
Change le role d'un membre.
- **Auth** : Requise (role admin ou owner)

### DELETE /api/organizations/:id/members/:userId
Retire un membre.
- **Auth** : Requise (role admin ou owner)

## Status page publique

### GET /api/status/:userId
Retourne les donnees de la status page publique (services publics, uptime, incidents).
- **Auth** : Aucune (donnees publiques uniquement)

## Audit log

### GET /api/audit-log
Historique des actions de l'utilisateur.
- **Auth** : Requise
- **Query** : `limit`, `offset`, `action`, `resource`

## Analytics & Rapports

### GET /api/reports/weekly
Genere un rapport hebdomadaire.
- **Auth** : Requise

### GET /api/reports/monthly
Genere un rapport mensuel.
- **Auth** : Requise

### GET /api/reports/export
Exporte les donnees en CSV ou PDF.
- **Auth** : Requise
- **Query** : `format=csv|pdf`, `from`, `to`

## Temps reel

### GET /api/events
Server-Sent Events pour mise a jour temps reel du dashboard.
- **Auth** : Requise
- **Type** : SSE (text/event-stream)

## Infrastructure

### GET /api/health
Health check de l'application.
- **Auth** : Aucune
- **Reponse** : `{ "status": "ok", "version": "3.0.0", "uptime": 12345 }`

### GET /api/metrics
Metriques Prometheus.
- **Auth** : Bearer token ou IP whitelist

## Webhooks sortants

### POST /api/webhooks
Configure un webhook sortant (Discord, Slack, custom URL).
- **Auth** : Requise

### DELETE /api/webhooks/:id
Supprime un webhook.
- **Auth** : Requise

---

## Authentification V3

Les endpoints V3 supportent 3 methodes d'authentification :

1. **Session cookie** (navigateur) — via Auth.js v5
2. **API key** (integrations) — header `X-API-Key: pn_abc123...`
3. **CRON_SECRET** (cron jobs) — header `Authorization: Bearer <secret>`

## Validation V3

Tous les endpoints V3 utilisent **Zod** pour valider les entrees. Les erreurs de validation retournent un format structure :

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "name", "message": "Required" },
    { "field": "url", "message": "Must start with http:// or https://" }
  ]
}
```

## Rate limiting V3

| Endpoint | Limite |
|----------|--------|
| POST /api/auth/register | 5/heure |
| POST /api/auth/forgot-password | 3/heure |
| POST /api/services/:id/check | 10/minute |
| Autres endpoints auth | 60/minute |
| API key endpoints | 100/minute |
