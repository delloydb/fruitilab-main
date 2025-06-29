// Initialize World Map
function initMap() {
    const map = L.map('world-map').setView([20, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers for capital cities
    const capitals = [
        { city: "New York", latlng: [40.7128, -74.0060] },
        { city: "London", latlng: [51.5074, -0.1278] },
        { city: "Tokyo", latlng: [35.6762, 139.6503] },
        // Add more capitals...
    ];

    capitals.forEach(capital => {
        L.marker(capital.latlng)
            .addTo(map)
            .bindPopup(`<b>${capital.city}</b><br>Fruitful Store`);
    });

    // Update location counter
    document.getElementById('location-count').textContent = capitals.length;
}

// Live Chat Functionality
function initLiveChat() {
    const chatBtn = document.querySelector('.chat-btn');
    
    chatBtn.addEventListener('click', function(e) {
        e.preventDefault();
        alert("Our live chat support will open in a new window. Agents are available 24/7!");
        // In real implementation: window.open('chat.html', '_blank');
    });
}

// Form Submission
function handleFormSubmission() {
    const contactForm = document.querySelector('.contact-form');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert("Thank you for your message! We'll respond within 24 hours.");
            this.reset();
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert("Thanks for subscribing to our newsletter!");
            this.reset();
        });
    }
}

// Team Member Hover Effects
function initTeamHover() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.querySelector('.social-links').style.opacity = '1';
        });
        
        member.addEventListener('mouseleave', function() {
            this.querySelector('.social-links').style.opacity = '0';
        });
    });
}

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    initLiveChat();
    handleFormSubmission();
    initTeamHover();
});