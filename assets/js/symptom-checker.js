/**
 * HealthCheckPro - Symptom Checker Quiz Engine
 * Handles quiz functionality, navigation, and data management
 */

class SymptomChecker {
    constructor(toolName) {
        this.toolName = toolName;
        this.quizData = null;
        this.currentQuestion = 0;
        this.answers = {};
        this.totalScore = 0;
        this.isQuizCompleted = false;
        
        this.init();
    }

    async init() {
        try {
            await this.loadQuizData();
            this.setupEventListeners();
            this.showQuestion(0);
            this.updateProgress();
            console.log(`${this.toolName} quiz initialized`);
        } catch (error) {
            console.error('Quiz initialization failed:', error);
            this.showError('Failed to load quiz data. Please refresh the page.');
        }
    }

    async loadQuizData() {
        try {
            const response = await fetch('./quiz-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.quizData = await response.json();
            
            // Validate quiz data
            if (!this.quizData || !this.quizData.questions || this.quizData.questions.length === 0) {
                throw new Error('Invalid quiz data structure');
            }
        } catch (error) {
            console.error('Error loading quiz data:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousQuestion());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.quiz-content')) {
                switch(e.key) {
                    case 'ArrowLeft':
                        if (this.currentQuestion > 0) this.previousQuestion();
                        break;
                    case 'ArrowRight':
                        if (this.canProceed()) this.nextQuestion();
                        break;
                    case 'Enter':
                        if (this.canProceed()) this.nextQuestion();
                        break;
                }
            }
        });

