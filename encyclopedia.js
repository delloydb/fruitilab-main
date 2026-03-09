/**
 * Frutilabs - Main JavaScript
 * Handles global interactivity and encyclopedia-specific functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initThemeToggle();
    initBackToTop();
    initSmoothScroll();
    updateCopyrightYear();
    initScrollAnimations();
    loadCart(); // Load cart from localStorage

    // Initialize encyclopedia features if on encyclopedia page
    if (document.querySelector('.encyclopedia-hero')) {
        initEncyclopedia();
    }
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const toggleButton = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('.primary-nav');

    if (!toggleButton || !primaryNav) return;

    toggleButton.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
        this.setAttribute('aria-expanded', expanded);
        primaryNav.classList.toggle('active');
        document.body.style.overflow = expanded ? 'hidden' : '';
    });

    primaryNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleButton.setAttribute('aria-expanded', 'false');
            primaryNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            toggleButton.setAttribute('aria-expanded', 'false');
            primaryNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Theme Toggle (Light/Dark Mode)
 */
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;

    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('frutilabs-theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    }

    themeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('frutilabs-theme', newTheme);
    });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/**
 * Update Copyright Year
 */
function updateCopyrightYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/**
 * Scroll Animations (Fade-in)
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.fruit-card, .category-card, .section-title, .fact-card'
    );

    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

/**
 * Show Notification Toast
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? '#f44336' : '#4caf50'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/* ========== CART FUNCTIONALITY (for modal add-to-cart) ========== */
let cart = [];

function loadCart() {
    const savedCart = localStorage.getItem('frutilabs-cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
        }
    }
    updateCartCount();
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
    }
}

function addToCart(product) {
    // product should have id, name, price, image
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('frutilabs-cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} added to cart!`, 'success');
}

/* ========== ENCYCLOPEDIA PAGE FUNCTIONALITY ========== */
function initEncyclopedia() {
    initSearch();
    initCarousel();
    initMap();
    initCalendar();
    initFactsCarousel();
    initFruitModal();
}

/**
 * Search functionality (demo)
 */
function initSearch() {
    const searchInput = document.getElementById('encyclopedia-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', debounce(function() {
        const query = this.value.toLowerCase().trim();
        if (query) {
            showNotification(`Searching for: "${query}" (demo)`, 'info');
        }
    }, 300));
}

/**
 * Featured fruits carousel
 */
function initCarousel() {
    const track = document.getElementById('fruit-carousel-track');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const indicatorsContainer = document.getElementById('carousel-indicators');

    if (!track || !prevBtn || !nextBtn) return;

    const cards = Array.from(track.children);
    const cardWidth = cards[0]?.offsetWidth || 280;
    const gap = 16; // matches --spacing-md
    const visibleCount = getVisibleCardCount();
    let currentIndex = 0;

    function getVisibleCardCount() {
        if (window.innerWidth >= 1024) return 4;
        if (window.innerWidth >= 768) return 3;
        if (window.innerWidth >= 480) return 2;
        return 1;
    }

    function updateCarousel() {
        const maxIndex = cards.length - visibleCount;
        currentIndex = Math.min(currentIndex, maxIndex);
        const translateX = -(currentIndex * (cardWidth + gap));
        track.style.transform = `translateX(${translateX}px)`;
        updateIndicators();
    }

    function updateIndicators() {
        if (!indicatorsContainer) return;
        const totalIndicators = Math.ceil(cards.length / visibleCount);
        indicatorsContainer.innerHTML = '';
        for (let i = 0; i < totalIndicators; i++) {
            const indicator = document.createElement('span');
            indicator.classList.add('indicator');
            if (i === Math.floor(currentIndex / visibleCount)) {
                indicator.classList.add('active');
            }
            indicator.addEventListener('click', () => {
                currentIndex = i * visibleCount;
                updateCarousel();
            });
            indicatorsContainer.appendChild(indicator);
        }
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex -= 1;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - visibleCount) {
            currentIndex += 1;
            updateCarousel();
        }
    });

    window.addEventListener('resize', debounce(() => {
        const newVisibleCount = getVisibleCardCount();
        if (newVisibleCount !== visibleCount) {
            currentIndex = 0;
            updateCarousel();
        }
    }, 200));

    updateCarousel();
}

/**
 * Initialize Leaflet map for fruit origins
 */
