// Shop Page Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Shopping Cart Functionality
    const cart = [];
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const subtotalElement = document.querySelector('.subtotal');
    const totalElement = document.querySelector('.total-price');
    
    // Toggle Cart Sidebar
    function toggleCart() {
        cartSidebar.classList.toggle('open');
        cartOverlay.classList.toggle('show');
        document.body.classList.toggle('no-scroll');
    }
    
    cartBtn.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    
    // Add to Cart Functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const fruitItem = this.closest('.fruit-item');
            const fruitName = fruitItem.querySelector('h3').textContent;
            const fruitPrice = parseFloat(fruitItem.querySelector('.current-price').textContent.replace('$', ''));
            const fruitImage = fruitItem.querySelector('img').src;
            
            // Check if item already exists in cart
            const existingItem = cart.find(item => item.name === fruitName);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: fruitName,
                    price: fruitPrice,
                    image: fruitImage,
                    quantity: 1
                });
            }
            
            updateCart();
            showAddToCartFeedback(this);
        });
    });
    
    // Update Cart UI
    function updateCart() {
        // Clear current cart items
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <img src="../assets/icons/empty-cart.svg" alt="Empty Cart">
                    <p>Your cart is empty</p>
                    <button class="btn primary">Continue Shopping</button>
                </div>
            `;
        } else {
            let subtotal = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <div class="item-price">$${item.price.toFixed(2)}</div>
                        <div class="item-quantity">
                            <button class="quantity-btn minus">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus">+</button>
                        </div>
                    </div>
                    <button class="remove-item"><i class="fas fa-trash"></i></button>
                `;
                
                cartItemsContainer.appendChild(cartItemElement);
                
                // Add event listeners to quantity buttons
                const minusBtn = cartItemElement.querySelector('.minus');
                const plusBtn = cartItemElement.querySelector('.plus');
                const removeBtn = cartItemElement.querySelector('.remove-item');
                
                minusBtn.addEventListener('click', () => {
                    if (item.quantity > 1) {
                        item.quantity -= 1;
                        updateCart();
                    }
                });
                
                plusBtn.addEventListener('click', () => {
                    item.quantity += 1;
                    updateCart();
                });
                
                removeBtn.addEventListener('click', () => {
                    const itemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
                    if (itemIndex !== -1) {
                        cart.splice(itemIndex, 1);
                        updateCart();
                    }
                });
            });
            
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            totalElement.textContent = `$${subtotal.toFixed(2)}`;
        }
        
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Add to Cart Feedback Animation
    function showAddToCartFeedback(button) {
        button.textContent = 'Added!';
        button.classList.add('added');
        
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.classList.remove('added');
        }, 2000);
    }
    
    // Quick View Modal
    const quickViewButtons = document.querySelectorAll('.quick-view');
    const quickViewModal = document.querySelector('.quick-view-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalBody = document.querySelector('.modal-body');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const fruitItem = this.closest('.fruit-item');
            const fruitName = fruitItem.querySelector('h3').textContent;
            const fruitPrice = fruitItem.querySelector('.current-price').textContent;
            const originalPrice = fruitItem.querySelector('.original-price')?.textContent || '';
            const fruitImage = fruitItem.querySelector('img').src;
            const fruitRating = fruitItem.querySelector('.fruit-rating span').textContent;
            const fruitOrigin = fruitItem.querySelector('.fruit-origin span').textContent;
            const isOrganic = fruitItem.querySelector('.organic') !== null;
            
            modalBody.innerHTML = `
                <div class="modal-image">
                    <img src="${fruitImage}" alt="${fruitName}">
                    ${isOrganic ? '<div class="organic-badge">Organic</div>' : ''}
                </div>
                <div class="modal-info">
                    <h3>${fruitName}</h3>
                    <div class="modal-rating">
                        <div class="stars">
                            ${generateStars(parseFloat(fruitRating))}
                            <span>${fruitRating}</span>
                        </div>
                        <div class="origin">
                            <i class="fas fa-globe-americas"></i>
                            <span>${fruitOrigin}</span>
                        </div>
                    </div>
                    <div class="modal-price">
                        <span class="current">${fruitPrice}</span>
                        ${originalPrice ? `<span class="original">${originalPrice}</span>` : ''}
                    </div>
                    <p class="modal-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                    <div class="modal-actions">
                        <div class="quantity-selector">
                            <button class="qty-btn minus">-</button>
                            <span class="qty">1</span>
                            <button class="qty-btn plus">+</button>
                        </div>
                        <button class="btn primary add-to-cart-modal">Add to Cart</button>
                    </div>
                    <div class="modal-shipping">
                        <i class="fas fa-truck"></i>
                        <span>Free shipping on orders over $50</span>
                    </div>
                </div>
            `;
            
            quickViewModal.classList.add('open');
            document.body.classList.add('no-scroll');
            
            // Add event listener to modal add to cart button
            const modalAddToCart = document.querySelector('.add-to-cart-modal');
            modalAddToCart.addEventListener('click', () => {
                const quantity = parseInt(document.querySelector('.qty').textContent);
                
                const existingItem = cart.find(item => item.name === fruitName);
                
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({
                        name: fruitName,
                        price: parseFloat(fruitPrice.replace('$', '')),
                        image: fruitImage,
                        quantity: quantity
                    });
                }
                
                updateCart();
                quickViewModal.classList.remove('open');
                document.body.classList.remove('no-scroll');
                showAddToCartFeedback(modalAddToCart);
            });
            
            // Quantity selector in modal
            const minusBtn = document.querySelector('.qty-btn.minus');
            const plusBtn = document.querySelector('.qty-btn.plus');
            const qtyElement = document.querySelector('.qty');
            
            minusBtn.addEventListener('click', () => {
                let qty = parseInt(qtyElement.textContent);
                if (qty > 1) {
                    qtyElement.textContent = qty - 1;
                }
            });
            
            plusBtn.addEventListener('click', () => {
                let qty = parseInt(qtyElement.textContent);
                qtyElement.textContent = qty + 1;
            });
        });
    });
    
    // Generate star rating HTML
    function generateStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        
        return stars;
    }
    
    // Close Quick View Modal
    closeModal.addEventListener('click', function() {
        quickViewModal.classList.remove('open');
        document.body.classList.remove('no-scroll');
    });
    
    // Filter Functionality
    const filterReset = document.querySelector('.filter-reset');
    const filterSelects = document.querySelectorAll('.filter-group select');
    
    filterReset.addEventListener('click', function() {
        filterSelects.forEach(select => {
            select.value = '';
        });
        filterFruits();
    });
    
    filterSelects.forEach(select => {
        select.addEventListener('change', filterFruits);
    });
    
    function filterFruits() {
        const country = document.getElementById('country').value;
        const fruitType = document.getElementById('fruit-type').value;
        const priceRange = document.getElementById('price-range').value;
        const organic = document.getElementById('organic').value;
        
        const fruitItems = document.querySelectorAll('.fruit-item');
        
        fruitItems.forEach(item => {
            const itemType = item.dataset.type;
            const itemPrice = parseFloat(item.dataset.price);
            const itemOrganic = item.dataset.organic;
            
            let showItem = true;
            
            // Apply filters
            if (fruitType && itemType !== fruitType) {
                showItem = false;
            }
            
            if (priceRange) {
                const [min, max] = priceRange.split('-').map(Number);
                if (max) {
                    if (itemPrice < min || itemPrice > max) showItem = false;
                } else {
                    // Handle "20+" case
                    if (itemPrice < min) showItem = false;
                }
            }
            
            if (organic && itemOrganic !== organic) {
                showItem = false;
            }
            
            // Country filter would require additional data attributes
            
            if (showItem) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Sort Functionality
    const sortSelect = document.getElementById('sort');
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const gridContainer = document.querySelector('.grid-container');
        const fruitItems = Array.from(document.querySelectorAll('.fruit-item'));
        
        fruitItems.sort((a, b) => {
            switch(sortValue) {
                case 'price-low':
                    return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                case 'price-high':
                    return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                case 'rating':
                    return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
                case 'newest':
                    // Assuming newer items have a "new" badge
                    const aIsNew = a.querySelector('.new') !== null;
                    const bIsNew = b.querySelector('.new') !== null;
                    return bIsNew - aIsNew;
                default: // 'popular'
                    return 0; // Default order
            }
        });
        
        // Re-append sorted items
        fruitItems.forEach(item => {
            gridContainer.appendChild(item);
        });
    });
});