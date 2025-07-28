
// Language switching function
function switchLang(lang) {
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.classList.add('hidden');
    if (el.getAttribute('data-lang') === lang) el.classList.remove('hidden');
  });
}

// Initialize libraries when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init();
  }
  
  // Initialize Swiper
  if (typeof Swiper !== 'undefined') {
    new Swiper('.swiper', {
      loop: true,
      autoplay: { delay: 3000 },
    });
  }
});
