// Initialize Yield Chart Filtering
function initYieldChart() {
    const filterBtns = document.querySelectorAll('.chart-filters .filter-btn');
    const yieldItems = document.querySelectorAll('.yield-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Filter items
            yieldItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Initialize Combination Tabs
function initCombinationTabs() {
    const tabBtns = document.querySelectorAll('.combination-tabs .tab-btn');
    const tabPanes = document.querySelectorAll('.combination-content .tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding pane
            const tabId = this.dataset.tab;
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === tabId) {
                    pane.classList.add('active');
                }
            });
        });
    });
}

// Initialize Recipe Generator
function initRecipeGenerator() {
    const recipeDB = {
        energy: [
            {
                name: "Tropical Energy Blast",
                ingredients: ["1 cup pineapple", "1 orange", "1/2 inch ginger", "1/2 cup coconut water"],
                method: "Juice all ingredients except coconut water. Stir in coconut water after juicing.",
                time: "5 mins",
                benefits: "Provides instant energy and hydration"
            },
            // More recipes...
        ],
        detox: [
            // Detox recipes...
        ]
    };
    
    const generateBtn = document.getElementById('generate-btn');
    const resultContainer = document.querySelector('.recipe-result');
    
    generateBtn.addEventListener('click', function() {
        const goal = document.getElementById('goal').value;
        const method = document.getElementById('method').value;
        const selectedFruits = Array.from(document.querySelectorAll('.fruit-option input:checked'))
                               .map(el => el.value);
        
        if (selectedFruits.length === 0) {
            alert("Please select at least one fruit!");
            return;
        }
        
        // In a real app, this would query a database
        // Here we simulate with filtered recipes
        const filteredRecipes = recipeDB[goal].filter(recipe => 
            recipe.ingredients.some(ing => 
                selectedFruits.some(fruit => ing.toLowerCase().includes(fruit))
            )
        );
        
        if (filteredRecipes.length > 0) {
            const recipe = filteredRecipes[0];
            displayRecipe(recipe, method);
        } else {
            resultContainer.innerHTML = `
                <div class="no-recipe">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>No perfect match found! Try adding more fruits or changing your goal.</p>
                    <button class="retry-btn">Try Again</button>
                </div>
            `;
        }
    });
    
    function displayRecipe(recipe, method) {
        resultContainer.innerHTML = `
            <div class="generated-recipe">
                <h3>${recipe.name}</h3>
                <div class="recipe-meta">
                    <span><i class="fas fa-clock"></i> ${recipe.time}</span>
                    <span><i class="fas fa-${method === 'juice' ? 'glass-whiskey' : 'blender'}"></i> 
                    ${method === 'juice' ? 'Juice' : 'Smoothie'}</span>
                </div>
                <div class="recipe-ingredients">
                    <h4>Ingredients:</h4>
                    <ul>
                        ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                </div>
                <div class="recipe-method">
                    <h4>Method:</h4>
                    <p>${recipe.method}</p>
                </div>
                <div class="recipe-benefits">
                    <h4>Benefits:</h4>
                    <p>${recipe.benefits}</p>
                </div>
                <div class="recipe-actions">
                    <button class="save-recipe"><i class="far fa-bookmark"></i> Save</button>
                    <button class="print-recipe"><i class="fas fa-print"></i> Print</button>
                    <button class="share-recipe"><i class="fas fa-share-alt"></i> Share</button>
                </div>
            </div>
        `;
    }
}

// Initialize Accordion
function initAccordion() {
    const accordionBtns = document.querySelectorAll('.accordion-btn');
    
    accordionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
}

// Initialize Video Modal
function initVideoModal() {
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            // In a real app, this would open a modal with the video
            alert("Video player would open in a modal. This is a demo.");
        });
    });
}

// Initialize Community Recipe Filtering
function initCommunityFilters() {
    const filterBtns = document.querySelectorAll('.recipe-filters .filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // In a real app, this would filter recipes
        });
    });
}

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initYieldChart();
    initCombinationTabs();
    initRecipeGenerator();
    initAccordion();
    initVideoModal();
    initCommunityFilters();
    
    // Set first accordion as open by default
    document.querySelector('.accordion-btn').click();
});