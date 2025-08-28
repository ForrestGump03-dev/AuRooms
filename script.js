// Mobile menu toggle
function toggleMobileMenu() {
  const navMenu = document.getElementById('nav-menu');
  navMenu.classList.toggle('active');
}

// Funzione per ottenere le coordinate bancarie aggiornate
function getBankingInfo() {
  return {
    iban: localStorage.getItem('bank_iban') || "IT60 X054 2811 1010 0000 0123 456",
    bic: localStorage.getItem('bank_bic') || "BPMOIT22XXX", 
    holder: localStorage.getItem('bank_holder') || "AUROOMS Guest House"
  };
}

// Listener per cambiamenti nelle coordinate bancarie
window.addEventListener('storage', function(e) {
  if (e.key && e.key.startsWith('bank_')) {
    console.log('🏦 Coordinate bancarie aggiornate:', e.key, e.newValue);
    // Ricarica eventuali elementi che dipendono dalle coordinate bancarie
    updateBankingDisplay();
  }
});

// Funzione per aggiornare la visualizzazione delle coordinate bancarie
function updateBankingDisplay() {
  const bankingInfo = getBankingInfo();
  console.log('🏦 Aggiornamento coordinate bancarie:', bankingInfo);
  
  // Puoi aggiungere qui logica specifica per aggiornare l'UI se necessario
  if (typeof updatePaymentPage === 'function') {
    updatePaymentPage(bankingInfo);
  }
}

// Room booking system
const roomsData = [
  {
    id: 1,
    name: { it: "Camera Doppia Comfort", en: "Comfort Double Room" },
    image: "./attached_assets/Glicine1.jpg",
    price: 65,
    maxGuests: 2,
    features: { 
      it: ["Wi-Fi", "TV", "Bagno Privato", "Balcone"], 
      en: ["Wi-Fi", "TV", "Private Bathroom", "Balcony"] 
    },
    available: true
  },
  {
    id: 2,
    name: { it: "Camera Matrimoniale Deluxe", en: "Deluxe Queen Room" },
    image: "./attached_assets/Balcone.jpg",
    price: 85,
    maxGuests: 2,
    features: { 
      it: ["Wi-Fi", "TV", "Bagno con Vasca", "Vista Mare"], 
      en: ["Wi-Fi", "TV", "Bathroom with Tub", "Sea View"] 
    },
    available: true
  },
  {
    id: 3,
    name: { it: "Camera Familiare", en: "Family Room" },
    image: "./attached_assets/Bagno.jpg",
    price: 110,
    maxGuests: 4,
    features: { 
      it: ["Wi-Fi", "TV", "2 Bagni", "Frigorifero"], 
      en: ["Wi-Fi", "TV", "2 Bathrooms", "Refrigerator"] 
    },
    available: true
  }
];

// ===================== DYNAMIC PRICING ENGINE =====================
// Settings schema (localStorage key: 'aurooms_pricing_settings'):
// {
//   season: { lowMonths:[1,2,3,11,12], lowPercent:-20, highMonths:[6,7,8], highPercent:25 },
//   weekend: { days:[5,6], percent:10 }, // 0=Sun ... 6=Sat; default Fri+Sat
//   longStay: { threshold:5, percent:-10 },
//   rounding: { mode:'round'|'floor'|'ceil' }
// }

function getDefaultPricingSettings() {
  return {
    season: {
      lowMonths: [1, 2, 3, 11, 12],
      lowPercent: -20,
      highMonths: [6, 7, 8],
      highPercent: 25
    },
    weekend: { days: [5, 6], percent: 10 },
    longStay: { threshold: 5, percent: -10 },
    rounding: { mode: 'round' }
  };
}

