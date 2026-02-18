document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = Array.from(document.querySelectorAll('.gallery-filter-btn'));
  const items = Array.from(document.querySelectorAll('.gallery-grid .gallery-item'));

  if (!filterButtons.length || !items.length) return;

  const textIncludes = (text, words) => words.some((word) => text.includes(word));

  const detectTags = (item) => {
    const captionText = (item.querySelector('figcaption')?.textContent || '').toLowerCase();
    const serviceLinks = Array.from(item.querySelectorAll('a.service-link')).map((link) => link.getAttribute('href') || '');
    const hasVideo = Boolean(item.querySelector('video'));

    const tags = new Set();

    if (hasVideo) {
      tags.add('video');
    } else {
      tags.add('photo');
    }

    if (textIncludes(captionText, ['outdoor', 'garten', 'dämmerung', 'hauswand'])) {
      tags.add('outdoor');
    }

    if (textIncludes(captionText, ['indoor', 'club'])) {
      tags.add('indoor');
    }

    if (serviceLinks.some((href) => href.includes('#bigstage')) || textIncludes(captionText, ['big stage', 'bigstage'])) {
      tags.add('bigstage');
      tags.add('indoor');
      tags.delete('outdoor');
    }

    if (serviceLinks.some((href) => href.includes('#sorglos')) || textIncludes(captionText, ['sorglos'])) {
      tags.add('sorglos');
    }

    if (serviceLinks.some((href) => href.includes('#performance')) || textIncludes(captionText, ['performance-only', 'performance'])) {
      tags.add('performance');
    }

    item.dataset.tags = Array.from(tags).join(' ');
  };

  items.forEach(detectTags);

  const applyFilter = (filter) => {
    items.forEach((item) => {
      const tags = item.dataset.tags ? item.dataset.tags.split(' ') : [];
      const shouldShow = filter === 'all' || tags.includes(filter);

      item.classList.toggle('is-filtered-out', !shouldShow);
      item.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    });

    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === filter;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyFilter(button.dataset.filter || 'all');
    });
  });

  applyFilter('all');
});
