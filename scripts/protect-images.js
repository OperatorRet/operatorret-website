document.addEventListener('DOMContentLoaded', () => {
  const imageSelectors = 'img, picture, figure';

  document.addEventListener('contextmenu', (event) => {
    const isImageTarget = event.target instanceof Element && event.target.closest(imageSelectors);
    if (isImageTarget) {
      event.preventDefault();
    }
  });

  document.addEventListener('dragstart', (event) => {
    const isImageTarget = event.target instanceof Element && event.target.closest(imageSelectors);
    if (isImageTarget) {
      event.preventDefault();
    }
  });

  document.querySelectorAll('img').forEach((image) => {
    image.setAttribute('draggable', 'false');
  });
});