function getPricingSettings() {
  try {
    const saved = localStorage.getItem('aurooms_pricing_settings');
    if (!saved) return getDefaultPricingSettings();
    const parsed = JSON.parse(saved);
    // Merge with defaults to ensure all keys exist
    const d = getDefaultPricingSettings();
    return {
      season: { ...d.season, ...(parsed.season || {}) },
      weekend: { ...d.weekend, ...(parsed.weekend || {}) },
      longStay: { ...d.longStay, ...(parsed.longStay || {}) },
      rounding: { ...d.rounding, ...(parsed.rounding || {}) }
    };
  } catch (e) {
    console.warn('Invalid pricing settings, using defaults', e);
    return getDefaultPricingSettings();
  }
}

function getSeasonPercentForDate(date, settings) {
  const m = date.getMonth() + 1; // 1..12
  const { highMonths = [], highPercent = 0, lowMonths = [], lowPercent = 0 } = settings.season || {};
  if (highMonths.includes(m)) return highPercent || 0;
  if (lowMonths.includes(m)) return lowPercent || 0;
  return 0;
}

function getWeekendPercentForDate(date, settings) {
  const d = date.getDay(); // 0..6
  const { days = [5, 6], percent = 0 } = settings.weekend || {};
  return days.includes(d) ? (percent || 0) : 0;
}

function applyRounding(value, settings) {
  const mode = (settings.rounding && settings.rounding.mode) || 'round';
  if (mode === 'floor') return Math.floor(value);
  if (mode === 'ceil') return Math.ceil(value);
  return Math.round(value);
}

// Calculate dynamic total for a stay given base price per night and dates
function calculateDynamicTotal(basePrice, checkinISO, checkoutISO, nights) {
  const settings = getPricingSettings();
  const start = new Date(checkinISO);
  const end = new Date(checkoutISO);
  const totalNights = nights || Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  let subtotal = 0;

  const day = new Date(start);
  for (let i = 0; i < totalNights; i++) {
    const seasonPct = getSeasonPercentForDate(day, settings);
    const weekendPct = getWeekendPercentForDate(day, settings);
    const pct = seasonPct + weekendPct; // additive
    const nightly = basePrice * (1 + pct / 100);
    subtotal += nightly;
    day.setDate(day.getDate() + 1);
  }

  // Long stay discount/surcharge applied on subtotal
  const { threshold = 0, percent = 0 } = settings.longStay || {};
  if (threshold && totalNights >= threshold && percent) {
    subtotal = subtotal * (1 + percent / 100);
  }

  return applyRounding(subtotal, settings);
}

// Expose for other pages
window.calculateDynamicTotal = calculateDynamicTotal;

// Enhanced booking form handler
function handleBookingSearch(e) {
  e.preventDefault();
  
  const checkin = document.getElementById('checkin').value;
  const checkout = document.getElementById('checkout').value;
  const guests = parseInt(document.getElementById('guests').value);
  
  if (!checkin || !checkout) {
    alert('Seleziona le date di check-in e check-out');
    return;
  }
  
  if (new Date(checkin) >= new Date(checkout)) {
    alert('La data di check-out deve essere successiva al check-in');
    return;
  }
  
  // Calculate nights
  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
  
  // Filter available rooms based on guests
  const availableRooms = roomsData.filter(room => 
    room.available && room.maxGuests >= guests
  );
  
  displaySearchResults(availableRooms, nights, checkin, checkout, guests);
}

