# API Endpoints - PixelNova

> Document evolutif - Mis a jour a chaque ajout/modification de route

## Base URL

- Local : `http://localhost:3000/api`
- Production : `https://pixel-nova-sigma.vercel.app/api`

---

## Services

### GET /api/services

Liste tous les services avec leur dernier check.

- **Auth** : Aucune
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

- **Auth** : Aucune
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

### POST /api/monitor

Verifie automatiquement tous les services dont le dernier check depasse l'intervalle configure. Appele toutes les 30s par le MonitorWorker.

- **Auth** : Aucune
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

## Notes

> _Ajouter ici les changements d'API, nouveaux endpoints..._

