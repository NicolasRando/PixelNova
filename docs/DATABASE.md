# Base de Donnees - PixelNova

> Document evolutif - Mis a jour a chaque modification du schema

## ORM : Prisma

- Fichier de configuration : `prisma/schema.prisma`
- Base de donnees : SQLite (fichier `prisma/dev.db`)
- Commandes utiles :
  - `npx prisma migrate dev` : Appliquer les migrations
  - `npx prisma studio` : Interface visuelle pour la BDD
  - `npx prisma generate` : Regenerer le client Prisma

---

## Schema

### Table Service

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | String | @id @default(cuid()) | Identifiant unique |
| name | String | - | Nom du service |
| url | String | - | URL a surveiller |
| interval | Int | @default(5) | Intervalle de check en minutes |
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

### Relations

```
Service 1 ──────> N Check
   │                  │
   │  id ◄────────── serviceId
   │
   └── onDelete: Cascade (supprimer un service supprime tous ses checks)
```

---

## Schema Prisma (reference)

```prisma
model Service {
  id        String   @id @default(cuid())
  name      String
  url       String
  interval  Int      @default(5)
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

## Evolutions prevues (V2)

- [ ] Migration vers Supabase (PostgreSQL)
- [ ] Table Incident (debut, fin, duree, serviceId)
- [ ] Table User (authentification)
- [ ] Index sur checkedAt pour optimiser les requetes historiques

---

## Notes

> _Ajouter ici les changements de schema, problemes rencontres..._

