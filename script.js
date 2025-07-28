
// Language switching function
function switchLang(lang) {
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.classList.add('hidden');
    if (el.getAttribute('data-lang') === lang) el.classList.remove('hidden');
  });
}

// Booking form handler
function salvaPrenotazione(e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const checkin = document.getElementById('checkin').value;
  const checkout = document.getElementById('checkout').value;
  
  localStorage.setItem('nome', nome);
  localStorage.setItem('checkin', checkin);
  localStorage.setItem('checkout', checkout);
  
  window.location.href = "conferma.html";
}

// Initialize libraries when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS (Animate On Scroll) with better error handling
  function initAOS() {
    try {
      if (typeof AOS !== 'undefined') {
        AOS.init({
          duration: 800,
          once: true
        });
      } else {
        // If AOS is not loaded, just add a fallback fade-in effect
        setTimeout(() => {
          document.querySelectorAll('[data-aos]').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
        }, 100);
      }
    } catch (error) {
      console.warn('AOS initialization failed, using fallback:', error);
      // Fallback animation
      document.querySelectorAll('[data-aos]').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }
  }
  
  // Start AOS initialization with delay to ensure library is loaded
  setTimeout(initAOS, 100);
  
  // Initialize Swiper
  try {
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
  } catch (error) {
    console.warn('Swiper initialization failed:', error);
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const section = document.querySelector(this.getAttribute('href'));
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Booking form event listener
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', salvaPrenotazione);
  }
});
