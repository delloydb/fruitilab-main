/**
 * ========== SHOP PAGE FUNCTIONALITY ==========
 */

// Wait for DOM to be fully loaded (ensure this runs after the main init)
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize shop features if we're on the shop page
    if (document.querySelector('.shop-filters')) {
        initShopFeatures();
    }
});

/**
 * Initialize all shop-specific features
 */
function initShopFeatures() {
    initSearch();
    initFilters();
    initSort();
    initAddToCart();
    initCartSidebar();
    initQuickView();
    initPagination();
    updateCartCount(); // Load cart from localStorage
}

/**
 * Search functionality
 */
function initSearch() {
    const searchInput = document.querySelector('.shop-search');
    const searchButton = document.querySelector('.shop-filters .search-button');

    if (!searchInput) return;

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        const fruitCards = document.querySelectorAll('.fruit-card');

        fruitCards.forEach(card => {
            const name = card.dataset.name?.toLowerCase() || '';
            if (name.includes(query) || query === '') {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    searchInput.addEventListener('input', debounce(performSearch, 300));
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
}

/**
 * Filter functionality (type, price, organic)
 */
function initFilters() {
    const typeSelect = document.getElementById('fruit-type');
    const priceSelect = document.getElementById('price-range');
    const organicSelect = document.getElementById('organic');
    const resetBtn = document.querySelector('.filter-reset');

    function applyFilters() {
        const type = typeSelect?.value || '';
        const priceRange = priceSelect?.value || '';
        const organic = organicSelect?.value || '';

        const fruitCards = document.querySelectorAll('.fruit-card');

        fruitCards.forEach(card => {
            let show = true;

            // Type filter
            if (type && card.dataset.type !== type) {
                show = false;
            }

            // Organic filter
            if (organic) {
                const isOrganic = card.dataset.organic === 'yes';
                if (organic === 'yes' && !isOrganic) show = false;
                if (organic === 'no' && isOrganic) show = false;
            }

            // Price range filter
            if (priceRange) {
                const price = parseFloat(card.dataset.price);
                if (priceRange === '0-5' && (price < 0 || price > 5)) show = false;
                else if (priceRange === '5-10' && (price < 5 || price > 10)) show = false;
                else if (priceRange === '10-20' && (price < 10 || price > 20)) show = false;
                else if (priceRange === '20+' && price <= 20) show = false;
            }

            card.style.display = show ? '' : 'none';
        });
    }

    if (typeSelect) typeSelect.addEventListener('change', applyFilters);
    if (priceSelect) priceSelect.addEventListener('change', applyFilters);
    if (organicSelect) organicSelect.addEventListener('change', applyFilters);

    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (typeSelect) typeSelect.value = '';
            if (priceSelect) priceSelect.value = '';
            if (organicSelect) organicSelect.value = '';
            applyFilters();
            
            // Also clear search
            const searchInput = document.querySelector('.shop-search');
            if (searchInput) {
                searchInput.value = '';
                // Trigger search filter (which resets visibility)
                const event = new Event('input');
                searchInput.dispatchEvent(event);
            }
        });
    }
}

/**
 * Sorting functionality
 */
function initSort() {
    const sortSelect = document.getElementById('sort');
    const fruitGrid = document.getElementById('fruit-grid');

    if (!sortSelect || !fruitGrid) return;

    sortSelect.addEventListener('change', function() {
        const sortBy = this.value;
        const fruitCards = Array.from(document.querySelectorAll('.fruit-card'));

        // Filter out hidden cards (if any) before sorting
        const visibleCards = fruitCards.filter(card => card.style.display !== 'none');

        // Sort based on selected option
        visibleCards.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                case 'price-high':
                    return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                case 'rating':
                    return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
                case 'popular':
                default:
                    // Keep original order (by data attribute maybe)
                    return 0;
            }
        });

        // Reorder DOM
        visibleCards.forEach(card => fruitGrid.appendChild(card));
    });
}

/**
 * Add to Cart functionality
 */
let cart = [];

function initAddToCart() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('frutilabs-cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
        }
    }

    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const fruitCard = this.closest('.fruit-card');
            if (!fruitCard) return;

            const id = this.dataset.id || Date.now().toString(); // Use data-id if available
            const name = fruitCard.querySelector('h3')?.textContent || 'Fruit';
            const price = parseFloat(fruitCard.dataset.price) || 0;
            const image = fruitCard.querySelector('.card-image img')?.src || '';

            // Check if item already in cart
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

            saveCart();
            updateCartCount();
            showNotification(`${name} added to cart!`, 'success');
        });
    });
}

