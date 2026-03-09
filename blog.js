/**
 * ========== BLOG PAGE FUNCTIONALITY ==========
 * Run only on blog page
 */
if (document.querySelector('.blog-hero')) {
    initBlog();
}

function initBlog() {
    initAccessibilityToolbar();
    initCommentForm();
    initLikeButtons();
    initReplyButtons();
    initLiveChat();
    initNewsletterForm();
    initLanguageSwitcher();
}

/**
 * Accessibility toolbar: font size, contrast, dark mode
 */
function initAccessibilityToolbar() {
    const increaseBtn = document.getElementById('font-increase');
    const decreaseBtn = document.getElementById('font-decrease');
    const contrastBtn = document.getElementById('high-contrast');
    const darkModeBtn = document.getElementById('dark-mode-toggle');
    const html = document.documentElement;
    
    // Font size scaling (1rem = 16px default)
    let currentScale = 1;
    const minScale = 0.8;
    const maxScale = 1.4;

    function setFontScale(scale) {
        html.style.fontSize = `${scale * 16}px`;
        localStorage.setItem('frutilabs-font-scale', scale);
    }

    // Load saved font scale
    const savedScale = localStorage.getItem('frutilabs-font-scale');
    if (savedScale) {
        currentScale = parseFloat(savedScale);
        setFontScale(currentScale);
    }

    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            if (currentScale < maxScale) {
                currentScale += 0.1;
                setFontScale(currentScale);
            }
        });
    }

    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            if (currentScale > minScale) {
                currentScale -= 0.1;
                setFontScale(currentScale);
            }
        });
    }

    // High contrast mode
    if (contrastBtn) {
        contrastBtn.addEventListener('click', () => {
            const isHighContrast = html.getAttribute('data-high-contrast') === 'true';
            if (isHighContrast) {
                html.removeAttribute('data-high-contrast');
                localStorage.removeItem('frutilabs-high-contrast');
            } else {
                html.setAttribute('data-high-contrast', 'true');
                localStorage.setItem('frutilabs-high-contrast', 'true');
            }
        });
        // Load saved preference
        if (localStorage.getItem('frutilabs-high-contrast') === 'true') {
            html.setAttribute('data-high-contrast', 'true');
        }
    }

    // Dark mode toggle (duplicate of theme toggle in header, but keep for accessibility bar)
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('frutilabs-theme', newTheme);
        });
    }
}

/**
 * Language switcher demo
 */
function initLanguageSwitcher() {
    const langSelect = document.getElementById('language-select');
    if (!langSelect) return;

    langSelect.addEventListener('change', function() {
        const lang = this.value;
        showNotification(`Language switched to ${lang} (demo)`, 'info');
    });
}

/**
 * Comment form submission
 */
function initCommentForm() {
    const form = document.getElementById('comment-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const commentText = document.getElementById('comment-text').value.trim();
        if (!commentText) {
            showNotification('Please write a comment.', 'error');
            return;
        }

        // In real app, send to server. For demo, add to comments list
        const commentsList = document.getElementById('comments-list');
        const newComment = document.createElement('div');
        newComment.className = 'comment';
        newComment.innerHTML = `
            <img src="assets/images/blog/user-avatar.jpg" alt="Your avatar" class="comment-avatar">
            <div class="comment-content">
                <div class="comment-header">
                    <h4>You</h4>
                    <span class="comment-date">Just now</span>
                </div>
                <p>${commentText}</p>
                <div class="comment-actions">
                    <button class="like-comment"><i class="far fa-thumbs-up"></i> 0</button>
                    <button class="reply-comment">Reply</button>
                </div>
            </div>
        `;
        commentsList.prepend(newComment);

        // Add event listeners to new buttons
        newComment.querySelector('.like-comment').addEventListener('click', handleLike);
        newComment.querySelector('.reply-comment').addEventListener('click', handleReply);

        form.reset();
        showNotification('Comment posted! (demo)', 'success');
    });
}

/**
 * Like button functionality
 */
function initLikeButtons() {
    document.querySelectorAll('.like-comment').forEach(btn => {
        btn.addEventListener('click', handleLike);
    });
}

function handleLike(e) {
    const btn = e.currentTarget;
    const icon = btn.querySelector('i');
    let count = parseInt(btn.textContent.match(/\d+/)?.[0] || 0);
    
    if (icon.classList.contains('far')) {
        // Unlike -> like
        icon.classList.remove('far');
        icon.classList.add('fas');
        count += 1;
        showNotification('You liked this comment!', 'success');
    } else {
        // Like -> unlike
        icon.classList.remove('fas');
        icon.classList.add('far');
        count -= 1;
    }
    btn.innerHTML = `<i class="${icon.classList}"></i> ${count}`;
}

/**
 * Reply button (demo)
 */
function initReplyButtons() {
    document.querySelectorAll('.reply-comment').forEach(btn => {
        btn.addEventListener('click', handleReply);
    });
}

function handleReply(e) {
    showNotification('Reply feature demo - would open reply form.', 'info');
}

/**
 * Live chat button
 */
function initLiveChat() {
    const chatBtn = document.getElementById('live-chat-btn');
    if (chatBtn) {
        chatBtn.addEventListener('click', () => {
            showNotification('Live chat demo - support would be connected here.', 'info');
        });
    }
}

/**
 * Blog newsletter form
 */
function initNewsletterForm() {
    const form = document.getElementById('blog-newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('blog-email').value.trim();

        if (!email) {
            showNotification('Please enter your email address.', 'error');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        showNotification('Thank you for subscribing to our blog! (demo)', 'success');
        form.reset();
    });
}