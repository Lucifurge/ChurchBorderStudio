(() => {
  'use strict';
  const config = window.CBS_SITE_CONFIG || {};
  const form = document.getElementById('checkoutForm');
  const button = document.getElementById('buyPro');
  const message = document.getElementById('checkoutMessage');
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
  const apiBase = String(config.licenseApiUrl || '').replace(/\/$/, '');
  const looksPlaceholder = !apiBase || /YOUR-LICENSING-API|example\.com|localhost/i.test(apiBase);
  if (looksPlaceholder) {
    button.disabled = true;
    message.textContent = 'Checkout is not connected yet. The publisher must deploy the licensing API and set licenseApiUrl in site-config.js before taking payments.';
  }
  if (new URLSearchParams(location.search).has('cancelled')) message.textContent = 'Checkout was cancelled; you have not been charged by this checkout attempt. You can try again when ready.';
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = String(document.getElementById('buyerEmail').value || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      message.textContent = 'Enter a valid email address so we know where to send your license.'; return;
    }
    if (looksPlaceholder) {
      message.textContent = 'Checkout has not been configured yet. No payment has been started.'; return;
    }
    button.disabled = true; button.textContent = 'Connecting to PayMongo…';
    message.textContent = 'Creating your secure checkout session…';
    try {
      const response = await fetch(`${apiBase}/api/create-checkout`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }), signal: AbortSignal.timeout(25000)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok || !/^https:\/\//i.test(result.checkoutUrl || '')) throw new Error(result.error || 'Checkout could not be created. Try again or contact support.');
      message.textContent = 'Checkout ready. Redirecting to PayMongo…';
      location.href = result.checkoutUrl;
    } catch (error) {
      message.textContent = error.message || 'Could not connect to the checkout service. Please try again.';
      button.disabled = false; button.textContent = 'Try checkout again ↗';
    }
  });
})();
