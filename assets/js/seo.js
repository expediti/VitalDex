// Advanced SEO and Performance Optimization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all SEO enhancements
    initializeStructuredData();
    setupOpenGraphTags();
    implementLazyLoading();
    optimizeImages();
    setupServiceWorker();
    initializeAnalytics();
    setupCriticalResourceHints();
    implementA11yEnhancements();
});

function initializeStructuredData() {
    // Add FAQ Schema for symptom checkers
    const faqData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How accurate are online symptom checkers?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Online symptom checkers are educational tools that can help you understand potential health conditions, but they cannot replace professional medical diagnosis. Always consult with a healthcare provider for proper evaluation."
                }
            },
            {
                "@type": "Question", 
                "name": "When should I see a doctor instead of using a symptom checker?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Seek immediate medical attention for severe symptoms like difficulty breathing, chest pain, severe headache, high fever, or any emergency warning signs. Symptom checkers are best for preliminary assessment of mild to moderate symptoms."
                }
            }
        ]
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(faqData);
    document.head.appendChild(script);
}

function setupOpenGraphTags() {
    // Dynamic Open Graph tags based on page content
    const pageTitle = document.title;
    const pageDescription = document.querySelector('meta[name="description"]')?.content;
    const pageUrl = window.location.href;
    
    // Add Twitter Card tags
    addMetaTag('name', 'twitter:card', 'summary_large_image');
    addMetaTag('name', 'twitter:title', pageTitle);
    addMetaTag('name', 'twitter:description', pageDescription);
    addMetaTag('name', 'twitter:image', `${window.location.origin}/assets/images/og-image.jpg`);
    
    // Add additional Open Graph tags
    addMetaTag('property', 'og:site_name', 'HealthCheckPro');
    addMetaTag('property', 'og:locale', 'en_US');
    addMetaTag('property', 'og:updated_time', new Date().toISOString());
}

function addMetaTag(attribute, name, content) {
    if (!document.querySelector(`meta[${attribute}="${name}"]`)) {
        const meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        meta.content = content;
        document.head.appendChild(meta);
    }
}

function implementLazyLoading() {
    // Native lazy loading for images
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
    
    // Intersection Observer for non-critical content
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };
    
    const contentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Load deferred content
                if (element.dataset.src) {
                    element.src = element.dataset.src;
                    element.removeAttribute('data-src');
                }
                
                // Animate elements
                element.classList.add('loaded');
                contentObserver.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe lazy-loadable elements
    document.querySelectorAll('[data-src], .lazy-load').forEach(el => {
        contentObserver.observe(el);
    });
}

function optimizeImages() {
    // Add WebP support detection and fallback
    function supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('webp') > -1;
    }
    
    if (supportsWebP()) {
        document.documentElement.classList.add('webp-support');
    }
    
    // Implement responsive images
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('sizes') && img.hasAttribute('data-responsive')) {
            img.setAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');
        }
    });
}

function setupServiceWorker() {
    // Register service worker for caching
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

function initializeAnalytics() {
    // Google Analytics 4 with enhanced e-commerce
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href,
        content_group1: getContentGroup(),
        custom_map: {
            custom_parameter_1: 'tool_usage',
            custom_parameter_2: 'health_category'
        }
    });
    
    // Load GA4 script
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
    document.head.appendChild(gaScript);
    
    // Track Core Web Vitals
    trackCoreWebVitals();
}

function getContentGroup() {
    const path = window.location.pathname;
    if (path.includes('/tools/')) return 'Symptom Checkers';
    if (path.includes('/blog/')) return 'Health Blog';
    if (path === '/') return 'Homepage';
    return 'Other';
}

function trackCoreWebVitals() {
    // Import web-vitals library dynamically
    import('https://unpkg.com/web-vitals@3/dist/web-vitals.js').then(({onCLS, onFID, onFCP, onLCP, onTTFB}) => {
        onCLS(sendToAnalytics);
        onFID(sendToAnalytics);
        onFCP(sendToAnalytics);
        onLCP(sendToAnalytics);
        onTTFB(sendToAnalytics);
    });
}

function sendToAnalytics({name, delta, rating, value}) {
    gtag('event', name, {
        event_category: 'Web Vitals',
        event_label: rating,
        value: Math.round(name === 'CLS' ? delta * 1000 : delta),
        non_interaction: true,
    });
}

function setupCriticalResourceHints() {
    // Add critical resource hints
    const resourceHints = [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://www.google-analytics.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
        { rel: 'preload', href: '/assets/css/main.css', as: 'style' },
        { rel: 'preload', href: '/assets/js/main.js', as: 'script' }
    ];
    
    resourceHints.forEach(hint => {
        const link = document.createElement('link');
        Object.keys(hint).forEach(key => {
            link.setAttribute(key, hint[key]);
        });
        document.head.appendChild(link);
    });
}

function implementA11yEnhancements() {
    // Enhanced accessibility features
    
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 4px;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if not exists
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main-content';
    }
    
    // Enhanced focus management
    setupFocusManagement();
    
    // Keyboard navigation improvements
    setupKeyboardNavigation();
    
    // Screen reader announcements
    setupAriaLiveRegions();
}

function setupFocusManagement() {
    // Focus trap for modals and overlays
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const modal = document.querySelector('.modal.active, .overlay.active');
            if (modal) {
                trapFocus(e, modal);
            }
        }
    });
}

function trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        }
    } else {
        if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    }
}

function setupKeyboardNavigation() {
    // Enhanced keyboard navigation for custom components
    document.querySelectorAll('[data-keyboard-nav]').forEach(element => {
        element.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'Enter':
                case ' ':
                    if (this.tagName !== 'INPUT' && this.tagName !== 'TEXTAREA') {
                        this.click();
                        e.preventDefault();
                    }
                    break;
                case 'Escape':
                    const modal = this.closest('.modal, .overlay');
                    if (modal) {
                        closeModal(modal);
                    }
                    break;
            }
        });
    });
}

function setupAriaLiveRegions() {
    // Create ARIA live regions for dynamic content updates
    const liveRegions = [
        { id: 'status-messages', type: 'polite' },
        { id: 'error-messages', type: 'assertive' }
    ];
    
    liveRegions.forEach(region => {
        if (!document.getElementById(region.id)) {
            const liveRegion = document.createElement('div');
            liveRegion.id = region.id;
            liveRegion.setAttribute('aria-live', region.type);
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.cssText = `
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            `;
            document.body.appendChild(liveRegion);
        }
    });
}

// Utility function to announce messages to screen readers
function announceToScreenReader(message, type = 'polite') {
    const regionId = type === 'assertive' ? 'error-messages' : 'status-messages';
    const region = document.getElementById(regionId);
    if (region) {
        region.textContent = message;
        setTimeout(() => {
            region.textContent = '';
        }, 1000);
    }
}

// Performance monitoring
function monitorPerformance() {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > 50) {
                    gtag('event', 'long_task', {
                        event_category: 'Performance',
                        event_label: 'Long Task',
                        value: Math.round(entry.duration),
                        non_interaction: true
                    });
                }
            }
        });
        observer.observe({entryTypes: ['longtask']});
    }
    
    // Monitor resource loading
    window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        
        gtag('event', 'page_load_time', {
            event_category: 'Performance',
            event_label: 'Page Load',
            value: Math.round(loadTime),
            non_interaction: true
        });
    });
}

// Initialize performance monitoring
monitorPerformance();
