// Agriculture Page Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Farmer Stories Carousel
    const farmerCards = document.querySelectorAll('.farmer-card');
    const farmerIndicators = document.querySelectorAll('.carousel-indicators .indicator');
    let currentFarmer = 0;
    const farmerInterval = 8000; // 8 seconds
    
    function showFarmer(index) {
        farmerCards.forEach(card => card.classList.remove('active'));
        farmerIndicators.forEach(indicator => indicator.classList.remove('active'));
        
        farmerCards[index].classList.add('active');
        farmerIndicators[index].classList.add('active');
        currentFarmer = index;
    }
    
    function nextFarmer() {
        let nextIndex = (currentFarmer + 1) % farmerCards.length;
        showFarmer(nextIndex);
    }
    
    // Set up automatic sliding
    let farmerTimer = setInterval(nextFarmer, farmerInterval);
    
    // Pause on hover
    const farmersContainer = document.querySelector('.farmers-carousel');
    farmersContainer.addEventListener('mouseenter', () => {
        clearInterval(farmerTimer);
    });
    
    farmersContainer.addEventListener('mouseleave', () => {
        farmerTimer = setInterval(nextFarmer, farmerInterval);
    });
    
    // Manual navigation with indicators
    farmerIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            clearInterval(farmerTimer);
            showFarmer(index);
            farmerTimer = setInterval(nextFarmer, farmerInterval);
        });
    });
    
    // Investment Tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Video Play Button
    const playButton = document.querySelector('.play-button');
    if (playButton) {
        playButton.addEventListener('click', function() {
            // In a real implementation, this would launch a video player
            alert('This would play the documentary video in a modal or new page.');
        });
    }
    
    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.agriculture-newsletter .newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Here you would typically send the data to a server
                alert('Thank you for subscribing to our Agriculture Report!');
                this.reset();
            }
        });
    }
});