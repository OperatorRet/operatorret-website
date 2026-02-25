const THEME_STORAGE_KEY = 'operatorret-theme-mode';
const VALID_THEME_MODES = ['standard', 'dark', 'light'];

const normalizeThemeMode = (value) => {
  if (typeof value !== 'string') return 'standard';
  const normalized = value.trim().toLowerCase();
  return VALID_THEME_MODES.includes(normalized) ? normalized : 'standard';
};

const applyThemeMode = (mode) => {
  const themeMode = normalizeThemeMode(mode);
  document.documentElement.setAttribute('data-theme', themeMode);
  return themeMode;
};

const getStoredThemeMode = () => {
  try {
    return normalizeThemeMode(localStorage.getItem(THEME_STORAGE_KEY));
  } catch (_) {
    return 'standard';
  }
};

const persistThemeMode = (mode) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, normalizeThemeMode(mode));
  } catch (_) {
  }
};

const createThemeToggle = (placement) => {
  const wrapper = document.createElement('div');
  wrapper.className = `theme-mode-toggle theme-mode-toggle-${placement}`;
  wrapper.setAttribute('role', 'group');
  wrapper.setAttribute('aria-label', 'Darstellungsmodus');

  const modeOptions = [
    { mode: 'standard', label: 'Std' },
    { mode: 'dark', label: 'Dark' },
    { mode: 'light', label: 'Light' }
  ];

  modeOptions.forEach(({ mode, label }) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-mode-btn';
    button.dataset.themeMode = mode;
    button.textContent = label;
    button.setAttribute('aria-label', `Modus ${label}`);
    wrapper.appendChild(button);
  });

  return wrapper;
};

const syncThemeToggles = (mode) => {
  const currentMode = normalizeThemeMode(mode);
  const buttons = document.querySelectorAll('.theme-mode-btn[data-theme-mode]');

  buttons.forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const isActive = button.dataset.themeMode === currentMode;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
};

const setThemeMode = (mode) => {
  const appliedMode = applyThemeMode(mode);
  persistThemeMode(appliedMode);
  syncThemeToggles(appliedMode);
};

const mountDrawerThemeToggle = () => {
  const drawerTools = document.querySelector('.site-header .main-nav-drawer-tools');
  if (!(drawerTools instanceof HTMLElement)) return;
  if (drawerTools.querySelector('.theme-mode-toggle-header')) return;

  const toggle = createThemeToggle('header');
  drawerTools.appendChild(toggle);
};

const mountFooterThemeToggle = () => {
  const footerInner = document.querySelector('.site-footer .footer-inner');
  if (!(footerInner instanceof HTMLElement)) return;
  if (footerInner.querySelector('.theme-mode-toggle-footer')) return;

  const toggle = createThemeToggle('footer');
  const footerSocial = footerInner.querySelector('.footer-social');

  if (footerSocial instanceof HTMLElement) {
    footerInner.insertBefore(toggle, footerSocial);
    return;
  }

  footerInner.appendChild(toggle);
};

applyThemeMode(getStoredThemeMode());

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.classList.contains('theme-mode-btn')) return;

  const nextMode = normalizeThemeMode(target.dataset.themeMode);
  setThemeMode(nextMode);
});

document.addEventListener('DOMContentLoaded', async () => {
  mountFooterThemeToggle();

  const root = document.getElementById('site-header-root');
  const existingHeader = document.querySelector('header.site-header');
  const target = root instanceof HTMLElement ? root : existingHeader;
  if (!(target instanceof HTMLElement)) {
    syncThemeToggles(getStoredThemeMode());
    return;
  }

  try {
    const response = await fetch('partials/header.html', { cache: 'no-store' });
    if (!response.ok) return;

    const html = await response.text();
    if (root instanceof HTMLElement) {
      root.innerHTML = html;
    } else {
      target.outerHTML = html;
    }

    mountDrawerThemeToggle();
    mountFooterThemeToggle();

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

    syncThemeToggles(getStoredThemeMode());

    document.dispatchEvent(new CustomEvent('siteHeaderLoaded'));
  } catch (_) {
    mountDrawerThemeToggle();
    syncThemeToggles(getStoredThemeMode());
  }
});
