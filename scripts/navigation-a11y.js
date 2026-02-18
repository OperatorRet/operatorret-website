document.addEventListener('DOMContentLoaded', () => {
  const initNavigation = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.getElementById('main-navigation');

    if (!(navToggle instanceof HTMLInputElement) || !(mainNav instanceof HTMLElement)) {
      return;
    }

    if (navToggle.dataset.a11yBound === '1') {
      return;
    }
    navToggle.dataset.a11yBound = '1';

    const setExpandedState = () => {
      navToggle.setAttribute('aria-expanded', navToggle.checked ? 'true' : 'false');
    };

    setExpandedState();
    navToggle.addEventListener('change', setExpandedState);

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !navToggle.checked) {
        return;
      }

      navToggle.checked = false;
      setExpandedState();
      navToggle.focus();
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (!navToggle.checked) {
          return;
        }

        navToggle.checked = false;
        setExpandedState();
      });
    });
  };

  initNavigation();
  document.addEventListener('siteHeaderLoaded', initNavigation);
});
