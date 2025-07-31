// Blog functionality
document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
    }
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            handleNewsletterSignup(email);
        });
    }
    
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Reading progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: #2196F3;
        z-index: 1000;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', updateReadingProgress);
    
    // Category filtering
    const categoryLinks = document.querySelectorAll('.category-list a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.dataset.filter) {
                e.preventDefault();
                filterArticlesByCategory(this.dataset.filter);
            }
        });
    });
    
    // Article interaction tracking
    trackArticleInteractions();
    
    // Social sharing functionality
    initializeSocialSharing();
    
    // Dark mode toggle (if implemented)
    initializeDarkMode();
});

function performSearch(query) {
    if (!query.trim()) return;
    
    // Show loading state
    showSearchLoading(true);
    
    // Simulate search with timeout (replace with real API call)
    setTimeout(() => {
        const articles = document.querySelectorAll('.blog-card, .featured-card');
        let resultsFound = 0;
        
        articles.forEach(article => {
            const title = article.querySelector('h3').textContent.toLowerCase();
            const content = article.querySelector('p').textContent.toLowerCase();
            const category = article.querySelector('.category').textContent.toLowerCase();
            
            const matches = title.includes(query.toLowerCase()) || 
                          content.includes(query.toLowerCase()) || 
                          category.includes(query.toLowerCase());
            
            if (matches) {
                article.style.display = 'block';
                resultsFound++;
            } else {
                article.style.display = 'none';
            }
        });
        
        showSearchResults(query, resultsFound);
        showSearchLoading(false);
    }, 800);
    
    // Track search event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'search', {
            search_term: query
        });
    }
}

function showSearchLoading(show) {
    const searchButton = document.querySelector('.search-box button');
    if (show) {
        searchButton.innerHTML = '⏳';
        searchButton.disabled = true;
    } else {
        searchButton.innerHTML = '🔍';
        searchButton.disabled = false;
    }
}

function showSearchResults(query, count) {
    const existingResults = document.querySelector('.search-results');
    if (existingResults) {
        existingResults.remove();
    }
    
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'search-results';
    resultsDiv.innerHTML = `
        <div class="search-results-header">
            <h3>Search Results for "${query}"</h3>
            <p>${count} article${count !== 1 ? 's' : ''} found</p>
            <button class="clear-search" onclick="clearSearch()">Clear Search</button>
        </div>
    `;
    
    const blogMain = document.querySelector('.blog-main .container');
    blogMain.insertBefore(resultsDiv, blogMain.firstChild);
}

function clearSearch() {
    document.querySelector('.search-box input').value = '';
    document.querySelectorAll('.blog-card, .featured-card').forEach(article => {
        article.style.display = 'block';
    });
    const resultsDiv = document.querySelector('.search-results');
    if (resultsDiv) {
        resultsDiv.remove();
    }
}

function handleNewsletterSignup(email) {
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.newsletter-form button');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Thank you for subscribing! Check your email for confirmation.', 'success');
        document.querySelector('.newsletter-form input').value = '';
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Store subscription in localStorage
        localStorage.setItem('newsletter_subscribed', 'true');
        localStorage.setItem('subscriber_email', email);
    }, 1500);
    
    // Track subscription event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'newsletter_signup', {
            method: 'blog_footer'
        });
    }
}

function updateReadingProgress() {
    const article = document.querySelector('article, .blog-main');
    if (!article) return;
    
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    const progressBar = document.querySelector('.reading-progress');
    if (progressBar) {
        progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    }
}

function filterArticlesByCategory(category) {
    const articles = document.querySelectorAll('.blog-card, .featured-card');
    
    articles.forEach(article => {
        const articleCategory = article.querySelector('.category').textContent.toLowerCase();
        
        if (category === 'all' || articleCategory.includes(category.toLowerCase())) {
            article.style.display = 'block';
            article.style.animation = 'fadeIn 0.5s ease-in';
        } else {
            article.style.display = 'none';
        }
    });
    
    // Update active category
    document.querySelectorAll('.category-list a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-filter="${category}"]`).classList.add('active');
}

function trackArticleInteractions() {
    // Track article clicks
    document.querySelectorAll('.blog-card a, .featured-card a').forEach(link => {
        link.addEventListener('click', function() {
            const articleTitle = this.textContent || this.closest('.card-content').querySelector('h3').textContent;
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'article_click', {
                    article_title: articleTitle,
                    click_location: 'blog_listing'
                });
            }
        });
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', throttle(() => {
        const scrollPercent = Math.round((window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            // Track milestone scroll depths
            if ([25, 50, 75, 90].includes(scrollPercent)) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_depth', {
                        scroll_percent: scrollPercent,
                        page_location: window.location.href
                    });
                }
            }
        }
    }, 1000));
}

function initializeSocialSharing() {
    // Add social sharing buttons to articles
    const articles = document.querySelectorAll('.blog-card, .featured-card');
    
    articles.forEach(article => {
        const shareBtn = document.createElement('button');
        shareBtn.className = 'share-btn';
        shareBtn.innerHTML = '📤';
        shareBtn.title = 'Share this article';
        
        shareBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const articleLink = article.querySelector('h3 a');
            if (articleLink) {
                shareArticle(articleLink.href, articleLink.textContent);
            }
        });
        
        const cardContent = article.querySelector('.card-content');
        if (cardContent) {
            cardContent.appendChild(shareBtn);
        }
    });
}

function shareArticle(url, title) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url,
            text: `Check out this health article: ${title}`
        }).catch(console.error);
    } else {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Article link copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Article link copied!', 'success');
        });
    }
    
    // Track sharing event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
            method: 'web_share',
            content_type: 'article',
            item_id: url
        });
    }
}

function initializeDarkMode() {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Create dark mode toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.title = 'Toggle dark mode';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
        
        // Track theme change
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_change', {
                theme: newTheme
            });
        }
    });
    
    // Add to header
    const header = document.querySelector('.main-header .container');
    if (header) {
        header.appendChild(themeToggle);
    }
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#4CAF50',
        error: '#F44336',
        warning: '#FF9800',
        info: '#2196F3'
    };
    return colors[type] || colors.info;
}

function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
    }
    
    .share-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(33, 150, 243, 0.9);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
    }
    
    .share-btn:hover {
        background: #2196F3;
        transform: scale(1.1);
    }
    
    .theme-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2196F3;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .theme-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 25px rgba(0,0,0,0.4);
    }
    
    .search-results {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 2rem;
        border-left: 4px solid #2196F3;
    }
    
    .search-results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .clear-search {
        background: #2196F3;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
    }
    
    .clear-search:hover {
        background: #1976d2;
    }
    
    /* Dark mode styles */
    [data-theme="dark"] {
        --bg-primary: #1a1a1a;
        --bg-secondary: #2d2d2d;
        --text-primary: #ffffff;
        --text-secondary: #cccccc;
        --border-color: #404040;
    }
    
    [data-theme="dark"] body {
        background-color: var(--bg-primary);
        color: var(--text-primary);
    }
    
    [data-theme="dark"] .blog-card,
    [data-theme="dark"] .featured-card,
    [data-theme="dark"] .sidebar-widget {
        background: var(--bg-secondary);
        color: var(--text-primary);
    }
    
    [data-theme="dark"] .card-content h3 a {
        color: var(--text-primary);
    }
    
    [data-theme="dark"] .card-content p {
        color: var(--text-secondary);
    }
`;
document.head.appendChild(style);
