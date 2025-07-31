/**
 * HealthCheckPro - Main JavaScript
 * Handles core functionality, navigation, and user interactions
 */

(function() {
    'use strict';

    // DOM Content Loaded Event
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    /**
     * Initialize the application
     */
    function initializeApp() {
        setupMobileNavigation();
        setupSmoothScrolling();
        setupAnalytics();
        setupPerformanceOptimizations();
        setupAccessibilityEnhancements();
        console.log('HealthCheckPro initialized successfully');
    }

    /**
     * Mobile Navigation Setup
     */
    function setupMobileNavigation() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', function() {
                const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
                
                // Toggle menu visibility
                navMenu.classList.toggle('active');
                
                // Update ARIA attributes
                mobileToggle.setAttribute('aria-expanded', !isExpanded);
                
                // Animate toggle button
                mobileToggle.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                document.body.classList.toggle('nav-open', !isExpanded);
            });

            // Close menu when clicking on a link
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    mobileToggle.classList.remove('active');
                    document.body.classList.remove('nav-open');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                const isClickInsideNav = navMenu.contains(event.target);
                const isClickOnToggle = mobileToggle.contains(event.target);
                
                if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    mobileToggle.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            });
        }
    }

    /**
     * Smooth Scrolling for Anchor Links
     */
    function setupSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('.main-header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update focus for accessibility
                    targetElement.focus();
                }
            });
        });
    }

    /**
     * Basic Analytics Setup (Privacy-friendly)
     */
    function setupAnalytics() {
        // Track tool clicks
        const toolLinks = document.querySelectorAll('.tool-card a');
        toolLinks.forEach(link => {
            link.addEventListener('click', function() {
                const toolName = this.closest('.tool-card').querySelector('h3').textContent;
                trackEvent('tool_click', {
                    tool_name: toolName,
                    timestamp: new Date().toISOString()
                });
            });
        });

        // Track blog clicks
        const blogLinks = document.querySelectorAll('.blog-card a');
        blogLinks.forEach(link => {
            link.addEventListener('click', function() {
                const articleTitle = this.textContent;
                trackEvent('blog_click', {
                    article_title: articleTitle,
                    timestamp: new Date().toISOString()
                });
            });
        });
    }

    /**
     * Privacy-friendly event tracking
     */
    function trackEvent(eventName, data) {
        // Store locally without sending to external services
        try {
            const events = JSON.parse(localStorage.getItem('healthcheckpro_events') || '[]');
            events.push({
                event: eventName,
                data: data,
                timestamp: new Date().toISOString()
            });
            
            // Keep only last 100 events
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }
            
            localStorage.setItem('healthcheckpro_events', JSON.stringify(events));
        } catch (e) {
            console.log('Event tracking disabled - localStorage not available');
        }
    }

    /**
     * Performance Optimizations
     */
    function setupPerformanceOptimizations() {
        // Lazy load images
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }

        // Preload important pages
        const importantLinks = document.querySelectorAll('.tool-card a');
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                importantLinks.forEach(link => {
                    const linkElement = document.createElement('link');
                    linkElement.rel = 'prefetch';
                    linkElement.href = link.href;
                    document.head.appendChild(linkElement);
                });
            });
        }
    }

    /**
     * Accessibility Enhancements
     */
    function setupAccessibilityEnhancements() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', function(e) {
            // ESC key closes mobile menu
            if (e.key === 'Escape') {
                const navMenu = document.querySelector('.nav-menu');
                const mobileToggle = document.querySelector('.mobile-menu-toggle');
                
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    mobileToggle.focus();
                }
            }
        });

        // Announce dynamic content changes
        const announceToScreenReader = (message) => {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = message;
            
            document.body.appendChild(announcement);
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        };

        // Add screen reader only class
        const style = document.createElement('style');
        style.textContent = `
            .sr-only {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                padding: 0 !important;
                margin: -1px !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
                white-space: nowrap !important;
                border: 0 !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Utility Functions
     */
    window.HealthCheckPro = {
        // Public API for other scripts
        trackEvent: trackEvent,
        
        // Utility to get user preferences
        getUserPreferences: function() {
            try {
                return JSON.parse(localStorage.getItem('healthcheckpro_preferences') || '{}');
            } catch (e) {
                return {};
            }
        },
        
        // Utility to save user preferences
        saveUserPreferences: function(preferences) {
            try {
                localStorage.setItem('healthcheckpro_preferences', JSON.stringify(preferences));
                return true;
            } catch (e) {
                return false;
            }
        }
    };

})();
