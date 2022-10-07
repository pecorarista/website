document.addEventListener('DOMContentLoaded', event => {
  document.querySelectorAll('a[href^="http"]').forEach(element => {
    element.setAttribute('target', '_blank');
  });
  let lastSection: HTMLElement = document.querySelector('section:last-child');
  if (lastSection) {
    lastSection.style.paddingBottom = '20px';
  }
});
