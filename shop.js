/**
 * ========== SHOP PAGE FUNCTIONALITY ==========
 * Run only on shop page
 */
if (document.querySelector('.product-grid')) {
    initShop();
}

/**
 * Main shop initialization
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

    let currentProducts = Array.from(products);

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

    // Cart sidebar toggle
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

    /**
     * Filter products based on search, category, price, organic
     */
    function filterProducts() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const category = categoryFilter ? categoryFilter.value : 'all';
        const priceRange = priceFilter ? priceFilter.value : 'all';
        const organicOnly = organicCheckbox ? organicCheckbox.checked : false;

        let visibleCount = 0;

        products.forEach(product => {
            let visible = true;

            // Search by name (or data-name)
            const name = product.dataset.name ? product.dataset.name.toLowerCase() : '';
            if (searchTerm && !name.includes(searchTerm)) {
                visible = false;
            }

            // Category filter
            if (visible && category !== 'all' && product.dataset.category !== category) {
                visible = false;
            }

            // Price filter
            if (visible && priceRange !== 'all') {
                const price = parseFloat(product.dataset.price);
                if (priceRange === '0-5' && (price < 0 || price > 5)) visible = false;
                else if (priceRange === '5-10' && (price < 5 || price > 10)) visible = false;
                else if (priceRange === '10-15' && (price < 10 || price > 15)) visible = false;
                else if (priceRange === '15-20' && (price < 15 || price > 20)) visible = false;
                else if (priceRange === '20+' && price <= 20) visible = false;
            }

            // Organic filter
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

        // After filtering, re-sort if needed
        if (sortSelect && sortSelect.value !== 'default') {
            sortProducts();
        }
    }

    /**
     * Reset all filters to default
     */
    function resetFilters() {
        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = 'all';
        if (priceFilter) priceFilter.value = 'all';
        if (organicCheckbox) organicCheckbox.checked = false;
        filterProducts();
    }

    /**
     * Sort visible products
     */
    function sortProducts() {
        const sortBy = sortSelect.value;
        const grid = document.getElementById('product-grid');
        const visibleProducts = Array.from(products).filter(p => p.style.display !== 'none');

        if (sortBy === 'default') {
            // Restore original order? For now, just reorder by data-id or keep as is
            visibleProducts.sort((a, b) => parseInt(a.dataset.id) - parseInt(b.dataset.id));
        } else if (sortBy === 'price-asc') {
            visibleProducts.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
        } else if (sortBy === 'price-desc') {
            visibleProducts.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
        } else if (sortBy === 'rating') {
            visibleProducts.sort((a, b) => parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating));
        }

        // Reorder DOM
        visibleProducts.forEach(product => grid.appendChild(product));
    }

    /**
     * Open quick view modal
     */
    function openQuickView(card) {
        const modal = document.getElementById('quickview-modal');
        const modalBody = document.getElementById('quickview-body');

        // Extract data
        const id = card.dataset.id;
        const name = card.dataset.name || card.querySelector('.product-title')?.textContent || 'Fruit';
        const price = parseFloat(card.dataset.price) || 0;
        const rating = parseFloat(card.dataset.rating) || 0;
        const origin = card.dataset.origin || 'Unknown';
        const organic = card.dataset.organic === 'true' ? 'Organic' : 'Conventional';
        const image = card.querySelector('.card-image img')?.src || '';
        const description = `Fresh ${name} sourced directly from ${origin}. Perfect for healthy snacking, smoothies, and desserts.`; // Placeholder

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

        // Attach add to cart event to the new button
        modalBody.querySelector('.quickview-add').addEventListener('click', function() {
            addToCart(card);
            modal.classList.remove('active');
        });

        modal.classList.add('active');
    }

    /**
     * Add product to cart
     */
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
            cart.push({
                id: id,
                name: name,
                price: price,
                image: image,
                quantity: 1
            });
        }

        localStorage.setItem('frutilabs-cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
        showNotification(`${name} added to cart!`, 'success');
    }

    /**
     * Load cart from localStorage and update UI
     */
    function loadCart() {
        updateCartCount();
        renderCartItems();
    }

    /**
     * Update cart count badge
     */
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('frutilabs-cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) cartCount.textContent = totalItems;
    }

    /**
     * Render cart items in sidebar
     */
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
            // Re-attach event to new continue button
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

            // Add event listeners for quantity buttons
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

        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalEl = document.getElementById('cart-total');
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    }

    /**
     * Update quantity of a cart item
     */
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

    /**
     * Remove item from cart
     */
    function removeCartItem(id) {
        let cart = JSON.parse(localStorage.getItem('frutilabs-cart')) || [];
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('frutilabs-cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }

    /**
     * Open cart sidebar
     */
    function openCart() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('active');
        renderCartItems(); // Ensure latest items
    }

    /**
     * Close cart sidebar
     */
    function closeCartFunc() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
    }

    // Expose renderCartItems for external calls if needed
    window.renderCartItems = renderCartItems;
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

/**
 * Show notification (reuse from homepage)
 */
function showNotification(message, type = 'info') {
    // Create a simple toast
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

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}