// Encyclopedia Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Fun Facts Carousel
    const factCards = document.querySelectorAll('.fact-card');
    const factIndicators = document.querySelectorAll('.fact-indicators .indicator');
    let currentFact = 0;
    const factInterval = 5000; // 5 seconds
    
    function showFact(index) {
        factCards.forEach(card => card.classList.remove('active'));
        factIndicators.forEach(indicator => indicator.classList.remove('active'));
        
        factCards[index].classList.add('active');
        factIndicators[index].classList.add('active');
        currentFact = index;
    }
    
    function nextFact() {
        let nextIndex = (currentFact + 1) % factCards.length;
        showFact(nextIndex);
    }
    
    // Set up automatic sliding
    let factTimer = setInterval(nextFact, factInterval);
    
    // Pause on hover
    const factsContainer = document.querySelector('.facts-carousel');
    factsContainer.addEventListener('mouseenter', () => {
        clearInterval(factTimer);
    });
    
    factsContainer.addEventListener('mouseleave', () => {
        factTimer = setInterval(nextFact, factInterval);
    });
    
    // Manual navigation with indicators
    factIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            clearInterval(factTimer);
            showFact(index);
            factTimer = setInterval(nextFact, factInterval);
        });
    });
    
    // Seasonal Calendar
    const calendarYear = document.querySelector('.calendar-year');
    const monthsGrid = document.querySelector('.months-grid');
    const prevYearBtn = document.querySelector('.prev-year');
    const nextYearBtn = document.querySelector('.next-year');
    const regionSelect = document.getElementById('calendar-region');
    
    let currentYear = new Date().getFullYear();
    calendarYear.textContent = currentYear;
    
    // Sample seasonal data (in a real app, this would come from an API)
    const seasonalData = {
        'north-america': {
            fruits: [
                { name: 'Apples', color: '#E53935', months: [8, 9, 10] },
                { name: 'Blueberries', color: '#3949AB', months: [5, 6, 7, 8] },
                { name: 'Cherries', color: '#D81B60', months: [5, 6, 7] },
                { name: 'Peaches', color: '#FB8C00', months: [5, 6, 7, 8] },
                { name: 'Strawberries', color: '#C2185B', months: [3, 4, 5, 6, 7] },
                { name: 'Watermelons', color: '#43A047', months: [6, 7, 8, 9] }
            ]
        },
        'south-america': {
            fruits: [
                { name: 'Avocados', color: '#689F38', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
                { name: 'Bananas', color: '#FDD835', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
                { name: 'Mangoes', color: '#FF9800', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
                { name: 'Pineapples', color: '#4CAF50', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }
            ]
        },
        // Other regions would be added similarly
    };
    
    // Initialize calendar
    function initCalendar() {
        const region = regionSelect.value;
        const data = seasonalData[region] || seasonalData['north-america'];
        
        // Clear existing months
        monthsGrid.innerHTML = '';
        
        // Create month cards
        for (let month = 0; month < 12; month++) {
            const monthCard = document.createElement('div');
            monthCard.className = 'month-card';
            
            const monthName = document.createElement('h4');
            monthName.className = 'month-name';
            monthName.textContent = new Date(currentYear, month, 1).toLocaleString('default', { month: 'long' });
            
            const fruitList = document.createElement('ul');
            fruitList.className = 'fruit-list';
            
            // Add fruits available in this month
            data.fruits.forEach(fruit => {
                if (fruit.months.includes(month)) {
                    const fruitItem = document.createElement('li');
                    
                    const fruitColor = document.createElement('span');
                    fruitColor.className = 'fruit-color';
                    fruitColor.style.backgroundColor = fruit.color;
                    
                    const fruitName = document.createTextNode(fruit.name);
                    
                    fruitItem.appendChild(fruitColor);
                    fruitItem.appendChild(fruitName);
                    fruitList.appendChild(fruitItem);
                }
            });
            
            monthCard.appendChild(monthName);
            monthCard.appendChild(fruitList);
            monthsGrid.appendChild(monthCard);
        }
        
        // Update legend
        const legendContainer = document.querySelector('.fruit-legend');
        legendContainer.innerHTML = '';
        
        data.fruits.forEach(fruit => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            
            const fruitColor = document.createElement('span');
            fruitColor.className = 'fruit-color';
            fruitColor.style.backgroundColor = fruit.color;
            
            const fruitName = document.createTextNode(fruit.name);
            
            legendItem.appendChild(fruitColor);
            legendItem.appendChild(fruitName);
            legendContainer.appendChild(legendItem);
        });
    }
    
    // Year navigation
    prevYearBtn.addEventListener('click', function() {
        currentYear--;
        calendarYear.textContent = currentYear;
        initCalendar();
    });
    
    nextYearBtn.addEventListener('click', function() {
        currentYear++;
        calendarYear.textContent = currentYear;
        initCalendar();
    });
    
    // Region change
    regionSelect.addEventListener('change', initCalendar);
    
    // Initialize the calendar
    initCalendar();
    
    // Fruit Modal (for quick view)
    const fruitModal = document.querySelector('.fruit-modal');
    const fruitCards = document.querySelectorAll('.fruit-card');
    
    fruitCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't open modal if clicking on the "Learn More" button
            if (e.target.closest('.btn')) return;
            
            const fruitName = this.querySelector('h3').textContent;
            loadFruitModal(fruitName);
        });
    });
    
    function loadFruitModal(fruitName) {
        // In a real app, this would fetch data from an API
        // For now, we'll use sample data
        const fruitData = {
            'Mango': {
                scientificName: 'Mangifera indica',
                origin: 'South Asia',
                images: ['../assets/images/mango.jpg', '../assets/images/mango-2.jpg', '../assets/images/mango-3.jpg'],
                description: 'The mango is a tropical stone fruit known for its sweet, juicy flesh and distinctive flavor. It is native to South Asia and has been cultivated for over 4,000 years.',
                growingConditions: {
                    climate: 'Tropical and subtropical',
                    temperature: '24-27°C (75-81°F)',
                    rainfall: '750-2,500 mm annually',
                    soil: 'Well-drained, fertile soil with pH 5.5-7.5'
                },
                nutrition: {
                    calories: 60,
                    carbs: 15,
                    fiber: 1.6,
                    vitaminC: 67,
                    vitaminA: 25,
                    folate: 7
                },
                funFact: 'Mangoes are related to cashews and pistachios, all members of the Anacardiaceae family.'
            },
            'Dragon Fruit': {
                scientificName: 'Hylocereus undatus',
                origin: 'Central America',
                images: ['../assets/images/dragonfruit.jpg', '../assets/images/dragonfruit-2.jpg', '../assets/images/dragonfruit-3.jpg'],
                description: 'Dragon fruit, also known as pitaya, is a vibrant tropical fruit with a unique appearance and mild, sweet flavor. It grows on cactus species native to Central America.',
                growingConditions: {
                    climate: 'Tropical and subtropical',
                    temperature: '21-29°C (70-85°F)',
                    rainfall: '600-1,300 mm annually',
                    soil: 'Well-drained, sandy soil with pH 6-7'
                },
                nutrition: {
                    calories: 60,
                    carbs: 13,
                    fiber: 3,
                    vitaminC: 3,
                    iron: 4,
                    magnesium: 10
                },
                funFact: 'Dragon fruit flowers only bloom at night and usually last just one night, pollinated by bats or moths.'
            }
            // Other fruits would be added similarly
        };
        
        const data = fruitData[fruitName] || fruitData['Mango'];
        
        // Populate modal with data
        const modalBody = document.querySelector('.fruit-modal .modal-body');
        modalBody.innerHTML = `
            <div class="fruit-gallery">
                <div class="main-image">
                    <img src="${data.images[0]}" alt="${fruitName}">
                </div>
                <div class="thumbnail-container">
                    ${data.images.map(img => `
                        <div class="thumbnail">
                            <img src="${img}" alt="${fruitName}">
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="fruit-info">
                <h2>${fruitName}</h2>
                <p class="scientific-name">${data.scientificName}</p>
                <p class="origin"><i class="fas fa-globe-americas"></i> Native to ${data.origin}</p>
                
                <p>${data.description}</p>
                
                <h3 class="section-title">Growing Conditions</h3>
                <div class="growing-conditions">
                    <div class="condition-card">
                        <div class="condition-icon">
                            <i class="fas fa-cloud-sun"></i>
                        </div>
                        <div>
                            <h4>Climate</h4>
                            <p>${data.growingConditions.climate}</p>
                        </div>
                    </div>
                    <div class="condition-card">
                        <div class="condition-icon">
                            <i class="fas fa-temperature-high"></i>
                        </div>
                        <div>
                            <h4>Temperature</h4>
                            <p>${data.growingConditions.temperature}</p>
                        </div>
                    </div>
                    <div class="condition-card">
                        <div class="condition-icon">
                            <i class="fas fa-cloud-rain"></i>
                        </div>
                        <div>
                            <h4>Rainfall</h4>
                            <p>${data.growingConditions.rainfall}</p>
                        </div>
                    </div>
                    <div class="condition-card">
                        <div class="condition-icon">
                            <i class="fas fa-seedling"></i>
                        </div>
                        <div>
                            <h4>Soil</h4>
                            <p>${data.growingConditions.soil}</p>
                        </div>
                    </div>
                </div>
                
                <h3 class="section-title">Nutritional Facts (per 100g)</h3>
                <div class="nutrition-chart" id="nutrition-chart"></div>
                
                <h3 class="section-title">Fun Fact</h3>
                <div class="fun-fact">
                    <i class="fas fa-lightbulb"></i>
                    <p>${data.funFact}</p>
                </div>
                
                <a href="../shop/" class="btn primary buy-btn">Where to Buy</a>
            </div>
        `;
        
        // Initialize thumbnail click events
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.querySelector('.main-image img');
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').src;
                mainImage.src = imgSrc;
                
                thumbnails.forEach(t => t.style.borderColor = 'transparent');
                this.style.borderColor = 'var(--primary-color)';
            });
        });
        
        // Initialize chart (using Chart.js in a real implementation)
        // This is a placeholder - in a real app you would use a charting library
        const chartContainer = document.getElementById('nutrition-chart');
        chartContainer.innerHTML = `
            <div class="nutrition-bar" style="width: ${data.nutrition.carbs * 2}px; background-color: #FF7D33;">
                <span>Carbs: ${data.nutrition.carbs}g</span>
            </div>
            <div class="nutrition-bar" style="width: ${data.nutrition.fiber * 10}px; background-color: #4CAF50;">
                <span>Fiber: ${data.nutrition.fiber}g</span>
            </div>
            <div class="nutrition-bar" style="width: ${data.nutrition.vitaminC}px; background-color: #2196F3;">
                <span>Vitamin C: ${data.nutrition.vitaminC}% DV</span>
            </div>
        `;
        
        // Show modal
        fruitModal.classList.add('open');
        document.body.classList.add('no-scroll');
    }
    
    // Close modal
    document.querySelector('.fruit-modal .close-modal').addEventListener('click', function() {
        fruitModal.classList.remove('open');
        document.body.classList.remove('no-scroll');
    });
});