function initMap() {
    const mapElement = document.getElementById('fruit-map');
    if (!mapElement) return;

    // Sample fruit origin data (lat, lon, name, type)
    const fruitOrigins = [
        { name: 'Mango', lat: 20.5937, lng: 78.9629, type: 'tropical' },
        { name: 'Orange', lat: 28.6139, lng: 77.2090, type: 'citrus' },
        { name: 'Blueberry', lat: 44.0682, lng: -114.7420, type: 'berries' },
        { name: 'Strawberry', lat: 36.7783, lng: -119.4179, type: 'berries' },
        { name: 'Dragon Fruit', lat: 23.6345, lng: -102.5528, type: 'tropical' },
        { name: 'Passion Fruit', lat: -14.2350, lng: -51.9253, type: 'exotic' },
        { name: 'Peach', lat: 32.1656, lng: -82.9001, type: 'stone' },
        { name: 'Watermelon', lat: 27.9944, lng: -81.7603, type: 'melons' },
    ];

    const map = L.map(mapElement).setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers
    const markers = [];
    fruitOrigins.forEach(fruit => {
        const marker = L.marker([fruit.lat, fruit.lng]).addTo(map)
            .bindPopup(`<b>${fruit.name}</b><br>Origin`);
        markers.push({ marker, type: fruit.type });
    });

    // Filter by fruit type
    const filterSelect = document.getElementById('map-fruit-type');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            const selected = this.value;
            markers.forEach(item => {
                if (selected === 'all' || item.type === selected) {
                    map.addLayer(item.marker);
                } else {
                    map.removeLayer(item.marker);
                }
            });
        });
    }
}

/**
 * Seasonal calendar
 */
function initCalendar() {
    const regionSelect = document.getElementById('calendar-region');
    const prevYearBtn = document.querySelector('.prev-year');
    const nextYearBtn = document.querySelector('.next-year');
    const yearDisplay = document.getElementById('calendar-year');
    const monthsGrid = document.getElementById('months-grid');
    const legendContainer = document.getElementById('fruit-legend');

    let currentYear = new Date().getFullYear();
    let currentRegion = 'north-america';

    // Sample data: fruit availability by region and month (1-12)
    const availabilityData = {
        'north-america': {
            'Mango': [5, 6, 7, 8],
            'Blueberry': [6, 7, 8],
            'Strawberry': [4, 5, 6],
            'Orange': [1, 2, 3, 12],
            'Watermelon': [7, 8, 9],
            'Peach': [7, 8, 9],
        },
        'south-america': {
            'Mango': [11, 12, 1, 2],
            'Passion Fruit': [3, 4, 5, 6],
            'Orange': [6, 7, 8],
        },
        // Add more regions as needed
    };

    const fruitColors = {
        'Mango': '#FFA500',
        'Blueberry': '#4B0082',
        'Strawberry': '#FF1493',
        'Orange': '#FF8C00',
        'Watermelon': '#2E8B57',
        'Peach': '#FFDAB9',
        'Passion Fruit': '#8A2BE2',
    };

    function renderCalendar() {
        const regionData = availabilityData[currentRegion] || {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        let html = '';
        for (let m = 0; m < 12; m++) {
            const monthNum = m + 1;
            const fruitsInMonth = Object.keys(regionData).filter(fruit => 
                regionData[fruit].includes(monthNum)
            );

            html += `
                <div class="month-card">
                    <div class="month-name">${months[m]}</div>
                    <ul class="fruit-list">
                        ${fruitsInMonth.map(fruit => 
                            `<li style="border-left: 3px solid ${fruitColors[fruit] || '#4CAF50'}; padding-left: 0.5rem;">${fruit}</li>`
                        ).join('')}
                        ${fruitsInMonth.length === 0 ? '<li style="color: #999;">—</li>' : ''}
                    </ul>
                </div>
            `;
        }
        monthsGrid.innerHTML = html;

        // Legend
        const fruits = Object.keys(regionData);
        let legendHtml = '';
        fruits.forEach(fruit => {
            legendHtml += `
                <div class="legend-item">
                    <span class="legend-color" style="background: ${fruitColors[fruit] || '#4CAF50'};"></span>
                    <span>${fruit}</span>
                </div>
            `;
        });
        legendContainer.innerHTML = legendHtml || '<p>No data for this region</p>';
    }

    if (regionSelect) {
        regionSelect.addEventListener('change', function() {
            currentRegion = this.value;
            renderCalendar();
        });
    }

    if (prevYearBtn) {
        prevYearBtn.addEventListener('click', () => {
            currentYear--;
            yearDisplay.textContent = currentYear;
            renderCalendar();
        });
    }

    if (nextYearBtn) {
        nextYearBtn.addEventListener('click', () => {
            currentYear++;
            yearDisplay.textContent = currentYear;
            renderCalendar();
        });
    }

    renderCalendar();
}

/**
 * Fun facts carousel (auto-rotate)
 */
function initFactsCarousel() {
    const factsCarousel = document.getElementById('facts-carousel');
    const indicators = document.getElementById('fact-indicators');
    if (!factsCarousel || !indicators) return;

    const facts = Array.from(factsCarousel.children);
    let currentIndex = 0;
    let interval;

    function showFact(index) {
        facts.forEach((fact, i) => {
            fact.classList.toggle('active', i === index);
        });
        Array.from(indicators.children).forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentIndex = index;
    }

    function nextFact() {
        let next = (currentIndex + 1) % facts.length;
        showFact(next);
    }

    // Create indicators
    facts.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('indicator');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            clearInterval(interval);
            showFact(i);
            startAutoRotate();
        });
        indicators.appendChild(dot);
    });

    function startAutoRotate() {
        interval = setInterval(nextFact, 5000);
    }

    startAutoRotate();

    // Pause on hover
    factsCarousel.addEventListener('mouseenter', () => clearInterval(interval));
    factsCarousel.addEventListener('mouseleave', startAutoRotate);
}

