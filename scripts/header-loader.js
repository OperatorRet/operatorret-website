document.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('site-header-root');
  const existingHeader = document.querySelector('header.site-header');
  const target = root instanceof HTMLElement ? root : existingHeader;
  if (!(target instanceof HTMLElement)) return;

  try {
    const response = await fetch('partials/header.html', { cache: 'no-store' });
    if (!response.ok) return;

    const html = await response.text();
    if (root instanceof HTMLElement) {
      root.innerHTML = html;
    } else {
      target.outerHTML = html;
    }

    const path = window.location.pathname.split('/').pop() || 'index.html';
    const current = document.querySelector(`.main-nav a[href="${path}"]`);
    if (current instanceof HTMLElement) {
      current.setAttribute('aria-current', 'page');
    }

    document.dispatchEvent(new CustomEvent('siteHeaderLoaded'));
  } catch (_) {
  }
});
