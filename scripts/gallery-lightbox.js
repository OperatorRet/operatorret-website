document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('gallery-lightbox');
  if (!lightbox) return;

  const panel = lightbox.querySelector('.gallery-lightbox-panel');
  const mediaTarget = lightbox.querySelector('.gallery-lightbox-media');
  const captionTarget = lightbox.querySelector('.gallery-lightbox-caption');
  const closeButton = lightbox.querySelector('.gallery-lightbox-close');
  const mediaItems = document.querySelectorAll('.gallery-grid .gallery-item');
  const galleryVideos = document.querySelectorAll('.gallery-grid video');
  const openersById = new Map();

  let lastFocused = null;

  const buildRetryUrl = (url) => {
    const [path] = url.split('#');
    const [cleanPath] = path.split('?');
    return `${cleanPath}?retry=${Date.now()}`;
  };

  const attachVideoRecovery = (video) => {
    if (!(video instanceof HTMLVideoElement)) return;
    if (video.dataset.recoveryBound === '1') return;

    video.dataset.recoveryBound = '1';
    video.dataset.retryCount = video.dataset.retryCount || '0';
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    video.addEventListener('error', () => {
      if (video.dataset.retryCount === '1') return;

      const currentSource = video.currentSrc || video.getAttribute('src');
      if (!currentSource) return;

      const wasPlaying = !video.paused;
      video.dataset.retryCount = '1';
      video.src = buildRetryUrl(currentSource);
      video.load();

      if (wasPlaying) {
        video.play().catch(() => {
        });
      }
    }, { passive: true });

    video.addEventListener('loadeddata', () => {
      video.dataset.retryCount = '0';
    }, { passive: true });
  };

  galleryVideos.forEach((video) => {
    video.removeAttribute('controls');
    video.setAttribute('preload', 'none');
    attachVideoRecovery(video);
  });

  const stopVideosIn = (root) => {
    root.querySelectorAll('video').forEach((video) => {
      try {
        video.pause();
        video.currentTime = 0;
      } catch (_) {
      }
    });
  };

  const getFocusableInPanel = () => {
    return Array.from(
      panel.querySelectorAll('a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter((element) => {
      if (!(element instanceof HTMLElement)) return false;
      if (element.hasAttribute('disabled')) return false;
      if (element.getAttribute('aria-hidden') === 'true') return false;
      return true;
    });
  };

  const closeLightbox = () => {
    stopVideosIn(mediaTarget);
    mediaTarget.innerHTML = '';
    captionTarget.innerHTML = '';
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    if (lastFocused instanceof HTMLElement) {
      lastFocused.focus();
    }
  };

  mediaItems.forEach((item) => {
    const media = item.querySelector('.gallery-media');
    const inlineVideo = media ? media.querySelector('video') : null;
    const caption = item.querySelector('figcaption');
    if (!media) return;

    media.setAttribute('role', 'button');
    media.setAttribute('tabindex', '0');
    media.setAttribute('aria-label', 'Medienvorschau öffnen');

    const openLightbox = () => {
      lastFocused = document.activeElement;
      const isVideoItem = Boolean(media.querySelector('video'));

      mediaTarget.className = 'gallery-lightbox-media';
      if (isVideoItem) {
        mediaTarget.classList.add('is-video');
      }

      mediaTarget.innerHTML = media.innerHTML;
      mediaTarget.querySelectorAll('video').forEach((video) => {
        video.setAttribute('controls', '');
        video.setAttribute('preload', 'metadata');
        attachVideoRecovery(video);
      });
      captionTarget.innerHTML = caption ? caption.innerHTML : '';

      lightbox.hidden = false;
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      closeButton.focus();
    };

    if (item.id) {
      openersById.set(item.id, openLightbox);
    }

    media.addEventListener('click', openLightbox);

    if (inlineVideo) {
      inlineVideo.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        openLightbox();
      });
    }

    media.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox();
      }
    });
  });

  const openFromHash = () => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    const targetId = decodeURIComponent(hash.slice(1));
    const openTarget = openersById.get(targetId);
    if (!openTarget) return;

    openTarget();
  };

  closeButton.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;

    if (event.key === 'Escape') {
      closeLightbox();
      return;
    }

    if (event.key === 'Tab') {
      const focusable = getFocusableInPanel();
      if (!focusable.length) {
        event.preventDefault();
        closeButton.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  panel.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  openFromHash();

  window.addEventListener('hashchange', () => {
    openFromHash();
  });
});
