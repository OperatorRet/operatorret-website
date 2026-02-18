document.addEventListener('DOMContentLoaded', () => {
  const initNavigation = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.getElementById('main-navigation');
    const siteHeader = document.querySelector('.site-header');

    if (!(navToggle instanceof HTMLInputElement) || !(mainNav instanceof HTMLElement)) {
      return;
    }

    if (navToggle.dataset.a11yBound === '1') {
      return;
    }
    navToggle.dataset.a11yBound = '1';

    const setExpandedState = () => {
      navToggle.setAttribute('aria-expanded', navToggle.checked ? 'true' : 'false');
      document.body.classList.toggle('nav-open', navToggle.checked);
    };

    navToggle.checked = false;
    setExpandedState();
    navToggle.addEventListener('change', setExpandedState);

    const closeNavigation = () => {
      if (!navToggle.checked) {
        return;
      }

      navToggle.checked = false;
      setExpandedState();
    };

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !navToggle.checked) {
        return;
      }

      closeNavigation();
      navToggle.focus();
    });

    document.addEventListener('click', (event) => {
      if (!navToggle.checked || !(siteHeader instanceof HTMLElement)) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (siteHeader.contains(target)) {
        return;
      }

      closeNavigation();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 720) {
        closeNavigation();
      }
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeNavigation();
      });
    });
  };

  initNavigation();
  document.addEventListener('siteHeaderLoaded', initNavigation);
});
