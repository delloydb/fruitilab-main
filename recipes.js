// Recipe Page Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Recipe Filtering
    const filterButtons = document.querySelectorAll('.filter-button');
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter recipes
            recipeCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Recipe Modal
    const recipeModal = document.querySelector('.recipe-modal');
    const recipeLinks = document.querySelectorAll('.recipe-card .btn');
    
    recipeLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const recipeCard = this.closest('.recipe-card');
            const recipeTitle = recipeCard.querySelector('h3').textContent;
            const recipeCategory = recipeCard.querySelector('.recipe-category').textContent;
            const recipeImage = recipeCard.querySelector('img').src;
            const recipeMeta = recipeCard.querySelector('.recipe-meta').innerHTML;
            const recipeIngredients = recipeCard.querySelector('.recipe-ingredients').innerHTML;
            
            // Populate modal
            const modalBody = document.querySelector('.recipe-modal .modal-body');
            modalBody.innerHTML = `
                <div class="recipe-header">
                    <span class="recipe-category">${recipeCategory}</span>
                    <h2>${recipeTitle}</h2>
                    <div class="recipe-meta">${recipeMeta}</div>
                </div>
                
                <div class="recipe-content">
                    <div class="recipe-image">
                        <img src="${recipeImage}" alt="${recipeTitle}">
                    </div>
                    
                    <div class="recipe-details">
                        <div class="ingredients">
                            <h3>Ingredients</h3>
                            ${recipeIngredients}
                        </div>
                        
                        <div class="instructions">
                            <h3>Instructions</h3>
                            <ol>
                                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                                <li>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                                <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</li>
                                <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</li>
                            </ol>
                        </div>
                    </div>
                </div>
                
                <div class="recipe-tips">
                    <h3>Tips & Variations</h3>
                    <ul>
                        <li>For a vegan version, substitute honey with maple syrup.</li>
                        <li>Add a scoop of protein powder for extra nutrition.</li>
                        <li>Try freezing the smoothie for a refreshing popsicle alternative.</li>
                    </ul>
                </div>
                
                <div class="recipe-actions">
                    <button class="btn primary print-recipe"><i class="fas fa-print"></i> Print Recipe</button>
                    <button class="btn outline save-recipe"><i class="fas fa-bookmark"></i> Save Recipe</button>
                </div>
            `;
            
            // Show modal
            recipeModal.classList.add('open');
            document.body.classList.add('no-scroll');
            
            // Add event listeners to modal buttons
            document.querySelector('.print-recipe').addEventListener('click', function() {
                window.print();
            });
            
            document.querySelector('.save-recipe').addEventListener('click', function() {
                alert('Recipe saved to your favorites!');
            });
        });
    });
    
    // Close modal
    document.querySelector('.recipe-modal .close-modal').addEventListener('click', function() {
        recipeModal.classList.remove('open');
        document.body.classList.remove('no-scroll');
    });
    
    // Play buttons for recipe videos
    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('This would play a recipe video in a modal or new page.');
        });
    });
});