function displaySearchResults(rooms, nights, checkin, checkout, guests) {
  const resultsSection = document.getElementById('search-results');
  const roomsList = document.getElementById('rooms-list');
  const currentLang = document.querySelector('[data-lang="it"]').classList.contains('hidden') ? 'en' : 'it';
  
  // Clear previous results
  roomsList.innerHTML = '';
  
  if (rooms.length === 0) {
    roomsList.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <p>${currentLang === 'it' ? 'Nessuna camera disponibile per le date selezionate.' : 'No rooms available for selected dates.'}</p>
        <p>${currentLang === 'it' ? 'Contattaci su WhatsApp per altre opzioni.' : 'Contact us on WhatsApp for other options.'}</p>
      </div>
    `;
  } else {
    rooms.forEach(room => {
  const totalPrice = calculateDynamicTotal(room.price, checkin, checkout, nights);
      const roomCard = createRoomCard(room, totalPrice, nights, checkin, checkout, guests, currentLang);
      roomsList.appendChild(roomCard);
    });
  }
  
  // Show results
  resultsSection.classList.remove('hidden');
  resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function createRoomCard(room, totalPrice, nights, checkin, checkout, guests, lang) {
  const card = document.createElement('div');
  card.className = 'room-card';
  
  const featuresText = room.features[lang].join(' • ');
  const nightsText = lang === 'it' ? 
    `${nights} ${nights > 1 ? 'notti' : 'notte'}` : 
    `${nights} ${nights > 1 ? 'nights' : 'night'}`;
  const perNight = Math.max(1, Math.round(totalPrice / Math.max(1, nights)));
  const perNightLabel = lang === 'it' ? `${perNight} € / notte` : `${perNight} € / night`;
  
  card.innerHTML = `
    <img src="${room.image}" alt="${room.name[lang]}" class="room-image">
    <div class="room-info">
      <h4>${room.name[lang]}</h4>
      <div class="room-features">${featuresText}</div>
      <p style="font-size: 0.9rem; color: var(--muted-color);">
        ${lang === 'it' ? 'Fino a' : 'Up to'} ${room.maxGuests} ${lang === 'it' ? 'ospiti' : 'guests'}
      </p>
    </div>
    <div class="room-price">
      <span class="price-amount">€${totalPrice}</span>
      <span class="price-per-night" style="display:block; color: var(--muted-color); font-size: .9rem; margin-top:.15rem;">${perNightLabel}</span>
      <span class="price-unit">${nightsText}</span>
      <button class="book-room-btn" onclick="bookRoom(${room.id}, '${checkin}', '${checkout}', ${guests})">
        ${lang === 'it' ? 'Prenota' : 'Book Now'}
      </button>
    </div>
  `;
  
  return card;
}

function bookRoom(roomId, checkin, checkout, guests) {
  // Check if user is logged in
  const currentUser = localStorage.getItem('aurooms_current_user');
  if (!currentUser) {
    // Store the booking attempt and redirect to login
    sessionStorage.setItem('pending_booking', JSON.stringify({
      roomId, checkin, checkout, guests,
      roomName: roomsData.find(r => r.id === roomId).name.it,
      pricePerNight: roomsData.find(r => r.id === roomId).price,
      nights: Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24))
    }));
    sessionStorage.setItem('returnUrl', 'pagamento.html');
    window.location.href = 'login.html';
    return;
  }

  const room = roomsData.find(r => r.id === roomId);
  const currentLang = document.querySelector('[data-lang="it"]').classList.contains('hidden') ? 'en' : 'it';
  
  // Store booking data and go to payment
  sessionStorage.setItem('pending_booking', JSON.stringify({
    roomId, checkin, checkout, guests,
    roomName: room.name[currentLang],
    pricePerNight: room.price,
    nights: Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24)),
    totalPrice: calculateDynamicTotal(room.price, checkin, checkout)
  }));
  
  window.location.href = 'pagamento.html';
}

// Set minimum date to today
function setMinDate() {
  const today = new Date().toISOString().split('T')[0];
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');
  
  if (checkinInput) checkinInput.min = today;
  if (checkoutInput) checkoutInput.min = today;
}

// Update checkout min date when checkin changes
function updateCheckoutMinDate() {
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');
  
  if (checkinInput && checkoutInput) {
    checkinInput.addEventListener('change', function() {
      const checkinDate = new Date(this.value);
      checkinDate.setDate(checkinDate.getDate() + 1); // Minimum 1 night
      checkoutInput.min = checkinDate.toISOString().split('T')[0];
      
      // Clear checkout if it's before new minimum
      if (checkoutInput.value && new Date(checkoutInput.value) <= new Date(this.value)) {
        checkoutInput.value = '';
      }
    });
  }
}

// Language switching function
function switchLang(lang) {
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.classList.add('hidden');
    if (el.getAttribute('data-lang') === lang) el.classList.remove('hidden');
  });
  
  // Update placeholders for form inputs
  document.querySelectorAll('input[data-placeholder-' + lang + '], textarea[data-placeholder-' + lang + ']').forEach(el => {
    el.placeholder = el.getAttribute('data-placeholder-' + lang);
  });
  
  // Update payment button text based on selected method and language
  updatePaymentButtonText(lang);
  
  // Update final total display in payment page
  const finalTotal = document.getElementById('final-total');
  const finalTotalEn = document.getElementById('final-total-en');
  if (finalTotal && finalTotalEn) {
    const amount = finalTotal.textContent;
    finalTotalEn.textContent = amount;
  }
  
  // Update booking reference for bank transfer in both languages
  const bookingRef = document.getElementById('booking-reference');
  const bookingRefEn = document.getElementById('booking-reference-en');
  const causale = document.getElementById('causale');
  const causaleEn = document.getElementById('causale-en');
  const bonifico = document.getElementById('bonifico-amount');
  const bonificoEn = document.getElementById('bonifico-amount-en');
  
  if (bookingRef && bookingRefEn) {
    bookingRefEn.textContent = bookingRef.textContent;
  }
  if (causale && causaleEn) {
    causaleEn.textContent = causale.textContent;
  }
  if (bonifico && bonificoEn) {
    bonificoEn.textContent = bonifico.textContent;
  }
}

function updatePaymentButtonText(lang = 'it') {
  const button = document.getElementById('payment-btn');
  if (!button || !window.selectedPaymentMethod) return;
  
  const buttonTexts = {
    it: {
      stripe: '💳 Paga con Carta di Credito',
      paypal: '💰 Paga con PayPal',
      bonifico: '🏦 Conferma Prenotazione (Bonifico)'
    },
    en: {
      stripe: '💳 Pay with Credit Card',
      paypal: '💰 Pay with PayPal',
      bonifico: '🏦 Confirm Booking (Bank Transfer)'
    }
  };
  
  const text = buttonTexts[lang][window.selectedPaymentMethod];
  if (text) {
    button.innerHTML = `<span data-lang="${lang}">${text}</span>`;
  }
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
  // Check authentication and update UI
  updateAuthUI();
  
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
    bookingForm.addEventListener('submit', handleBookingSearch);
  }
  
  // Initialize date constraints
  setMinDate();
  updateCheckoutMinDate();
});

// Authentication functions
function updateAuthUI() {
  const currentUser = localStorage.getItem('aurooms_current_user');
  let authContainer = document.querySelector('#auth-links');
  if (!authContainer) authContainer = document.querySelector('.auth-links');
  
  if (authContainer) {
    if (currentUser) {
      const user = JSON.parse(currentUser);
      authContainer.innerHTML = `
        <a href="dashboard.html" style="margin-right: 1rem; color: #007bff;">
          <span data-lang="it">👤 ${user.firstName || user.name}</span>
          <span class="hidden" data-lang="en">👤 ${user.firstName || user.name}</span>
        </a>
        <a href="#" onclick="logout()" style="color: var(--del-color);">
          <span data-lang="it">Logout</span>
          <span class="hidden" data-lang="en">Logout</span>
        </a>
      `;
    } else {
      authContainer.innerHTML = `
        <a href="login.html" style="margin-right: 0.5rem;">
          <span data-lang="it">🔑 Accedi</span>
          <span class="hidden" data-lang="en">🔑 Login</span>
        </a>
      `;
    }
  }
}

function logout() {
  localStorage.removeItem('aurooms_current_user');
  sessionStorage.clear();
  updateAuthUI();
  
  // Redirect to home if on a protected page
  if (window.location.pathname.includes('dashboard') || 
      window.location.pathname.includes('pagamento')) {
    window.location.href = 'index.html';
  }
}
