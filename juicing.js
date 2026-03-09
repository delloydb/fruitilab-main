/**
 * ========== JUICING PAGE FUNCTIONALITY ==========
 * Run only on juicing page
 */
if (document.querySelector('.juicing-hero')) {
    initJuicing();
}

function initJuicing() {
    initYieldChart();
    initCombinationTabs();
    initRecipeGenerator();
    initAccordion();
    initVideoButtons();
    initDownloadGuide();
}

/**
 * Juice yield chart with filtering
 */
function initYieldChart() {
    const chartContainer = document.getElementById('yield-chart');
    if (!chartContainer) return;

    // Sample fruit yield data
    const fruits = [
        { name: 'Watermelon', yield: 95, category: 'high', icon: '🍉' },
        { name: 'Orange', yield: 85, category: 'high', icon: '🍊' },
        { name: 'Grapefruit', yield: 80, category: 'high', icon: '🍈' },
        { name: 'Pineapple', yield: 70, category: 'medium', icon: '🍍' },
        { name: 'Apple', yield: 65, category: 'medium', icon: '🍎' },
        { name: 'Pear', yield: 60, category: 'medium', icon: '🍐' },
        { name: 'Mango', yield: 55, category: 'medium', icon: '🥭' },
        { name: 'Strawberry', yield: 45, category: 'low', icon: '🍓' },
        { name: 'Banana', yield: 35, category: 'low', icon: '🍌' },
        { name: 'Avocado', yield: 25, category: 'low', icon: '🥑' }
    ];

    function renderChart(filter = 'all') {
        const filtered = filter === 'all' ? fruits : fruits.filter(f => f.category === filter);
        chartContainer.innerHTML = filtered.map(f => `
            <div class="yield-item" data-category="${f.category}">
                <div class="fruit-info">
                    <span style="font-size: 2rem;">${f.icon}</span>
                    <span>${f.name}</span>
                </div>
                <div class="yield-bar">
                    <div class="yield-fill" style="width: ${f.yield}%"></div>
                    <span>${f.yield}% yield</span>
                </div>
            </div>
        `).join('');
    }

    // Filter buttons
    const filterBtns = document.querySelectorAll('.chart-filters .filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderChart(btn.dataset.filter);
        });
    });

    renderChart();
}

/**
 * Combination tabs
 */
function initCombinationTabs() {
    const tabBtns = document.querySelectorAll('.combination-tabs .tab-btn');
    const content = document.getElementById('combination-content');

    if (!content) return;

    // Sample combination data
    const combos = {
        energy: [
            { name: 'Tropical Boost', benefit: 'Instant Energy', ingredients: ['Pineapple', 'Orange', 'Ginger', 'Coconut Water'], desc: 'Pineapple\'s bromelain enhances protein digestion while ginger improves circulation for sustained energy.' },
            { name: 'Citrus Burst', benefit: 'Morning Energy', ingredients: ['Grapefruit', 'Lemon', 'Honey'], desc: 'Citrus fruits provide quick vitamin C and natural sugars for an immediate pick-me-up.' }
        ],
        detox: [
            { name: 'Green Cleanse', benefit: 'Liver Support', ingredients: ['Cucumber', 'Lemon', 'Spinach', 'Green Apple'], desc: 'Leafy greens help flush toxins while lemon supports liver function.' }
        ],
        immunity: [
            { name: 'Immunity Shield', benefit: 'Cold Fighter', ingredients: ['Orange', 'Strawberry', 'Ginger', 'Turmeric'], desc: 'Vitamin C from citrus and berries paired with anti-inflammatory ginger and turmeric.' }
        ],
        weight: [
            { name: 'Slim Down', benefit: 'Metabolism Boost', ingredients: ['Watermelon', 'Lime', 'Mint'], desc: 'Low-calorie watermelon with refreshing mint to curb cravings.' }
        ]
    };

    function renderTab(tabId) {
        const comboList = combos[tabId] || [];
        content.innerHTML = comboList.map(c => `
            <div class="combination-card">
                <div class="combo-header">
                    <h3>${c.name}</h3>
                    <span class="combo-benefit"><i class="fas fa-bolt"></i> ${c.benefit}</span>
                </div>
                <div class="combo-ingredients">
                    ${c.ingredients.map(i => `<span>${i}</span>`).join('')}
                </div>
                <p class="combo-desc">${c.desc}</p>
                <button class="save-recipe"><i class="far fa-bookmark"></i> Save</button>
            </div>
        `).join('');

        // Attach save events
        content.querySelectorAll('.save-recipe').forEach(btn => {
            btn.addEventListener('click', () => {
                showNotification('Recipe saved to your favorites! (demo)', 'success');
            });
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTab(btn.dataset.tab);
        });
    });

    // Render default tab
    renderTab('energy');
}

