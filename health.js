/**
 * ========== HEALTH PAGE FUNCTIONALITY ==========
 * Run only on health page
 */
if (document.querySelector('.health-hero')) {
    initHealth();
}

function initHealth() {
    initNutritionTabs();
    initRecipeFilters();
    initRecipeModal();
    initHealthNewsletter();
}

/**
 * Nutrition tabs (Vitamins, Minerals, Antioxidants)
 */
function initNutritionTabs() {
    const tabButtons = document.querySelectorAll('.nutrition-tabs .tab-button');
    const tabContents = document.querySelectorAll('.nutrition-tabs .tab-content');

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
 * Recipe filtering by category
 */
function initRecipeFilters() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const recipeCards = document.querySelectorAll('.recipe-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter recipes
            recipeCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Recipe modal (demo)
 */
function initRecipeModal() {
    const modal = document.getElementById('recipe-modal');
    const modalBody = document.getElementById('recipe-modal-body');
    const closeBtn = document.querySelector('.recipe-modal .close-modal');

    if (!modal || !modalBody) return;

    // Sample recipe data (in real app, could be fetched)
    const recipeData = {
        'Berry Blast Smoothie': {
            name: 'Berry Blast Smoothie',
            category: 'Smoothie',
            time: '5 min',
            servings: '1 serving',
            ingredients: ['Mixed berries', 'Banana', 'Spinach', 'Almond milk'],
            instructions: 'Combine all ingredients in a blender and blend until smooth. Enjoy immediately.',
            image: 'assets/images/berry-smoothie.jpg',
        },
        // Add other recipes as needed
    };

    document.querySelectorAll('.recipe-card .btn.outline').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const recipeCard = btn.closest('.recipe-card');
            const title = recipeCard.querySelector('h3').textContent;
            const data = recipeData[title] || {
                name: title,
                category: recipeCard.querySelector('.recipe-category').textContent,
                time: recipeCard.querySelector('.recipe-meta span:first-child').textContent,
                servings: recipeCard.querySelector('.recipe-meta span:last-child').textContent,
                ingredients: Array.from(recipeCard.querySelectorAll('.recipe-ingredients li')).map(li => li.textContent),
                instructions: 'Full recipe details would appear here. This is a demo modal.',
                image: recipeCard.querySelector('.recipe-image img').src,
            };

            modalBody.innerHTML = `
                <div class="quickview-product">
                    <img src="${data.image}" alt="${data.name}" loading="lazy">
                    <div class="quickview-details">
                        <h3>${data.name}</h3>
                        <p class="recipe-category">${data.category}</p>
                        <div class="recipe-meta">
                            <span><i class="fas fa-clock"></i> ${data.time}</span>
                            <span><i class="fas fa-utensils"></i> ${data.servings}</span>
                        </div>
                        <h4>Ingredients</h4>
                        <ul class="ingredients-list">
                            ${data.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                        </ul>
                        <h4>Instructions</h4>
                        <p>${data.instructions}</p>
                    </div>
                </div>
            `;

            modal.classList.add('active');
        });
    });

    // Play button demo
    document.querySelectorAll('.recipe-card .play-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Video demo would play here.', 'info');
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
}

/**
 * Health newsletter form validation
 */
function initHealthNewsletter() {
    const form = document.getElementById('health-newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('health-email').value.trim();

        if (!email) {
            showNotification('Please enter your email address.', 'error');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        showNotification('Thank you for subscribing to health tips! (demo)', 'success');
        form.reset();
    });
}