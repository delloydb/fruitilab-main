/**
 * ========== ABOUT PAGE FUNCTIONALITY ==========
 * Run only on about page
 */
if (document.querySelector('.about-hero')) {
    initAbout();
}

function initAbout() {
    initMap();
    initContactForm();
    initNewsletter();
    initLiveChat();
    initTeamHover(); // Optional enhancement
}

/**
 * Initialize Leaflet map with capital city markers
 */
function initMap() {
    const mapElement = document.getElementById('world-map');
    if (!mapElement) return;

    // Sample capital cities where Frutilabs has presence
    const cities = [
        { name: 'Washington D.C.', lat: 38.9072, lng: -77.0369 },
        { name: 'London', lat: 51.5074, lng: -0.1278 },
        { name: 'Paris', lat: 48.8566, lng: 2.3522 },
        { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
        { name: 'Canberra', lat: -35.2809, lng: 149.1300 },
        { name: 'Brasília', lat: -15.8267, lng: -47.9218 },
        { name: 'Pretoria', lat: -25.7479, lng: 28.2293 },
        { name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
        { name: 'Beijing', lat: 39.9042, lng: 116.4074 },
        { name: 'Moscow', lat: 55.7558, lng: 37.6173 }
    ];

    const map = L.map(mapElement).setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers
    cities.forEach(city => {
        L.marker([city.lat, city.lng])
            .addTo(map)
            .bindPopup(`<b>${city.name}</b><br>Frutilabs location`);
    });

    // Update location count
    const countSpan = document.getElementById('location-count');
    if (countSpan) {
        countSpan.textContent = cities.length + '+';
    }
}

/**
 * Contact form validation
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        if (!name) {
            showNotification('Please enter your name.', 'error');
            return;
        }
        if (!email) {
            showNotification('Please enter your email address.', 'error');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        if (!message) {
            showNotification('Please enter your message.', 'error');
            return;
        }

        // Success (in real app, send to server)
        showNotification('Thank you for your message! We\'ll get back to you soon. (demo)', 'success');
        form.reset();
    });
}

/**
 * Newsletter form validation
 */
function initNewsletter() {
    const form = document.getElementById('about-newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('about-newsletter-email').value.trim();

        if (!email) {
            showNotification('Please enter your email address.', 'error');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        showNotification('Thank you for subscribing to our newsletter! (demo)', 'success');
        form.reset();
    });
}

/**
 * Live chat button demo
 */
function initLiveChat() {
    const chatBtn = document.querySelector('.chat-btn');
    if (!chatBtn) return;

    chatBtn.addEventListener('click', () => {
        showNotification('Live chat demo - support would be connected here.', 'info');
    });
}

/**
 * Optional: Team member hover enhancement (already in CSS)
 * This function can be used to dynamically load team data if needed
 */
function initTeamHover() {
    // Already handled by CSS, but could be extended
    console.log('Team section ready');
}

// Reuse existing global functions (showNotification, initMobileMenu, etc.) from previous pages