        // Answer selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.answer-btn')) {
                this.selectAnswer(e.target.closest('.answer-btn'));
            }
            
            if (e.target.closest('.scale-btn')) {
                this.selectScaleAnswer(e.target.closest('.scale-btn'));
            }
        });

        // Restart quiz
        document.addEventListener('click', (e) => {
            if (e.target.closest('.restart-quiz')) {
                e.preventDefault();
                this.restartQuiz();
            }
        });
    }

    showQuestion(index) {
        if (!this.quizData || index >= this.quizData.questions.length) {
            return;
        }

        // Hide all questions
        document.querySelectorAll('.question').forEach(q => {
            q.classList.remove('active');
        });

        // Show current question
        const questionElement = document.querySelector(`.question[data-question="${index + 1}"]`);
        if (questionElement) {
            questionElement.classList.add('active');
            
            // Focus on first answer option for accessibility
            const firstAnswer = questionElement.querySelector('.answer-btn, .scale-btn');
            if (firstAnswer) {
                setTimeout(() => firstAnswer.focus(), 100);
            }
        } else {
            // Generate question dynamically if not in HTML
            this.generateQuestion(index);
        }

        this.updateProgress();
        this.updateNavigationButtons();
    }

    generateQuestion(index) {
        const question = this.quizData.questions[index];
        const quizContent = document.querySelector('.quiz-content');
        
        if (!quizContent || !question) return;

        // Clear existing questions
        quizContent.innerHTML = '';

        const questionDiv = document.createElement('div');
        questionDiv.className = 'question active';
        questionDiv.setAttribute('data-question', index + 1);

        let optionsHTML = '';
        
        if (question.type === 'scale') {
            optionsHTML = `
                <div class="scale-options">
                    ${question.options.map(option => `
                        <button class="scale-btn" data-value="${option.value}" data-weight="${option.weight}">
                            ${option.value}
                        </button>
                    `).join('')}
                </div>
                <div class="scale-labels">
                    <span>${question.scaleLabels?.min || 'Not at all'}</span>
                    <span>${question.scaleLabels?.max || 'Extremely'}</span>
                </div>
            `;
        } else {
            optionsHTML = `
                <div class="answer-options">
                    ${question.options.map(option => `
                        <button class="answer-btn" data-value="${option.value}" data-weight="${option.weight}">
                            <span class="icon">${option.icon || '○'}</span>
                            <span class="text">${option.text}</span>
                        </button>
                    `).join('')}
                </div>
            `;
        }

        questionDiv.innerHTML = `
            <span class="question-number">Question ${index + 1} of ${this.quizData.questions.length}</span>
            <h2>${question.question}</h2>
            ${question.description ? `<p class="question-description">${question.description}</p>` : ''}
            ${optionsHTML}
        `;

        quizContent.appendChild(questionDiv);
    }

    selectAnswer(button) {
        if (!button) return;

        const questionDiv = button.closest('.question');
        const questionIndex = parseInt(questionDiv.dataset.question) - 1;
        
        // Clear previous selections
        questionDiv.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.setAttribute('aria-selected', 'false');
        });

        // Select current answer
        button.classList.add('selected');
        button.setAttribute('aria-selected', 'true');

        // Store answer
        const value = button.dataset.value;
        const weight = parseInt(button.dataset.weight) || 0;
        
        this.answers[questionIndex] = {
            value: value,
            weight: weight,
            text: button.querySelector('.text')?.textContent || value
        };

        // Update navigation
        this.updateNavigationButtons();

        // Auto-advance for better UX (optional)
        if (this.quizData.autoAdvance !== false) {
            setTimeout(() => {
                if (this.canProceed()) {
                    this.nextQuestion();
                }
            }, 1000);
        }

        // Announce to screen readers
        this.announceToScreenReader(`Selected: ${this.answers[questionIndex].text}`);
    }

    selectScaleAnswer(button) {
        if (!button) return;

        const questionDiv = button.closest('.question');
        const questionIndex = parseInt(questionDiv.dataset.question) - 1;
        
        // Clear previous selections
        questionDiv.querySelectorAll('.scale-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.setAttribute('aria-selected', 'false');
        });

        // Select current answer
        button.classList.add('selected');
        button.setAttribute('aria-selected', 'true');

        // Store answer
        const value = button.dataset.value;
        const weight = parseInt(button.dataset.weight) || parseInt(value) || 0;
        
        this.answers[questionIndex] = {
            value: value,
            weight: weight,
            text: `Scale: ${value}`
        };

        // Update navigation
        this.updateNavigationButtons();

        // Announce to screen readers
        this.announceToScreenReader(`Selected scale value: ${value}`);
    }

    nextQuestion() {
        if (!this.canProceed()) return;

        if (this.currentQuestion < this.quizData.questions.length - 1) {
            this.currentQuestion++;
            this.showQuestion(this.currentQuestion);
        } else {
            this.completeQuiz();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.showQuestion(this.currentQuestion);
        }
    }

    canProceed() {
        return this.answers.hasOwnProperty(this.currentQuestion);
    }

    updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            const progress = ((this.currentQuestion + 1) / this.quizData.questions.length) * 100;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `Question ${this.currentQuestion + 1} of ${this.quizData.questions.length}`;
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentQuestion === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = !this.canProceed();
            
            if (this.currentQuestion === this.quizData.questions.length - 1) {
                nextBtn.textContent = 'Get Results';
            } else {
                nextBtn.textContent = 'Next';
            }
        }
    }

    calculateScore() {
        this.totalScore = 0;
        
        Object.values(this.answers).forEach(answer => {
            this.totalScore += answer.weight;
        });

        return this.totalScore;
    }

    getResultLevel() {
        const score = this.calculateScore();
        const scoring = this.quizData.scoring;
        
        if (score <= scoring.low.max) {
            return 'low';
        } else if (score <= scoring.moderate.max) {
            return 'moderate';
        } else {
            return 'high';
        }
    }

    completeQuiz() {
        this.isQuizCompleted = true;
        const score = this.calculateScore();
        const level = this.getResultLevel();
        
        // Hide quiz, show results
        document.querySelector('.quiz-container').style.display = 'none';
        const resultsSection = document.getElementById('resultsSection');
        
        if (resultsSection) {
            resultsSection.style.display = 'block';
            this.displayResults(score, level);
        }

        // Track completion
        if (window.HealthCheckPro) {
            window.HealthCheckPro.trackEvent('quiz_completed', {
                tool: this.toolName,
                score: score,
                level: level,
                answers: Object.keys(this.answers).length
            });
        }

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Announce completion
        this.announceToScreenReader(`Quiz completed. Your risk level is ${level}. Score: ${score}.`);
    }

    displayResults(score, level) {
        const scoring = this.quizData.scoring[level];
        const recommendations = this.quizData.recommendations[level];
        
        // Update score display
        const scoreNumber = document.querySelector('.score-number');
        const scoreLabel = document.querySelector('.score-label');
        const riskLevel = document.querySelector('.risk-level');
        
        if (scoreNumber) scoreNumber.textContent = score;
        if (scoreLabel) scoreLabel.textContent = 'Risk Score';
        if (riskLevel) {
            riskLevel.textContent = scoring.level;
            riskLevel.className = `risk-level ${level}`;
        }

        // Update score circle color
        const scoreCircle = document.querySelector('.score-circle');
        if (scoreCircle) {
            scoreCircle.style.background = `conic-gradient(from 0deg, ${scoring.color} 0deg, ${scoring.color} ${(score / (this.quizData.maxScore || 20)) * 360}deg, #e0e0e0 ${(score / (this.quizData.maxScore || 20)) * 360}deg, #e0e0e0 360deg)`;
        }

        // Update recommendations
        const recommendationsList = document.querySelector('.result-interpretation ul');
        if (recommendationsList && recommendations) {
            recommendationsList.innerHTML = recommendations.map(rec => `<li>${rec}</li>`).join('');
        }

        // Show emergency warning for high risk
        const emergencyWarning = document.querySelector('.emergency-warning');
        if (emergencyWarning) {
            emergencyWarning.style.display = level === 'high' ? 'block' : 'none';
        }
    }

    restartQuiz() {
        // Reset all data
        this.currentQuestion = 0;
        this.answers = {};
        this.totalScore = 0;
        this.isQuizCompleted = false;

        // Show quiz, hide results
        document.querySelector('.quiz-container').style.display = 'block';
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.style.display = 'none';
        }

        // Reset UI
        document.querySelectorAll('.answer-btn, .scale-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.setAttribute('aria-selected', 'false');
        });

        // Show first question
        this.showQuestion(0);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Announce restart
        this.announceToScreenReader('Quiz restarted. Starting from question 1.');
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    showError(message) {
        const quizContent = document.querySelector('.quiz-content');
        if (quizContent) {
            quizContent.innerHTML = `
                <div class="error-message" style="text-align: center; padding: 2rem;">
                    <h2>❌ Error</h2>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="btn-primary">Reload Page</button>
                </div>
            `;
        }
    }

    // Public API methods
    getCurrentProgress() {
        return {
            currentQuestion: this.currentQuestion + 1,
            totalQuestions: this.quizData?.questions?.length || 0,
            answeredQuestions: Object.keys(this.answers).length,
            isCompleted: this.isQuizCompleted
        };
    }

    getAnswerSummary() {
        return this.answers;
    }

    exportResults() {
        if (!this.isQuizCompleted) return null;
        
        return {
            tool: this.toolName,
            score: this.totalScore,
            level: this.getResultLevel(),
            answers: this.answers,
            completedAt: new Date().toISOString(),
            recommendations: this.quizData.recommendations[this.getResultLevel()]
        };
    }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get tool name from URL or page data
    const pathParts = window.location.pathname.split('/');
    const toolName = pathParts[pathParts.length - 2] || 'unknown';
    
    // Initialize the quiz
    window.symptomChecker = new SymptomChecker(toolName);
});