/**
 * Fruit detail modal
 */
function initFruitModal() {
    const modal = document.getElementById('fruit-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close-modal');

    if (!modal || !modalBody) return;

    // Sample fruit data
    const fruitData = {
        mango: {
            name: 'Mango',
            scientific: 'Mangifera indica',
            origin: 'South Asia',
            description: 'Mangoes are juicy stone fruits from tropical regions. They are rich in vitamins A and C, and are known as the "king of fruits".',
            image: 'assets/images/mango.jpg',
        },
        dragonfruit: {
            name: 'Dragon Fruit',
            scientific: 'Hylocereus undatus',
            origin: 'Central America',
            description: 'Dragon fruit, also known as pitaya, is a tropical cactus fruit with vibrant pink skin and sweet white flesh dotted with tiny black seeds.',
            image: 'assets/images/dragonfruit.jpg',
        },
        blueberries: {
            name: 'Blueberries',
            scientific: 'Vaccinium sect. Cyanococcus',
            origin: 'North America',
            description: 'Blueberries are small, nutrient-packed berries rich in antioxidants. They are great for heart health and brain function.',
            image: 'assets/images/blueberries.jpg',
        },
        pomegranate: {
            name: 'Pomegranate',
            scientific: 'Punica granatum',
            origin: 'Iran',
            description: 'Pomegranates are ancient fruits with juicy arils. They are loaded with antioxidants and have been symbols of life and fertility.',
            image: 'assets/images/pomegranate.jpg',
        },
        passionfruit: {
            name: 'Passion Fruit',
            scientific: 'Passiflora edulis',
            origin: 'South America',
            description: 'Passion fruit is a tropical vine fruit with a tough outer rind and juicy, seed-filled pulp. It is aromatic and tangy.',
            image: 'assets/images/passionfruit.jpg',
        },
    };

    document.querySelectorAll('.fruit-detail-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const fruitKey = this.dataset.fruit;
            const data = fruitData[fruitKey];
            if (!data) return;

            modalBody.innerHTML = `
                <div class="quickview-product">
                    <img src="${data.image}" alt="${data.name}" loading="lazy">
                    <div class="quickview-details">
                        <h3>${data.name}</h3>
                        <p class="scientific-name"><i>${data.scientific}</i></p>
                        <p class="origin"><i class="fas fa-map-marker-alt"></i> ${data.origin}</p>
                        <p class="description">${data.description}</p>
                        <button class="btn primary add-to-cart-modal" data-fruit='${JSON.stringify({
                            id: fruitKey,
                            name: data.name,
                            price: 5.99, // placeholder price
                            image: data.image
                        })}'>Add to Cart</button>
                    </div>
                </div>
            `;

            // Attach add to cart
            const addBtn = modalBody.querySelector('.add-to-cart-modal');
            if (addBtn) {
                addBtn.addEventListener('click', function() {
                    const product = JSON.parse(this.dataset.fruit);
                    addToCart(product);
                    modal.classList.remove('active');
                });
            }

            modal.classList.add('active');
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.classList.remove('active');
    });
}

/**
 * Debounce helper
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}