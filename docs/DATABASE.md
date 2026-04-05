# Base de Donnees - PixelNova

> Document evolutif - Mis a jour a chaque modification du schema

## ORM : Prisma

- Fichier de configuration : `prisma/schema.prisma`
- Base de donnees locale : SQLite (fichier `prisma/dev.db`) via libSQL
- Base de donnees production : Turso (cloud libSQL) — `libsql://pixelnova-nicolasrando.aws-eu-west-1.turso.io`
- Adapter : `@prisma/adapter-libsql` (Prisma v7 ne supporte plus le driver SQLite natif)
- Commandes utiles :
  - `npx prisma generate` : Regenerer le client Prisma
  - Les tables sont creees automatiquement au demarrage via `ensureTables()` dans `db.ts`

---

## Schema actuel (V2)

### Table User

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | String | @id @default(cuid()) | Identifiant unique |
| name | String | - | Nom de l'utilisateur |
| email | String | @unique | Adresse email (unique) |
| password | String | - | Mot de passe hashe (bcrypt) |
| createdAt | DateTime | @default(now()) | Date de creation |
| updatedAt | DateTime | @updatedAt | Date de derniere modification |

### Table Service

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | String | @id @default(cuid()) | Identifiant unique |
| name | String | - | Nom du service |
| url | String | - | URL a surveiller |
| interval | Int | @default(5) | Intervalle de check en minutes |
| userId | String | @relation(User) | FK vers l'utilisateur proprietaire |
| createdAt | DateTime | @default(now()) | Date de creation |
| updatedAt | DateTime | @updatedAt | Date de derniere modification |

### Table Check

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | String | @id @default(cuid()) | Identifiant unique |
| serviceId | String | @relation(Service) | FK vers le service |
| status | String | - | "up" ou "down" |
| statusCode | Int? | nullable | Code HTTP (200, 404, 500...) |
| latency | Int? | nullable | Temps de reponse en ms |
| checkedAt | DateTime | @default(now()) | Date et heure du check |

### Relations V2

```
User 1 ──────> N Service
  │                │
  │  id ◄──────── userId
  │
  └── onDelete: Cascade (supprimer un utilisateur supprime tous ses services)

Service 1 ──────> N Check
   │                  │
   │  id ◄────────── serviceId
   │
   └── onDelete: Cascade (supprimer un service supprime tous ses checks)
```

---

## Schema V3 (prevu)

### Nouvelles tables

#### Table Account (Auth.js v5)

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | String | @id @default(cuid()) | Identifiant unique |
| userId | String | @relation(User) | FK vers l'utilisateur |
| type | String | - | Type de compte (oauth, credentials) |
| provider | String | - | Fournisseur (google, github, credentials) |
| providerAccountId | String | - | ID chez le fournisseur |
| access_token | String? | nullable | Token d'acces OAuth |
| refresh_token | String? | nullable | Token de refresh OAuth |
| expires_at | Int? | nullable | Expiration du token |

#### Table VerificationToken (Auth.js v5)

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| identifier | String | - | Email ou identifiant |
| token | String | @unique | Token de verification |
| expires | DateTime | - | Date d'expiration |

#### Table ApiKey

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | String | @id @default(cuid()) | Identifiant unique |
| userId | String | @relation(User) | FK vers l'utilisateur |
| name | String | - | Nom descriptif de la cle |
| key | String | @unique | Cle API hashee |
| prefix | String | - | Prefixe visible (pn_xxxx...) |
| lastUsedAt | DateTime? | nullable | Derniere utilisation |
| expiresAt | DateTime? | nullable | Date d'expiration |
| createdAt | DateTime | @default(now()) | Date de creation |

#### Table ActivityLog

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | String | @id @default(cuid()) | Identifiant unique |
| userId | String | @relation(User) | FK vers l'utilisateur |
| action | String | - | Type d'action (create, update, delete, login) |
| resource | String | - | Ressource affectee (service, user, incident) |
| resourceId | String? | nullable | ID de la ressource |
| details | String? | nullable | Details supplementaires (JSON) |
| ip | String? | nullable | Adresse IP |
| createdAt | DateTime | @default(now()) | Date de l'action |

#### Table Incident

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | String | @id @default(cuid()) | Identifiant unique |
| serviceId | String | @relation(Service) | FK vers le service |
| status | String | - | open, investigating, resolved |
| startedAt | DateTime | @default(now()) | Debut de l'incident |
| resolvedAt | DateTime? | nullable | Fin de l'incident |
| duration | Int? | nullable | Duree en secondes |
| postMortem | String? | nullable | Resume post-mortem |
| createdAt | DateTime | @default(now()) | Date de creation |