/**
 * Recipe generator demo
 */
function initRecipeGenerator() {
    const generateBtn = document.getElementById('generate-btn');
    const goalSelect = document.getElementById('goal');
    const methodSelect = document.getElementById('method');
    const resultDiv = document.getElementById('recipe-result');

    if (!generateBtn) return;

    // Sample recipes
    const recipes = {
        energy: {
            juice: {
                name: 'Energizing Citrus Juice',
                ingredients: ['2 oranges', '1 grapefruit', '1 lemon', '1-inch ginger'],
                instructions: 'Juice all ingredients and stir well. Serve over ice.'
            },
            blend: {
                name: 'Tropical Energy Smoothie',
                ingredients: ['1 banana', '1 cup pineapple chunks', '1/2 cup coconut water', '1 tbsp honey'],
                instructions: 'Blend all ingredients until smooth. Enjoy immediately.'
            }
        },
        detox: {
            juice: {
                name: 'Green Detox Juice',
                ingredients: ['1 cucumber', '2 celery stalks', '1 green apple', '1 lemon', 'handful spinach'],
                instructions: 'Juice all ingredients. Drink first thing in morning.'
            },
            blend: {
                name: 'Cleansing Smoothie',
                ingredients: ['1 cup kale', '1 banana', '1 pear', '1 tbsp chia seeds', '1 cup almond milk'],
                instructions: 'Blend until creamy. Great for breakfast.'
            }
        },
        immunity: {
            juice: {
                name: 'Immunity Booster',
                ingredients: ['3 oranges', '1 lemon', '1-inch turmeric root', '1-inch ginger'],
                instructions: 'Juice all ingredients. Drink daily during cold season.'
            },
            blend: {
                name: 'Berry Immunity Smoothie',
                ingredients: ['1 cup mixed berries', '1 banana', '1 cup yogurt', '1 tbsp honey'],
                instructions: 'Blend until smooth. Rich in antioxidants.'
            }
        },
        weight: {
            juice: {
                name: 'Low-Calorie Refresher',
                ingredients: ['2 cups watermelon', '1 lime', 'handful mint'],
                instructions: 'Juice watermelon and lime, stir in mint leaves.'
            },
            blend: {
                name: 'Filling Weight Loss Smoothie',
                ingredients: ['1 cup spinach', '1/2 avocado', '1 green apple', '1 tbsp flaxseed', '1 cup water'],
                instructions: 'Blend until smooth. High fiber keeps you full.'
            }
        }
    };

    generateBtn.addEventListener('click', () => {
        const goal = goalSelect.value;
        const method = methodSelect.value;
        const recipe = recipes[goal][method];

        resultDiv.innerHTML = `
            <div class="recipe-card">
                <h3>${recipe.name}</h3>
                <h4>Ingredients:</h4>
                <ul class="ingredients">
                    ${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}
                </ul>
                <h4>Instructions:</h4>
                <p class="instructions">${recipe.instructions}</p>
                <button class="btn outline save-recipe">Save Recipe</button>
            </div>
        `;

        // Add save event
        resultDiv.querySelector('.save-recipe').addEventListener('click', () => {
            showNotification('Recipe saved! (demo)', 'success');
        });
    });
}

/**
 * Myths accordion
 */
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const btn = item.querySelector('.accordion-btn');
        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            // Close all
            accordionItems.forEach(i => i.classList.remove('active'));
            // Open current if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Video play button demo
 */
function initVideoButtons() {
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Video demo would play here.', 'info');
        });
    });
}

/**
 * Download guide alert (demo)
 */
function initDownloadGuide() {
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            // In real site, file would download
            // For demo, just show notification
            e.preventDefault();
            showNotification('Guide download started! (demo)', 'success');
        });
    }
}