/**
 * Frutilabs - Main JavaScript
 * Handles global interactivity and contact page functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initThemeToggle();
    initBackToTop();
    initSmoothScroll();
    updateCopyrightYear();
    initScrollAnimations();
    loadCart();

    // Initialize contact page features if on contact page
    if (document.querySelector('.contact-hero')) {
        initContactForm();
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
        '.info-card, .faq-item, .contact-form-wrapper, .contact-info-wrapper'
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

/* ========== CONTACT PAGE FUNCTIONALITY ========== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Real-time validation
    nameInput.addEventListener('input', () => validateField(nameInput, 'name-error', validateName));
    emailInput.addEventListener('input', () => validateField(emailInput, 'email-error', validateEmail));
    phoneInput.addEventListener('input', () => validateField(phoneInput, 'phone-error', validatePhone));
    subjectInput.addEventListener('input', () => validateField(subjectInput, 'subject-error', validateRequired));
    messageInput.addEventListener('input', () => validateField(messageInput, 'message-error', validateRequired));

    // Blur validation (show errors after leaving field)
    nameInput.addEventListener('blur', () => validateField(nameInput, 'name-error', validateName, true));
    emailInput.addEventListener('blur', () => validateField(emailInput, 'email-error', validateEmail, true));
    phoneInput.addEventListener('blur', () => validateField(phoneInput, 'phone-error', validatePhone, true));
    subjectInput.addEventListener('blur', () => validateField(subjectInput, 'subject-error', validateRequired, true));
    messageInput.addEventListener('blur', () => validateField(messageInput, 'message-error', validateRequired, true));

    form.addEventListener('submit', handleSubmit);

    // Validation functions
    function validateName(value) {
        if (!value.trim()) return 'Name is required.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters.';
        return '';
    }

    function validateEmail(value) {
        if (!value.trim()) return 'Email is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address.';
        return '';
    }

    function validatePhone(value) {
        if (!value.trim()) return ''; // optional
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,4}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Please enter a valid phone number.';
        return '';
    }

    function validateRequired(value) {
        if (!value.trim()) return 'This field is required.';
        return '';
    }

    function validateField(input, errorId, validator, showError = true) {
        const errorEl = document.getElementById(errorId);
        const value = input.value;
        const errorMsg = validator(value);

        if (errorMsg) {
            input.classList.add('error');
            if (showError) errorEl.textContent = errorMsg;
            else errorEl.textContent = '';
            return false;
        } else {
            input.classList.remove('error');
            errorEl.textContent = '';
            return true;
        }
    }

    function validateForm() {
        let isValid = true;
        isValid &= validateField(nameInput, 'name-error', validateName, true);
        isValid &= validateField(emailInput, 'email-error', validateEmail, true);
        isValid &= validateField(phoneInput, 'phone-error', validatePhone, true);
        isValid &= validateField(subjectInput, 'subject-error', validateRequired, true);
        isValid &= validateField(messageInput, 'message-error', validateRequired, true);
        return Boolean(isValid);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!validateForm()) {
            showNotification('Please fix the errors in the form.', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        setTimeout(() => {
            showNotification('Thank you! Your message has been sent. (demo)', 'success');
            form.reset();
            // Remove error states
            document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }
}