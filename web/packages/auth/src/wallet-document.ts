/** Isolated document: the latest and legacy SDKs both own window.WhopElements. */
export function walletDocument() {
  return new Response(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Wallet balance</title><style>body{font:16px system-ui;margin:16px}button{padding:8px 16px}#balance{min-height:280px}</style></head>
<body><p id="status" role="status">Loading balance…</p><button id="retry" hidden>Retry</button><div id="balance"></div>
<script src="https://cdn.whop.com/elements/amber/elements.js" data-whop-elements></script>
<script>
let wallet, timer, stopped = false;
const status = document.getElementById('status');
const retry = document.getElementById('retry');
function fail(message) {
  clearTimeout(timer);
  if (wallet) wallet.destroy();
  wallet = undefined;
  status.textContent = message;
  retry.hidden = false;
}
async function refresh() {
  try {
    const response = await fetch('/api/wallet/token', {cache: 'no-store'});
    const data = await response.json();
    if (stopped) return;
    if (!response.ok) throw new Error(data.error || 'Could not load your balance.');
    const expires = Date.parse(data.expiresAt);
    if (!Number.isFinite(expires) || expires <= Date.now() + 60000) throw new Error('Wallet session expired. Please sign in again.');
    if (!window.WhopElements) throw new Error('Wallet could not download. Please retry.');
    if (wallet) wallet.update({accessToken: data.token});
    else {
      wallet = window.WhopElements().wallet.create({accountId: data.accountId, currency: 'usd', accessToken: data.token});
      wallet.create('balances').create('balance', {
        range: '1M',
        onReady: () => { status.textContent = ''; },
        onError: () => fail('Could not load your balance. Please retry or sign in again.')
      }).mount('#balance');
    }
    timer = setTimeout(refresh, Math.min(expires - Date.now() - 60000, 600000));
  } catch (error) { if (!stopped) fail(error.message || 'Could not load your balance.'); }
}
retry.onclick = () => location.reload();
window.addEventListener('pagehide', () => {stopped = true; clearTimeout(timer); if (wallet) wallet.destroy();});
void refresh();
</script></body></html>`, { headers: {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "private, no-store",
    "X-Frame-Options": "SAMEORIGIN",
    "Content-Security-Policy": "frame-ancestors 'self'",
  } });
}
