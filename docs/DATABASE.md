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

## Schema

### Table User (V2)

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
| createdAt | DateTime | @default(now()) | Date de creation |
| updatedAt | DateTime | @updatedAt | Date de derniere modification |
| userId | String | @relation(User) | FK vers l'utilisateur proprietaire (V2) |

### Table Check

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | String | @id @default(cuid()) | Identifiant unique |
| serviceId | String | @relation(Service) | FK vers le service |
| status | String | - | "up" ou "down" |
| statusCode | Int? | nullable | Code HTTP (200, 404, 500...) |
| latency | Int? | nullable | Temps de reponse en ms |
| checkedAt | DateTime | @default(now()) | Date et heure du check |

### Relations

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

## Schema Prisma (reference)

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

## Evolutions prevues

- [ ] Migration vers Supabase (PostgreSQL)
- [ ] Table Incident (debut, fin, duree, serviceId)
- [x] Table User (authentification) — prevu V2 J4
- [x] Champ userId sur Service (lien User -> Service) — prevu V2 J4
- [ ] Index sur checkedAt pour optimiser les requetes historiques

---

## Notes

> _Ajouter ici les changements de schema, problemes rencontres..._

