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

      if (navToggle.checked && siteHeader instanceof HTMLElement) {
        siteHeader.classList.remove('is-hidden');
      }
    };

    navToggle.checked = false;
    setExpandedState();
    navToggle.addEventListener('change', setExpandedState);

    const closeNavigation = () => {
      if (!navToggle.checked) {
        return;
      }

      navToggle.checked = false;
      mainNav.querySelectorAll('.drawer-submenu[open]').forEach((submenu) => {
        if (submenu instanceof HTMLDetailsElement) {
          submenu.open = false;
        }
      });
      setExpandedState();
    };

    let lastScrollY = window.scrollY;
    let scrollTicking = false;

    const syncHeaderOnScroll = () => {
      if (!(siteHeader instanceof HTMLElement)) {
        return;
      }

      if (window.innerWidth > 720) {
        siteHeader.classList.remove('is-hidden');
        lastScrollY = window.scrollY;
        return;
      }

      if (navToggle.checked) {
        siteHeader.classList.remove('is-hidden');
        lastScrollY = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY < 10 || delta <= -4) {
        siteHeader.classList.remove('is-hidden');
      } else if (delta >= 6 && currentScrollY > 88) {
        siteHeader.classList.add('is-hidden');
      }

      lastScrollY = currentScrollY;
    };

    const onScroll = () => {
      if (scrollTicking) {
        return;
      }

      scrollTicking = true;
      window.requestAnimationFrame(() => {
        syncHeaderOnScroll();
        scrollTicking = false;
      });
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

      syncHeaderOnScroll();
    });

    window.addEventListener('scroll', onScroll, { passive: true });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeNavigation();
      });
    });

    syncHeaderOnScroll();
  };

  initNavigation();
  document.addEventListener('siteHeaderLoaded', initNavigation);
});
