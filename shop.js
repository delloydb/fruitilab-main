/**
 * Frutilabs - Main JavaScript
 * Handles global interactivity and shop-specific functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initThemeToggle();
    initBackToTop();
    initSmoothScroll();
    updateCopyrightYear();
    initScrollAnimations();

    // Initialize shop features if on shop page
    if (document.querySelector('.product-grid')) {
        initShop();
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
        '.fruit-card, .benefit-card, .link-card, .testimonial-card, .section-header, .product-card'
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

/**
 * ========== SHOP PAGE FUNCTIONALITY ==========
 */
function initShop() {
    const products = document.querySelectorAll('.product-card');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const organicCheckbox = document.getElementById('organic-filter');
    const resetBtn = document.getElementById('reset-filters');
    const sortSelect = document.getElementById('sort-select');
    const resultsCount = document.getElementById('results-count');

    // Event listeners
    if (searchInput) searchInput.addEventListener('input', debounce(filterProducts, 300));
    if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
    if (priceFilter) priceFilter.addEventListener('change', filterProducts);
    if (organicCheckbox) organicCheckbox.addEventListener('change', filterProducts);
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
    if (sortSelect) sortSelect.addEventListener('change', sortProducts);

    // Quick view
    document.querySelectorAll('.quick-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            if (card) openQuickView(card);
        });
    });

    // Add to cart
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.product-card');
            if (card) addToCart(card);
        });
    });

    // Cart sidebar
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const continueShopping = document.querySelector('.continue-shopping');

    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', openCart);
    }
    if (closeCart) closeCart.addEventListener('click', closeCartFunc);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartFunc);
    if (continueShopping) continueShopping.addEventListener('click', closeCartFunc);

    // Load cart from storage
    loadCart();

    // Initial filter (to set count)
    filterProducts();

    function filterProducts() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const category = categoryFilter ? categoryFilter.value : 'all';
        const priceRange = priceFilter ? priceFilter.value : 'all';
        const organicOnly = organicCheckbox ? organicCheckbox.checked : false;

        let visibleCount = 0;

        products.forEach(product => {
            let visible = true;

            const name = product.dataset.name ? product.dataset.name.toLowerCase() : '';
            if (searchTerm && !name.includes(searchTerm)) visible = false;

            if (visible && category !== 'all' && product.dataset.category !== category) visible = false;

            if (visible && priceRange !== 'all') {
                const price = parseFloat(product.dataset.price);
                if (priceRange === '0-5' && (price < 0 || price > 5)) visible = false;
                else if (priceRange === '5-10' && (price < 5 || price > 10)) visible = false;
                else if (priceRange === '10-15' && (price < 10 || price > 15)) visible = false;
                else if (priceRange === '15-20' && (price < 15 || price > 20)) visible = false;
                else if (priceRange === '20+' && price <= 20) visible = false;
            }

            if (visible && organicOnly) {
                const isOrganic = product.dataset.organic === 'true';
                if (!isOrganic) visible = false;
            }

            product.style.display = visible ? '' : 'none';
            if (visible) visibleCount++;
        });

        if (resultsCount) {
            resultsCount.textContent = `${visibleCount} product${visibleCount !== 1 ? 's' : ''}`;
        }

        if (sortSelect && sortSelect.value !== 'default') {
            sortProducts();
        }
    }

    function resetFilters() {
        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = 'all';
        if (priceFilter) priceFilter.value = 'all';
        if (organicCheckbox) organicCheckbox.checked = false;
        filterProducts();
    }

    function sortProducts() {
        const sortBy = sortSelect.value;
        const grid = document.getElementById('product-grid');
        const visibleProducts = Array.from(products).filter(p => p.style.display !== 'none');

        if (sortBy === 'default') {
            visibleProducts.sort((a, b) => parseInt(a.dataset.id) - parseInt(b.dataset.id));
        } else if (sortBy === 'price-asc') {
            visibleProducts.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
        } else if (sortBy === 'price-desc') {
            visibleProducts.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
        } else if (sortBy === 'rating') {
            visibleProducts.sort((a, b) => parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating));
        }

        visibleProducts.forEach(product => grid.appendChild(product));
    }

    function openQuickView(card) {
        const modal = document.getElementById('quickview-modal');
        const modalBody = document.getElementById('quickview-body');

        const id = card.dataset.id;
        const name = card.dataset.name || card.querySelector('.product-title')?.textContent || 'Fruit';
        const price = parseFloat(card.dataset.price) || 0;
        const rating = parseFloat(card.dataset.rating) || 0;
        const origin = card.dataset.origin || 'Unknown';
        const organic = card.dataset.organic === 'true' ? 'Organic' : 'Conventional';
        const image = card.querySelector('.card-image img')?.src || '';
        const description = `Fresh ${name} sourced directly from ${origin}. Perfect for healthy snacking, smoothies, and desserts.`;

        modalBody.innerHTML = `
            <div class="quickview-product">
                <img src="${image}" alt="${name}" loading="lazy">
                <div class="quickview-details">
                    <h3>${name}</h3>
                    <div class="quickview-price">$${price.toFixed(2)}</div>
                    <div class="quickview-meta">
                        <p><i class="fas fa-map-marker-alt"></i> Origin: ${origin}</p>
                        <p><i class="fas fa-leaf"></i> ${organic}</p>
                        <p><i class="fas fa-star"></i> Rating: ${rating.toFixed(1)} / 5</p>
                    </div>
                    <p class="quickview-description">${description}</p>
                    <button class="btn primary quickview-add" data-id="${id}">Add to Cart</button>
                </div>
            </div>
        `;

        modalBody.querySelector('.quickview-add').addEventListener('click', function() {
            addToCart(card);
            modal.classList.remove('active');
        });

        modal.classList.add('active');
    }

    // Close modal when clicking outside or on close button
    const modal = document.getElementById('quickview-modal');
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => modal.classList.remove('active'));
    }
    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.classList.remove('active');
    });

    function addToCart(card) {
        const id = card.dataset.id;
        const name = card.dataset.name || card.querySelector('.product-title')?.textContent || 'Fruit';
        const price = parseFloat(card.dataset.price) || 0;
        const image = card.querySelector('.card-image img')?.src || '';

        let cart = JSON.parse(localStorage.getItem('frutilabs-cart')) || [];

        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, image, quantity: 1 });
        }

        localStorage.setItem('frutilabs-cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
        showNotification(`${name} added to cart!`, 'success');
    }

    function loadCart() {
        updateCartCount();
        renderCartItems();
    }

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('frutilabs-cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) cartCount.textContent = totalItems;
    }

    function renderCartItems() {
        const cartContainer = document.getElementById('cart-items');
        const cart = JSON.parse(localStorage.getItem('frutilabs-cart')) || [];

        if (!cartContainer) return;

        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Your cart is empty</p>
                    <button class="btn primary continue-shopping">Continue Shopping</button>
                </div>
            `;
            const newContinue = cartContainer.querySelector('.continue-shopping');
            if (newContinue) newContinue.addEventListener('click', closeCartFunc);
        } else {
            let html = '';
            cart.forEach(item => {
                html += `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div class="cart-item-quantity">
                                <button class="decrease-qty" data-id="${item.id}">−</button>
                                <span>${item.quantity}</span>
                                <button class="increase-qty" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove item"><i class="fas fa-trash"></i></button>
                    </div>
                `;
            });
            cartContainer.innerHTML = html;

            cartContainer.querySelectorAll('.decrease-qty').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    updateCartItemQuantity(id, -1);
                });
            });

            cartContainer.querySelectorAll('.increase-qty').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    updateCartItemQuantity(id, 1);
                });
            });

            cartContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    removeCartItem(id);
                });
            });
        }

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalEl = document.getElementById('cart-total');
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    }

    function updateCartItemQuantity(id, delta) {
        let cart = JSON.parse(localStorage.getItem('frutilabs-cart')) || [];
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            const newQty = cart[itemIndex].quantity + delta;
            if (newQty <= 0) {
                cart.splice(itemIndex, 1);
            } else {
                cart[itemIndex].quantity = newQty;
            }
            localStorage.setItem('frutilabs-cart', JSON.stringify(cart));
            updateCartCount();
            renderCartItems();
        }
    }

    function removeCartItem(id) {
        let cart = JSON.parse(localStorage.getItem('frutilabs-cart')) || [];
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('frutilabs-cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }

    function openCart() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('active');
        renderCartItems();
    }

    function closeCartFunc() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
    }
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