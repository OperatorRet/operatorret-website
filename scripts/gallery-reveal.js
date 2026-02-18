document.addEventListener('DOMContentLoaded', () => {
  const items = Array.from(document.querySelectorAll('.gallery-grid .gallery-item'));
  if (!items.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  items.forEach((item, index) => {
    item.classList.add('reveal-on-scroll');
    if (reducedMotion) {
      item.classList.add('is-visible');
      return;
    }

    const stagger = (index % 6) * 45;
    item.style.transitionDelay = `${stagger}ms`;
  });

  if (reducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.15
    }
  );

  items.forEach((item) => observer.observe(item));
});
