/**
 * HealthCheckPro - Accessibility Enhancement Script
 * Provides additional accessibility features and WCAG compliance
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initializeAccessibility();
    });

    function initializeAccessibility() {
        setupFocusManagement();
        setupScreenReaderEnhancements();
        setupColorContrastToggle();
        setupMotionPreferences();
        setupKeyboardShortcuts();
        console.log('Accessibility features initialized');
    }

    /**
     * Focus Management
     */
    function setupFocusManagement() {
        // Track focus for better visibility
        let focusedElement = null;
        
        document.addEventListener('focusin', function(e) {
            focusedElement = e.target;
            e.target.classList.add('focused');
        });
        
        document.addEventListener('focusout', function(e) {
            e.target.classList.remove('focused');
        });

        // Skip links functionality
        const skipLinks = document.querySelectorAll('.skip-link');
        skipLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /**
     * Screen Reader Enhancements
     */
    function setupScreenReaderEnhancements() {
        // Add more descriptive labels
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach((card, index) => {
            const title = card.querySelector('h3').textContent;
            const desc = card.querySelector('p').textContent;
            const button = card.querySelector('a');
            
            button.setAttribute('aria-describedby', `tool-desc-${index}`);
            
            const descElement = document.createElement('span');
            descElement.id = `tool-desc-${index}`;
            descElement.className = 'sr-only';
            descElement.textContent = `${title}: ${desc}`;
            card.appendChild(descElement);
        });

        // Announce page changes
        const announcePageChange = (message) => {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'assertive');
            announcement.className = 'sr-only';
            announcement.textContent = message;
            
            document.body.appendChild(announcement);
            setTimeout(() => {
                if (document.body.contains(announcement)) {
                    document.body.removeChild(announcement);
                }
            }, 1000);
        };

        // Listen for navigation changes
        window.addEventListener('popstate', function() {
            announcePageChange('Page changed');
        });
    }

    /**
     * Color Contrast Toggle
     */
    function setupColorContrastToggle() {
        // Create high contrast toggle
        const contrastToggle = document.createElement('button');
        contrastToggle.className = 'contrast-toggle';
        contrastToggle.innerHTML = '🔆 High Contrast';
        contrastToggle.setAttribute('aria-label', 'Toggle high contrast mode');
        contrastToggle.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 1000;
            padding: 8px 12px;
            background: #000;
            color: #fff;
            border: 2px solid #fff;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease;
        `;

        // Show on focus or when user prefers high contrast
        const showContrastToggle = () => {
            contrastToggle.style.opacity = '1';
            contrastToggle.style.visibility = 'visible';
        };

        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.altKey && e.key === 'h') {
                showContrastToggle();
                contrastToggle.focus();
            }
        });

        contrastToggle.addEventListener('click', function() {
            document.body.classList.toggle('high-contrast');
            const isHighContrast = document.body.classList.contains('high-contrast');
            
            this.innerHTML = isHighContrast ? '🔅 Normal Contrast' : '🔆 High Contrast';
            this.setAttribute('aria-label', 
                isHighContrast ? 'Switch to normal contrast' : 'Switch to high contrast');
            
            // Save preference
            localStorage.setItem('highContrast', isHighContrast);
        });

        document.body.appendChild(contrastToggle);

        // Apply saved preference
        if (localStorage.getItem('highContrast') === 'true') {
            document.body.classList.add('high-contrast');
            contrastToggle.innerHTML = '🔅 Normal Contrast';
            showContrastToggle();
        }

        // High contrast CSS
        const contrastCSS = document.createElement('style');
        contrastCSS.textContent = `
            .high-contrast {
                filter: contrast(150%) brightness(150%);
            }
            
            .high-contrast .tool-card {
                border: 3px solid #000 !important;
                background: #fff !important;
            }
            
            .high-contrast .btn-primary {
                background: #000 !important;
                color: #fff !important;
                border: 2px solid #000 !important;
            }
            
            .high-contrast .main-header {
                background: #fff !important;
                border-bottom: 3px solid #000 !important;
            }
            
            .focused {
                outline: 3px solid #ff0000 !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(contrastCSS);
    }

    /**
     * Motion Preferences
     */
    function setupMotionPreferences() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleMotionPreference = (mediaQuery) => {
            if (mediaQuery.matches) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        };

        handleMotionPreference(prefersReducedMotion);
        prefersReducedMotion.addEventListener('change', handleMotionPreference);

        // Reduced motion CSS
        const reducedMotionCSS = document.createElement('style');
        reducedMotionCSS.textContent = `
            .reduced-motion * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
            
            .reduced-motion html {
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(reducedMotionCSS);
    }

    /**
     * Keyboard Shortcuts
     */
    function setupKeyboardShortcuts() {
        const shortcuts = {
            'h': () => document.querySelector('h1, h2').focus(), // Go to main heading
            '/': () => document.querySelector('input[type="search"]')?.focus(), // Search
            'n': () => document.querySelector('.nav-menu a')?.focus(), // Navigation
            'm': () => document.querySelector('#main-content')?.focus(), // Main content
            'f': () => document.querySelector('.main-footer')?.focus() // Footer
        };

        document.addEventListener('keydown', function(e) {
            // Only trigger if Alt key is pressed with the shortcut
            if (e.altKey && shortcuts[e.key]) {
                e.preventDefault();
                shortcuts[e.key]();
            }
        });

        // Add keyboard shortcuts help
        const helpText = document.createElement('div');
        helpText.className = 'keyboard-help sr-only';
        helpText.innerHTML = `
            <h3>Keyboard Shortcuts:</h3>
            <ul>
                <li>Alt + H: Go to main heading</li>
                <li>Alt + N: Go to navigation</li>
                <li>Alt + M: Go to main content</li>
                <li>Alt + F: Go to footer</li>
                <li>Ctrl + Alt + H: Toggle high contrast</li>
                <li>Escape: Close mobile menu</li>
            </ul>
        `;
        document.body.appendChild(helpText);
    }

})();
