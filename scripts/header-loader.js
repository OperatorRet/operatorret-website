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

    const normalizePath = (value) => {
      const cleaned = (value || '')
        .split('?')[0]
        .split('#')[0]
        .toLowerCase()
        .replace(/\\/g, '/')
        .replace(/\/+/g, '/')
        .replace(/\/+$/, '');

      const lastSegment = cleaned.split('/').pop() || '';
      if (!lastSegment) {
        return 'index';
      }

      if (lastSegment === 'index' || lastSegment === 'index.html') {
        return 'index';
      }

      return lastSegment.replace(/\.html$/, '');
    };

    const currentPath = normalizePath(window.location.pathname);
    const links = document.querySelectorAll('.main-nav a[href]');

    links.forEach((link) => {
      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }

      link.removeAttribute('aria-current');

      const hrefPath = normalizePath(link.getAttribute('href') || '');
      if (hrefPath === currentPath) {
        link.setAttribute('aria-current', 'page');
      }
    });

    document.dispatchEvent(new CustomEvent('siteHeaderLoaded'));
  } catch (_) {
  }
});
