class BalDashboard {
    constructor() {
        this.data = {
            total: 0,
            byClass: {},
            classSizes: {
              "6°1": 23, "6°2": 25, "6°3": 26, "6°4": 25,
              "5°1": 31, "5°2": 31, "5°3": 30,
              "4°1": 21, "4°2": 24, "4°3": 17, "4°4": 24,
              "3°1": 27, "3°2": 31, "3°3": 26
            },
            participationRates: {}
        };
        this.goal = 200; // Objectif total d'inscriptions
        this.apiUrl = 'https://script.google.com/macros/s/AKfycbypbknpwRvnYh6m0hCMt0VZL_vNrTcSiaHAdW1FLDkd7u3m7h4wTSWaf54PDML5TnhJsg/exec'; // Replace with your Web App URL
        
        this.init();
    }

    init() {
        this.loadRealData();
        this.setupAutoRefresh();
    }

    async loadRealData() {
        try {
            const response = await fetch(this.apiUrl);
            const realData = await response.json();
            
            if (realData.error) {
                console.error('Error fetching data:', realData.error);
                this.loadFallbackData();
                return;
            }
            
            // Update with real data
            this.data.total = realData.total || 0;
            this.data.byClass = realData.byClass || {};
            this.data.participationRates = realData.participationRates || {};
            
            // If class sizes aren't provided from API, use local ones
            if (realData.classSizes) {
                this.data.classSizes = realData.classSizes;
            }
            
            this.render();
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.loadFallbackData();
        }
    }

    loadFallbackData() {
        // Fallback to local data or show zeros
        Object.keys(this.data.classSizes).forEach(className => {
            this.data.byClass[className] = this.data.byClass[className] || 0;
            this.data.participationRates[className] = this.data.participationRates[className] || 0;
        });
        this.render();
    }

    render() {
        this.updateTotal();
        this.updateClasses();
        this.updateProgress();
        this.updateTopClass();
    }

    updateTotal() {
        const totalElement = document.getElementById('dashboard-total');
        const rateElement = document.getElementById('participation-rate');
        
        if (totalElement) {
            totalElement.textContent = this.data.total;
        }
        
        if (rateElement) {
            // Calculate total possible students
            const totalStudents = Object.values(this.data.classSizes).reduce((sum, size) => sum + size, 0);
            const rate = totalStudents > 0 ? Math.round((this.data.total / totalStudents) * 100) : 0;
            rateElement.textContent = rate + '%';
        }
    }

    updateClasses() {
        const container = document.getElementById('classes-container');
        if (!container) return;

        container.innerHTML = '';
        
        Object.entries(this.data.byClass).forEach(([className, count]) => {
            const classSize = this.data.classSizes[className] || 1;
            const percentage = this.data.participationRates[className] || Math.round((count / classSize) * 100);
            
            const card = document.createElement('div');
            card.className = 'class-card';
            card.innerHTML = `
                <div class="class-name">${className}</div>
                <div class="class-count">${count}/${classSize}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <small>${percentage}% de la classe</small>
            `;
            container.appendChild(card);
        });
    }

    updateProgress() {
        const fillElement = document.getElementById('progress-fill');
        const textElement = document.getElementById('progress-text');
        
        if (fillElement && textElement) {
            const percentage = Math.round((this.data.total / this.goal) * 100);
            fillElement.style.width = Math.min(percentage, 100) + '%';
            textElement.textContent = `${percentage}% de l'objectif atteint (${this.data.total}/${this.goal} inscrits)`;
        }
    }

    updateTopClass() {
        const topClassElement = document.getElementById('top-class');
        if (!topClassElement) return;

        let topClass = '';
        let maxParticipation = 0;
        
        Object.entries(this.data.participationRates).forEach(([className, rate]) => {
            if (rate > maxParticipation) {
                maxParticipation = rate;
                topClass = className;
            }
        });
        
        topClassElement.textContent = topClass || '-';
    }

    setupAutoRefresh() {
        // Actualiser les données toutes les 30 secondes
        setInterval(() => {
            this.loadRealData();
        }, 30000);
    }
}

// Initialiser le dashboard quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    new BalDashboard();
});
