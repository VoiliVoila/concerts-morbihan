# concerts-refresh — Cron Worker

Relance le build du site Pages chaque jour pour garder l'agenda à jour.

## Déploiement (à faire avec ton compte)

```bash
cd workers/refresh
npx wrangler login                         # connexion navigateur (ton compte)
npx wrangler secret put DEPLOY_HOOK_URL    # coller l'URL du Deploy Hook (cf. DEPLOY.md §3)
npx wrangler deploy
```

Vérifier ensuite dans le dashboard → Workers & Pages → `concerts-refresh` →
Triggers que le cron `0 5 * * *` est actif. Tester à la main :

```bash
npx wrangler triggers              # liste
# ou déclencher le scheduled en local :
npx wrangler dev --test-scheduled
```
