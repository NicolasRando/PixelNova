# Mind Map - PixelNova

> Document evolutif - Version texte de la mind map Figma

## Lien Figma

[Ouvrir la Mind Map sur FigJam](https://www.figma.com/online-whiteboard/create-diagram/946bb0c3-e4ce-4cb5-b37d-2a98fc32da35)

---

## Vue d'ensemble

```
                                        ┌─ Nom
                                        ├─ URL
                            ┌─ Service ─┤
                            │           ├─ Intervalle
                            │           └─ Validation
                  ┌─ BDD ───┤
                  │         │           ┌─ Status (up/down)
                  │         └─ Check ───┼─ Latence (ms)
                  │                     ├─ Code HTTP
                  │                     └─ Timestamp
                  │
                  │         ┌─ GET    /services
                  │         ├─ POST   /services
                  ├─ API ───┼─ PUT    /services/:id
                  │         ├─ DELETE /services/:id
                  │         └─ GET    /services/:id/checks
                  │
                  │                    ┌─ Compteurs UP/DOWN
 PixelNova ───────┤         ┌─ Dash ──┼─ Cartes de statut
                  │         │         └─ Graphique 24h
                  ├─ Pages ─┤
                  │         ├─ Detail ─┬─ Courbe latence
                  │         │          ├─ Historique
                  │         │          └─ Uptime %
                  │         │
                  │         └─ Gestion ┬─ Formulaire ajout
                  │                    ├─ Liste services
                  │                    └─ Modifier / Supprimer
                  │
                  │         ┌─ StatusCard
                  │         ├─ LatencyChart
                  ├─ UI ────┼─ Navbar
                  │         ├─ AlertBanner
                  │         ├─ ServiceForm
                  │         └─ DeleteModal
                  │
                  │         ┌─ Detection UP → DOWN
                  ├─ Alerts ┼─ Bandeau alerte
                  │         ├─ Badge notification
                  │         └─ Historique incidents
                  │
                  │         ┌─ Next.js + TypeScript
                  ├─ Stack ─┼─ Prisma + SQLite
                  │         ├─ Tailwind CSS
                  │         └─ Chart.js
                  │
                  └─ Deploy ┬─ GitHub (repo public)
                            ├─ Vercel (hosting)
                            └─ README complet
```

---

## Notes

> _Ajouter ici les nouvelles branches, idees..._

