
// Language switching function
function switchLang(lang) {
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.classList.add('hidden');
    if (el.getAttribute('data-lang') === lang) el.classList.remove('hidden');
  });
}

// Initialize libraries when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS (Animate On Scroll) with longer delay to ensure library loads
  setTimeout(() => {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true
      });
    } else {
      console.log('AOS library not loaded yet, retrying...');
      setTimeout(() => {
        if (typeof AOS !== 'undefined') {
          AOS.init({
            duration: 800,
            once: true
          });
        }
      }, 500);
    }
  }, 200);
  
  // Initialize Swiper
  if (typeof Swiper !== 'undefined') {
    new Swiper('.swiper', {
      loop: true,
      autoplay: { delay: 3000 },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }
});