function saveCart() {
    localStorage.setItem('frutilabs-cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

/**
 * Cart Sidebar
 */
function initCartSidebar() {
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const continueShopping = document.querySelector('.continue-shopping');

    function openCart() {
        if (cartSidebar) cartSidebar.classList.add('open');
        if (cartOverlay) cartOverlay.classList.add('active');
        renderCartItems();
    }

    function closeCartFunc() {
        if (cartSidebar) cartSidebar.classList.remove('open');
        if (cartOverlay) cartOverlay.classList.remove('active');
    }

    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }

    if (closeCart) {
        closeCart.addEventListener('click', closeCartFunc);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartFunc);
    }

    if (continueShopping) {
        continueShopping.addEventListener('click', closeCartFunc);
    }

    // Render cart items function
    function renderCartItems() {
        const cartItemsContainer = document.querySelector('.cart-items');
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <img src="../assets/icons/empty-cart.svg" alt="Empty Cart">
                    <p>Your cart is empty</p>
                    <button class="btn primary continue-shopping">Continue Shopping</button>
                </div>
            `;
            // Re-attach event listener to new continue button
            const newContinue = cartItemsContainer.querySelector('.continue-shopping');
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
                                <button class="decrease-qty">-</button>
                                <span>${item.quantity}</span>
                                <button class="increase-qty">+</button>
                            </div>
                        </div>
                        <button class="cart-item-remove" aria-label="Remove item"><i class="fas fa-trash"></i></button>
                    </div>
                `;
            });
            cartItemsContainer.innerHTML = html;

            // Attach event listeners for quantity changes and remove
            cartItemsContainer.querySelectorAll('.decrease-qty').forEach(btn => {
                btn.addEventListener('click', function() {
                    const cartItem = this.closest('.cart-item');
                    const id = cartItem.dataset.id;
                    const item = cart.find(i => i.id === id);
                    if (item) {
                        if (item.quantity > 1) {
                            item.quantity -= 1;
                        } else {
                            cart = cart.filter(i => i.id !== id);
                        }
                        saveCart();
                        updateCartCount();
                        renderCartItems(); // re-render
                    }
                });
            });

            cartItemsContainer.querySelectorAll('.increase-qty').forEach(btn => {
                btn.addEventListener('click', function() {
                    const cartItem = this.closest('.cart-item');
                    const id = cartItem.dataset.id;
                    const item = cart.find(i => i.id === id);
                    if (item) {
                        item.quantity += 1;
                        saveCart();
                        updateCartCount();
                        renderCartItems();
                    }
                });
            });

            cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', function() {
                    const cartItem = this.closest('.cart-item');
                    const id = cartItem.dataset.id;
                    cart = cart.filter(i => i.id !== id);
                    saveCart();
                    updateCartCount();
                    renderCartItems();
                });
            });
        }

        // Update summary
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const subtotalEl = document.querySelector('.subtotal');
        const totalEl = document.querySelector('.total-price');
        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`; // Assuming free shipping for demo
    }

    // Initial render if cart opens
    // Also expose renderCartItems to be called from other functions
    window.renderCartItems = renderCartItems; // For quick view add
}

/**
 * Quick View Modal
 */
function initQuickView() {
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const modal = document.getElementById('quick-view-modal');
    const closeModal = document.querySelector('.close-modal');

    if (!modal) return;

    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const fruitCard = this.closest('.fruit-card');
            if (!fruitCard) return;

            // Extract data
            const name = fruitCard.querySelector('h3')?.textContent || 'Fruit';
            const price = fruitCard.dataset.price || '0';
            const rating = fruitCard.dataset.rating || '0';
            const origin = fruitCard.dataset.origin || 'Unknown';
            const organic = fruitCard.dataset.organic === 'yes' ? 'Organic' : 'Conventional';
            const image = fruitCard.querySelector('.card-image img')?.src || '';
            const description = `Fresh ${name} sourced directly from ${origin}. Perfect for healthy snacking and recipes.`; // Placeholder

            const modalBody = modal.querySelector('.modal-body');
            if (modalBody) {
                modalBody.innerHTML = `
                    <div class="quick-view-product">
                        <img src="${image}" alt="${name}" loading="lazy">
                        <div class="quick-view-details">
                            <h3>${name}</h3>
                            <div class="price">$${parseFloat(price).toFixed(2)}</div>
                            <div class="rating">
                                ${generateStarRating(rating)}
                                <span>${rating}</span>
                            </div>
                            <div class="meta">
                                <p><i class="fas fa-globe-americas"></i> Origin: ${origin}</p>
                                <p><i class="fas fa-leaf"></i> ${organic}</p>
                            </div>
                            <p class="description">${description}</p>
                            <button class="btn primary add-to-cart" data-id="${fruitCard.querySelector('.add-to-cart')?.dataset?.id || ''}">Add to Cart</button>
                        </div>
                    </div>
                `;

                // Re-attach add to cart event for the modal button
                const modalAddBtn = modalBody.querySelector('.add-to-cart');
                if (modalAddBtn) {
                    modalAddBtn.addEventListener('click', function() {
                        // Trigger same add to cart logic
                        const originalBtn = fruitCard.querySelector('.add-to-cart');
                        if (originalBtn) {
                            originalBtn.click();
                        }
                        // Optionally close modal
                        modal.classList.remove('active');
                    });
                }
            }

            modal.classList.add('active');
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Helper to generate star rating HTML
function generateStarRating(rating) {
    const num = parseFloat(rating);
    const fullStars = Math.floor(num);
    const halfStar = num % 1 >= 0.5;
    let html = '';
    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="far fa-star"></i>';
    }
    return html;
}

/**
 * Pagination (demo: just console log)
 */
function initPagination() {
    const pageBtns = document.querySelectorAll('.page-btn:not(.next)');
    const nextBtn = document.querySelector('.page-btn.next');

    pageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            pageBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // In a real site, you'd load new page content
            showNotification(`Page ${this.textContent} clicked (demo)`, 'info');
        });
    });

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            showNotification('Next page (demo)', 'info');
        });
    }
}

/**
 * Debounce helper
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}