#### Table IncidentEvent

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | String | @id @default(cuid()) | Identifiant unique |
| incidentId | String | @relation(Incident) | FK vers l'incident |
| type | String | - | check_down, check_up, comment, status_change |
| message | String | - | Description de l'evenement |
| userId | String? | nullable | Auteur (si commentaire) |
| createdAt | DateTime | @default(now()) | Date de l'evenement |

#### Table Maintenance

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | String | @id @default(cuid()) | Identifiant unique |
| serviceId | String | @relation(Service) | FK vers le service |
| title | String | - | Titre de la maintenance |
| description | String? | nullable | Description |
| startAt | DateTime | - | Debut planifie |
| endAt | DateTime | - | Fin planifiee |
| createdAt | DateTime | @default(now()) | Date de creation |

#### Table Organization

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | String | @id @default(cuid()) | Identifiant unique |
| name | String | - | Nom de l'organisation |
| slug | String | @unique | Slug URL-friendly |
| ownerId | String | @relation(User) | FK vers le proprietaire |
| createdAt | DateTime | @default(now()) | Date de creation |

#### Table Membership

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | String | @id @default(cuid()) | Identifiant unique |
| userId | String | @relation(User) | FK vers l'utilisateur |
| organizationId | String | @relation(Organization) | FK vers l'organisation |
| role | String | - | owner, admin, editor, viewer |
| joinedAt | DateTime | @default(now()) | Date d'adhesion |

#### Table NotificationPreference

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | String | @id @default(cuid()) | Identifiant unique |
| userId | String | @relation(User) | FK vers l'utilisateur |
| channel | String | - | email, slack, discord, telegram |
| enabled | Boolean | @default(true) | Active ou non |
| config | String? | nullable | Config JSON (webhook URL, chat ID...) |

### Modifications sur tables existantes (V3)

#### User (ajouts)

| Champ | Type | Description |
|-------|------|-------------|
| avatar | String? | URL de l'avatar (OAuth ou upload) |
| emailVerified | DateTime? | Date de verification email |
| locale | String? | Langue preferee (fr, en) |

#### Service (ajouts)

| Champ | Type | Description |
|-------|------|-------------|
| type | String | http, tcp, dns, ssl, keyword, heartbeat |
| organizationId | String? | FK vers l'organisation (nullable, perso par defaut) |
| keyword | String? | Mot-cle a verifier (si type=keyword) |
| port | Int? | Port a verifier (si type=tcp) |
| slaTarget | Float? | Objectif SLA en % (ex: 99.9) |
| isPublic | Boolean | Visible sur la status page publique |

### Relations V3

```
User 1 ──────> N Service
User 1 ──────> N Account (OAuth)
User 1 ──────> N ApiKey
User 1 ──────> N ActivityLog
User 1 ──────> N Membership
User 1 ──────> N NotificationPreference

Organization 1 ──────> N Membership
Organization 1 ──────> N Service (optionnel)

Service 1 ──────> N Check
Service 1 ──────> N Incident
Service 1 ──────> N Maintenance

Incident 1 ──────> N IncidentEvent
```

---

## Schema Prisma V2 (reference actuelle)

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  services  Service[]
}

model Service {
  id        String   @id @default(cuid())
  name      String
  url       String
  interval  Int      @default(5)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  checks    Check[]
}

model Check {
  id         String   @id @default(cuid())
  serviceId  String
  service    Service  @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  status     String
  statusCode Int?
  latency    Int?
  checkedAt  DateTime @default(now())
}
```

---

## Evolutions prevues (V3)

- [ ] Tables Auth.js v5 (Account, VerificationToken)
- [ ] Table ApiKey (generation, revocation, auth par token)
- [ ] Table ActivityLog (audit trail complet)
- [ ] Table Incident + IncidentEvent (gestion d'incidents)
- [ ] Table Maintenance (fenetres de maintenance planifiees)
- [ ] Table Organization + Membership (teams et collaboration)
- [ ] Table NotificationPreference (preferences multi-canal)
- [ ] Champs supplementaires sur User (avatar, emailVerified, locale)
- [ ] Champs supplementaires sur Service (type, keyword, port, slaTarget, isPublic)
- [ ] Index sur checkedAt pour optimiser les requetes historiques
- [ ] Index sur userId + organizationId pour les requetes filtrées

---

## Notes

- **V2** : Schema stable avec 3 tables (User, Service, Check). Migration auto via `ensureTables()`.
- **V3** : Le schema passera a 11+ tables. La migration sera geree incrementalement jour par jour.
- Les tables Auth.js v5 (Account, VerificationToken) suivent le schema officiel Auth.js.
