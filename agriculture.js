/**
 * ========== AGRICULTURE PAGE FUNCTIONALITY ==========
 * Run only on agriculture page
 */
if (document.querySelector('.agriculture-hero')) {
    initAgriculture();
}

function initAgriculture() {
    initCharts();
    initFarmerCarousel();
    initInvestmentTabs();
    initNewsletterForm();
}

/**
 * Initialize all charts using Chart.js
 */
function initCharts() {
    // Export Chart (bar)
    const exportCtx = document.getElementById('exportChart')?.getContext('2d');
    if (exportCtx) {
        new Chart(exportCtx, {
            type: 'bar',
            data: {
                labels: ['China', 'USA', 'Spain', 'Netherlands', 'Mexico'],
                datasets: [{
                    label: 'Fruit Exports (USD billions)',
                    data: [12.5, 9.8, 8.2, 7.6, 6.4],
                    backgroundColor: [
                        'rgba(76, 175, 80, 0.7)',
                        'rgba(255, 152, 0, 0.7)',
                        'rgba(244, 67, 54, 0.7)',
                        'rgba(33, 150, 243, 0.7)',
                        'rgba(156, 39, 176, 0.7)'
                    ],
                    borderColor: [
                        'rgba(76, 175, 80, 1)',
                        'rgba(255, 152, 0, 1)',
                        'rgba(244, 67, 54, 1)',
                        'rgba(33, 150, 243, 1)',
                        'rgba(156, 39, 176, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Import Chart (bar)
    const importCtx = document.getElementById('importChart')?.getContext('2d');
    if (importCtx) {
        new Chart(importCtx, {
            type: 'bar',
            data: {
                labels: ['USA', 'Germany', 'China', 'UK', 'Japan'],
                datasets: [{
                    label: 'Fruit Imports (USD billions)',
                    data: [14.2, 10.1, 9.5, 8.3, 7.8],
                    backgroundColor: [
                        'rgba(76, 175, 80, 0.7)',
                        'rgba(255, 152, 0, 0.7)',
                        'rgba(244, 67, 54, 0.7)',
                        'rgba(33, 150, 243, 0.7)',
                        'rgba(156, 39, 176, 0.7)'
                    ],
                    borderColor: [
                        'rgba(76, 175, 80, 1)',
                        'rgba(255, 152, 0, 1)',
                        'rgba(244, 67, 54, 1)',
                        'rgba(33, 150, 243, 1)',
                        'rgba(156, 39, 176, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Trade Value Over Time (line)
    const tradeCtx = document.getElementById('tradeValueChart')?.getContext('2d');
    if (tradeCtx) {
        new Chart(tradeCtx, {
            type: 'line',
            data: {
                labels: ['2010', '2012', '2014', '2016', '2018', '2020', '2022'],
                datasets: [{
                    label: 'Global Fruit Trade Value (USD billions)',
                    data: [65, 72, 80, 85, 95, 98, 110],
                    borderColor: 'rgba(76, 175, 80, 1)',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

/**
 * Farmer stories carousel with indicators
 */
function initFarmerCarousel() {
    const carousel = document.getElementById('farmersCarousel');
    const indicators = document.getElementById('farmerIndicators');
    if (!carousel || !indicators) return;

    const cards = Array.from(carousel.children);
    const indicatorSpans = Array.from(indicators.children);
    let currentIndex = 0;
    let interval;

    function showCard(index) {
        cards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
        indicatorSpans.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentIndex = index;
    }

    function nextCard() {
        let next = (currentIndex + 1) % cards.length;
        showCard(next);
    }

    // Attach click events to indicators
    indicatorSpans.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            clearInterval(interval);
            showCard(i);
            startAutoRotate();
        });
    });

    function startAutoRotate() {
        interval = setInterval(nextCard, 6000);
    }

    startAutoRotate();

    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(interval));
    carousel.addEventListener('mouseleave', startAutoRotate);
}

/**
 * Investment tabs
 */
function initInvestmentTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;

            // Deactivate all
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Activate current
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Newsletter form validation
 */
function initNewsletterForm() {
    const form = document.getElementById('agriculture-newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('newsletter-name')?.value.trim();
        const email = document.getElementById('newsletter-email')?.value.trim();

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

        // Success (in real app, send to server)
        showNotification(`Thank you for subscribing, ${name}! (demo)`, 'success');
        form.reset();
    });
}

// Reuse existing global functions from previous pages (ensure they are present)
// The following functions should already exist in your script.js from previous iterations:
// - initMobileMenu, initThemeToggle, initBackToTop, initSmoothScroll, updateCopyrightYear, initScrollAnimations, showNotification, debounce, etc.
// If not, include them here. For brevity, assume they are already present.