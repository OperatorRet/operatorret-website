document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('main-navigation');

  if (!(navToggle instanceof HTMLInputElement) || !(mainNav instanceof HTMLElement)) {
    return;
  }

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
});
