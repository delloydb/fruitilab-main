// Initialize Accessibility Features
function initAccessibility() {
    // Font Size Adjustment
    const html = document.documentElement;
    let fontSize = 16; // Default
    
    document.getElementById('font-increase').addEventListener('click', () => {
        fontSize = Math.min(fontSize + 2, 24);
        html.style.fontSize = `${fontSize}px`;
    });
    
    document.getElementById('font-decrease').addEventListener('click', () => {
        fontSize = Math.max(fontSize - 2, 12);
        html.style.fontSize = `${fontSize}px`;
    });
    
    // High Contrast Mode
    document.getElementById('high-contrast').addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
    });
    
    // Dark Mode Toggle
    document.getElementById('dark-mode-toggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = document.querySelector('#dark-mode-toggle i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });
    
    // Language Selector (simulated)
    document.getElementById('language-select').addEventListener('change', (e) => {
        alert(`Language changed to ${e.target.options[e.target.selectedIndex].text}`);
    });
}

// Initialize Live Chat
function initLiveChat() {
    const chatBtn = document.querySelector('.live-chat-btn');
    
    chatBtn.addEventListener('click', () => {
        // In a real implementation, this would open a chat widget
        const chatWindow = window.open('', 'Live Chat', 'width=400,height=600');
        chatWindow.document.write(`
            <html>
                <head>
                    <title>Fruitful Live Chat</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .chat-header { background: ${getComputedStyle(document.documentElement).getPropertyValue('--primary-color')}; 
                                      color: white; padding: 15px; border-radius: 8px 8px 0 0; }
                        .chat-messages { height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; }
                        .chat-input { display: flex; margin-top: 10px; }
                        .chat-input input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px 0 0 4px; }
                        .chat-input button { background: ${getComputedStyle(document.documentElement).getPropertyValue('--secondary-color')}; 
                                            color: white; border: none; padding: 0 15px; border-radius: 0 4px 4px 0; }
                    </style>
                </head>
                <body>
                    <div class="chat-header">
                        <h2>Fruitful Support</h2>
                        <p>We're here to help!</p>
                    </div>
                    <div class="chat-messages">
                        <p><strong>Support Agent:</strong> Hello! How can we help you today?</p>
                    </div>
                    <div class="chat-input">
                        <input type="text" placeholder="Type your message...">
                        <button>Send</button>
                    </div>
                </body>
            </html>
        `);
    });
}

// Initialize Comment System
function initComments() {
    const commentForm = document.querySelector('.comment-form');
    
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const textarea = this.querySelector('textarea');
            if (textarea.value.trim() === '') return;
            
            // In a real app, this would send to a server
            alert('Comment submitted! (This is a demo)');
            textarea.value = '';
        });
    }
    
    // Like buttons
    document.querySelectorAll('.like-comment').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            const count = parseInt(this.textContent.match(/\d+/) || 0);
            
            if (icon.classList.contains('far')) {
                icon.classList.replace('far', 'fas');
                this.innerHTML = `<i class="fas fa-thumbs-up"></i> ${count + 1}`;
            } else {
                icon.classList.replace('fas', 'far');
                this.innerHTML = `<i class="far fa-thumbs-up"></i> ${count - 1}`;
            }
        });
    });
}

// Initialize Contributor Form
function initContributorForm() {
    const contributeBtn = document.querySelector('.contribute-btn');
    
    if (contributeBtn) {
        contributeBtn.addEventListener('click', () => {
            // In a real implementation, this would open a form
            alert('Thank you for your interest in contributing! Our team will contact you.');
        });
    }
}

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initAccessibility();
    initLiveChat();
    initComments();
    initContributorForm();
    
    // Set dark mode preference if saved
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        document.querySelector('#dark-mode-toggle i').classList.replace('fa-moon', 'fa-sun');
    }
    
    // Save dark mode preference
    document.getElementById('dark-mode-toggle').addEventListener('click', function() {
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });
});