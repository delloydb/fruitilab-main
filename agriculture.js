/**
 * Frutilabs - Main JavaScript
 * Handles global interactivity and agriculture-specific functionality
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

    // Initialize agriculture features if on agriculture page
    if (document.querySelector('.agriculture-hero')) {
        initAgriculture();
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
        '.trade-card, .practice-card, .farmer-card, .investment-card, .section-title'
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

/* ========== CART FUNCTIONALITY ========== */
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

/* ========== AGRICULTURE PAGE FUNCTIONALITY ========== */
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

/**
 * Debounce helper (if needed elsewhere)
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}