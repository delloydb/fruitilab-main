// Health Page Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Nutrition Tabs
    const tabButtons = document.querySelectorAll('.nutrition-tabs .tab-button');
    const tabContents = document.querySelectorAll('.nutrition-tabs .tab-content');
    
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
    
    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.health-newsletter .newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Here you would typically send the data to a server
                alert('Thank you for subscribing to our health newsletter!');
                emailInput.value = '';
            }
        });
    }
});