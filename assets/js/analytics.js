// Advanced Analytics and Performance Tracking
class HealthCheckAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.interactions = [];
        this.performanceMetrics = {};
        
        this.init();
    }
    
    init() {
        this.setupGoogleAnalytics();
        this.setupHotjar();
        this.setupCustomTracking();
        this.trackUserJourney();
        this.monitorPerformance();
        this.setupConversionTracking();
    }
    
    setupGoogleAnalytics() {
        // Enhanced Google Analytics 4 setup
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID', {
            // Enhanced e-commerce for health tools
            custom_map: {
                'custom_parameter_1': 'health_tool_used',
                'custom_parameter_2': 'symptom_category',
                'custom_parameter_3': 'completion_rate',
                'custom_parameter_4': 'user_concern_level'
            },
            // User engagement
            engagement_time_msec: 10000,
            // Conversion tracking
            send_page_view: true,
            // Privacy controls
            anonymize_ip: true,
            allow_google_signals: false
        });
        
        // Load GA4 script
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
        document.head.appendChild(gaScript);
    }
    
    setupHotjar() {
        // Hotjar for user behavior analysis
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:3892000,hjsv:6}; // Replace with your Hotjar ID
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    }
    
    setupCustomTracking() {
        // Custom health-specific tracking
        this.trackSymptomCheckerUsage();
        this.trackHealthConcerns();
        this.trackUserEngagement();
        this.trackConversionFunnels();
    }
    
    trackSymptomCheckerUsage() {
        // Track symptom checker interactions
        document.addEventListener('click', (e) => {
            const toolLink = e.target.closest('a[href*="/tools/"]');
            if (toolLink) {
                const toolName = this.extractToolName(toolLink.href);
                
                gtag('event', 'tool_access', {
                    event_category: 'Symptom Checker',
                    event_label: toolName,
                    custom_parameter_1: toolName,
                    user_engagement: 'high'
                });
                
                this.interactions.push({
                    type: 'tool_access',
                    tool: toolName,
                    timestamp: Date.now(),
                    sessionId: this.sessionId
                });
            }
        });
        
        // Track quiz progression
        document.addEventListener('quiz_question_answered', (e) => {
            gtag('event', 'quiz_progress', {
                event_category: 'Symptom Assessment',
                event_label: e.detail.toolName,
                custom_parameter_1: e.detail.toolName,
                custom_parameter_2: e.detail.category,
                value: e.detail.questionNumber
            });
        });
        
        // Track quiz completion
        document.addEventListener('quiz_completed', (e) => {
            gtag('event', 'assessment_completed', {
                event_category: 'Symptom Assessment',
                event_label: e.detail.toolName,
                custom_parameter_1: e.detail.toolName,
                custom_parameter_3: '100',
                custom_parameter_4: e.detail.riskLevel,
                value: e.detail.totalScore
            });
        });
    }
    
    trackHealthConcerns() {
        // Track health concern patterns
        const concernTracking = {
            high_risk_symptoms: ['severe-pain', 'difficulty-breathing', 'chest-pain'],
            mental_health_indicators: ['anxiety', 'depression', 'stress'],
            chronic_conditions: ['ibs', 'asthma', 'recurring-symptoms']
        };
        
        document.addEventListener('quiz_completed', (e) => {
            const responses = e.detail.responses;
            const concernLevel = this.analyzeConcernLevel(responses);
            
            gtag('event', 'health_concern_analysis', {
                event_category: 'Health Analytics',
                event_label: concernLevel,
                custom_parameter_4: concernLevel,
                non_interaction: false
            });
        });
    }
    
    trackUserEngagement() {
        // Advanced engagement tracking
        let engagementTimer = 0;
        let isActive = true;
        
        // Track time spent on health tools
        setInterval(() => {
            if (isActive && document.hasFocus()) {
                engagementTimer += 1;
                
                // Send engagement event every 30 seconds
                if (engagementTimer % 30 === 0) {
                    gtag('event', 'user_engagement', {
                        event_category: 'Engagement',
                        event_label: 'Active Time',
                        value: engagementTimer,
                        non_interaction: true
                    });
                }
            }
        }, 1000);
        
        // Track scroll depth
        this.trackScrollDepth();
        
        // Track click heatmaps
        this.trackClickPatterns();
    }
    
    trackScrollDepth() {
        let maxScroll = 0;
        const milestones = [25, 50, 75, 90, 100];
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                milestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !this[`milestone_${milestone}`]) {
                        this[`milestone_${milestone}`] = true;
                        
                        gtag('event', 'scroll_depth', {
                            event_category: 'Engagement',
                            event_label: `${milestone}%`,
                            value: milestone,
                            non_interaction: true
                        });
                    }
                });
            }
        }, 1000));
    }
    
    trackClickPatterns() {
        document.addEventListener('click', (e) => {
            const element = e.target;
            const elementInfo = {
                tag: element.tagName.toLowerCase(),
                class: element.className,
                id: element.id,
                text: element.textContent.substring(0, 50),
                x: e.clientX,
                y: e.clientY
            };
            
            // Track important UI elements
            if (element.matches('button, .cta-button, .btn-primary, .answer-btn')) {
                gtag('event', 'ui_interaction', {
                    event_category: 'UI Elements',
                    event_label: elementInfo.tag,
                    custom_parameter_1: elementInfo.class,
                    non_interaction: false
                });
            }
        });
    }
    
    setupConversionTracking() {
        // Health-specific conversion events
        const conversions = {
            symptom_assessment_completed: 'Assessment Completion',
            newsletter_signup: 'Newsletter Subscription',
            contact_form_submitted: 'Contact Form',
            blog_article_read: 'Content Engagement',
            return_visit: 'User Retention'
        };
        
        Object.keys(conversions).forEach(eventType => {
            document.addEventListener(eventType, (e) => {
                gtag('event', 'conversion', {
                    event_category: 'Conversions',
                    event_label: conversions[eventType],
                    value: 1
                });
                
                // Send to conversion API
                this.sendConversionData(eventType, e.detail);
            });
        });
    }
    
    monitorPerformance() {
        // Core Web Vitals monitoring
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    gtag('event', 'web_vitals', {
                        event_category: 'Performance',
                        event_label: 'LCP',
                        value: Math.round(entry.startTime),
                        non_interaction: true
                    });
                }
            }).observe({entryTypes: ['largest-contentful-paint']});
            
            // First Input Delay
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    gtag('event', 'web_vitals', {
                        event_category: 'Performance',
                        event_label: 'FID',
                        value: Math.round(entry.processingStart - entry.startTime),
                        non_interaction: true
                    });
                }
            }).observe({entryTypes: ['first-input']});
            
            // Cumulative Layout Shift
            let clsValue = 0;
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    clsValue += entry.value;
                }
                gtag('event', 'web_vitals', {
                    event_category: 'Performance',
                    event_label: 'CLS',
                    value: Math.round(clsValue * 1000),
                    non_interaction: true
                });
            }).observe({entryTypes: ['layout-shift']});
        }
        
        // Monitor resource loading
        this.monitorResourcePerformance();
        this.trackPageLoadMetrics();
    }
    
    monitorResourcePerformance() {
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            
            resources.forEach(resource => {
                if (resource.duration > 1000) { // Resources taking > 1 second
                    gtag('event', 'slow_resource', {
                        event_category: 'Performance',
                        event_label: resource.name.split('/').pop(),
                        value: Math.round(resource.duration),
                        non_interaction: true
                    });
                }
            });
        });
    }
    
    trackPageLoadMetrics() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            // Time to First Byte
            const ttfb = navigation.responseStart - navigation.requestStart;
            gtag('event', 'page_timing', {
                event_category: 'Performance',
                event_label: 'TTFB',
                value: Math.round(ttfb),
                non_interaction: true
            });
            
            // DOM Content Loaded
            const dcl = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
            gtag('event', 'page_timing', {
                event_category: 'Performance',
                event_label: 'DCL',
                value: Math.round(dcl),
                non_interaction: true
            });
            
            // Page Load Complete
            const loadComplete = navigation.loadEventEnd - navigation.loadEventStart;
            gtag('event', 'page_timing', {
                event_category: 'Performance',
                event_label: 'Load Complete',
                value: Math.round(loadComplete),
                non_interaction: true
            });
        });
    }
    
    // Utility methods
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    extractToolName(url) {
        const matches = url.match(/\/tools\/(.+?)-symptom-checker/);
        return matches ? matches[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown Tool';
    }
    
    analyzeConcernLevel(responses) {
        // Analyze responses to determine concern level
        const highRiskIndicators = responses.filter(r => r.weight >= 3).length;
        const totalResponses = responses.length;
        const riskRatio = highRiskIndicators / totalResponses;
        
        if (riskRatio >= 0.6) return 'high';
        if (riskRatio >= 0.3) return 'moderate';
        return 'low';
    }
    
    sendConversionData(eventType, data) {
        // Send conversion data to backend or third-party services
        fetch('/api/conversions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: eventType,
                data: data,
                sessionId: this.sessionId,
                timestamp: Date.now()
            })
        }).catch(error => console.log('Conversion tracking error:', error));
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Initialize analytics
const healthAnalytics = new HealthCheckAnalytics();

// Export for global access
window.HealthAnalytics = healthAnalytics;
