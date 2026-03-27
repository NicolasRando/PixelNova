# API Endpoints - PixelNova

> Document evolutif - Mis a jour a chaque ajout/modification de route

## Base URL

- Local : `http://localhost:3000/api`
- Production : `https://pixel-nova-sigma.vercel.app/api`

---

## Authentification (V2)

> Tous les endpoints ci-dessous sont geres par NextAuth.js.

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
- **Reponse 201** : Utilisateur cree
- **Reponse 400** : Email deja utilise ou validation echouee

---

### POST /api/auth/login

Authentifie un utilisateur (via NextAuth.js credentials provider).

- **Auth** : Aucune
- **Body** :
```json
{
  "email": "nicolas@example.com",
  "password": "motdepasse123"
}
```
- **Reponse 200** : Session creee (cookie JWT)
- **Reponse 401** : Identifiants invalides

---

### POST /api/auth/logout

Deconnecte l'utilisateur et supprime la session.

- **Auth** : Session active
- **Reponse 200** : Session supprimee

---

### GET /api/auth/session

Retourne les informations de la session courante.

- **Auth** : Aucune (retourne null si pas de session)
- **Reponse 200** :
```json
{
  "user": {
    "id": "clx1234...",
    "name": "Nicolas",
    "email": "nicolas@example.com"
  }
}
```

---

> **Note V2** : Toutes les routes `/api/services` et `/api/services/:id/*` sont desormais protegees par le middleware auth. Les requetes sans session valide recoivent une reponse 401 Unauthorized.

---

## Services

### GET /api/services

Liste tous les services avec leur dernier check.

- **Auth** : Auth requise
- **Params** : Aucun
- **Reponse 200** :
```json
[
  {
    "id": "clx1234...",
    "name": "Google",
    "url": "https://google.com",
    "interval": 5,
    "createdAt": "2026-03-25T10:00:00Z",
    "lastCheck": {
      "status": "up",
      "latency": 45,
      "checkedAt": "2026-03-25T14:30:00Z"
    }
  }
]
```

---

### POST /api/services

Cree un nouveau service et lance un premier check.

- **Auth** : Auth requise
- **Body** :
```json
{
  "name": "Google",
  "url": "https://google.com",
  "interval": 5
}
```
- **Validation** :
  - `name` : obligatoire, string, max 50 caracteres
  - `url` : obligatoire, doit commencer par http:// ou https://
  - `interval` : obligatoire, valeurs acceptees : 1, 5, 15, 30
- **Reponse 201** : Le service cree
- **Reponse 400** : Erreur de validation

---

### GET /api/services/:id

Detail d'un service specifique.

- **Params** : `id` (string) - ID du service
- **Reponse 200** : Le service avec ses infos completes
- **Reponse 404** : Service non trouve

---

### PUT /api/services/:id

Modifie un service existant.

- **Params** : `id` (string) - ID du service
- **Body** (tous les champs optionnels) :
```json
{
  "name": "Google Search",
  "url": "https://www.google.com",
  "interval": 15
}
```
- **Reponse 200** : Le service mis a jour
- **Reponse 404** : Service non trouve
- **Reponse 400** : Erreur de validation

---

### DELETE /api/services/:id

Supprime un service et tout son historique de checks.

- **Params** : `id` (string) - ID du service
- **Reponse 200** : `{ "message": "Service supprime" }`
- **Reponse 404** : Service non trouve

---

## Checks

### GET /api/services/:id/checks

Historique des checks d'un service.

- **Params** : `id` (string) - ID du service
- **Query** :
  - `limit` (int, defaut: 50) - Nombre de resultats
  - `offset` (int, defaut: 0) - Pagination
- **Reponse 200** :
```json
{
  "checks": [
    {
      "id": "clx5678...",
      "status": "up",
      "statusCode": 200,
      "latency": 45,
      "checkedAt": "2026-03-25T14:30:00Z"
    }
  ],
  "total": 150
}
```

---

### POST /api/services/:id/check

Declenche un check manuel immediatement.

- **Params** : `id` (string) - ID du service
- **Reponse 200** : Le resultat du check
```json
{
  "id": "clx9012...",
  "status": "up",
  "statusCode": 200,
  "latency": 45,
  "checkedAt": "2026-03-25T14:35:00Z"
}
```
- **Reponse 404** : Service non trouve

---

## Codes d'erreur communs

| Code | Signification |
|------|---------------|
| 200 | Succes |
| 201 | Creation reussie |
| 400 | Requete invalide (validation) |
| 404 | Ressource non trouvee |
| 500 | Erreur serveur interne |

---

## Monitoring

### POST /api/cron/monitor (V2)

Verifie automatiquement tous les services dont le dernier check depasse l'intervalle configure. Appele par Vercel Cron selon la configuration dans `vercel.json`. Remplace le MonitorWorker client.

- **Auth** : Header `Authorization: Bearer CRON_SECRET` (securise, appels externes rejetes)
- **Body** : Aucun
- **Logique** :
  - Parcourt tous les services
  - Si le dernier check est plus ancien que l'intervalle, lance un nouveau check
  - Apres chaque check, nettoie les anciens checks UP (garde les 10 derniers)
  - Les checks DOWN ne sont jamais supprimes
- **Reponse 200** :
```json
{
  "checked": 3,
  "results": [
    { "service": "Google", "status": "up", "latency": 45 }
  ]
}
```

---

### POST /api/monitor (V1 - deprecie)

> **Deprecie en V2** : Remplace par `/api/cron/monitor`. Le MonitorWorker client est supprime au profit du Cron Vercel serverless.

---

## Notes

- **V2** : Toutes les routes services/checks necessitent une session authentifiee (middleware NextAuth.js).
- **V2** : Le monitoring est desormais gere par Vercel Cron (serverless, fiable 24/7) au lieu du MonitorWorker client.

