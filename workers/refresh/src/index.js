// Worker programmé : appelle le Deploy Hook Cloudflare Pages pour relancer le
// build du site (et donc rafraîchir l'agenda des concerts) une fois par jour.
// La fréquence est définie dans wrangler.jsonc (triggers.crons).

export default {
  async scheduled(event, env, ctx) {
    if (!env.DEPLOY_HOOK_URL) {
      console.error('DEPLOY_HOOK_URL manquant (wrangler secret put DEPLOY_HOOK_URL)');
      return;
    }
    const res = await fetch(env.DEPLOY_HOOK_URL, { method: 'POST' });
    console.log(`Deploy hook déclenché → HTTP ${res.status}`);
  },
};
