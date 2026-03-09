/**
 * Frutilabs - Main JavaScript
 * Handles interactivity, mobile menu, theme toggle, forms, and UI enhancements
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initThemeToggle();
    initBackToTop();
    initSmoothScroll();
    initSearchForm();
    initNewsletterForm();
    updateCopyrightYear();
    initScrollAnimations();
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
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = expanded ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    primaryNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleButton.setAttribute('aria-expanded', 'false');
            primaryNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on window resize if open
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

    // Check for saved theme preference
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
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Search Form Handling
 */
function initSearchForm() {
    const searchForm = document.querySelector('.search-form');
    
    if (!searchForm) return;

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchInput = this.querySelector('input[type="search"]');
        const query = searchInput.value.trim();
        
        if (query === '') {
            showNotification('Please enter a search term', 'error');
            return;
        }

        // In a real website, you would redirect to search results page
        showNotification(`Searching for: "${query}" (demo functionality)`, 'success');
        searchInput.value = ''; // Clear input for demo
    });
}

/**
 * Newsletter Form Validation
 */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            emailInput.focus();
            return;
        }

        // Success - in a real site you would send to server
        showNotification('Thank you for subscribing! (demo)', 'success');
        emailInput.value = '';
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
 * Simple Scroll Animations (Fade-in on scroll)
 */
function initScrollAnimations() {
    // Select elements to animate
    const animatedElements = document.querySelectorAll(
        '.fruit-card, .benefit-card, .link-card, .testimonial-card, .section-header'
    );

    if (animatedElements.length === 0) return;

    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Set initial styles and observe
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

/**
 * Show Notification (Simple alert replacement for demo)
 * In production, you might want a toast notification system
 */
function showNotification(message, type = 'info') {
    // For demo purposes, we'll use console.log
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // You could also create a visual notification
    // This is a simple implementation
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

    // Add animation style if not exists
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

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}