class BalDashboard {
    constructor() {
        this.data = {
            total: 0,
            byClass: {
                "6°1": 0, "6°2": 0, "6°3": 0, "6°4": 0,
                "5°1": 0, "5°2": 0, "5°3": 0,
                "4°1": 0, "4°2": 0, "4°3": 0, "4°4": 0,
                "3°1": 0, "3°2": 0, "3°3": 0
            }
        };
        this.maxStudentsPerClass = 30; // Estimation
        this.goal = 200; // Objectif total d'inscriptions
        
        this.init();
    }

    init() {
        this.loadData();
        this.render();
        this.setupAutoRefresh();
    }

    // Simuler le chargement des données
    loadData() {
        // Dans la réalité, vous récupéreriez ces données depuis une API
        // Pour l'instant, simulation avec des données aléatoires
        this.data.total = Math.floor(Math.random() * 150) + 50;
        
        // Répartir aléatoirement dans les classes
        let remaining = this.data.total;
        const classes = Object.keys(this.data.byClass);
        
        classes.forEach(className => {
            const maxForClass = Math.min(remaining, Math.floor(Math.random() * 15) + 5);
            this.data.byClass[className] = maxForClass;
            remaining -= maxForClass;
            if (remaining < 0) remaining = 0;
        });
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
            const totalStudents = Object.keys(this.data.byClass).length * this.maxStudentsPerClass;
            const rate = Math.round((this.data.total / totalStudents) * 100);
            rateElement.textContent = rate + '%';
        }
    }

    updateClasses() {
        const container = document.getElementById('classes-container');
        if (!container) return;

        container.innerHTML = '';
        
        Object.entries(this.data.byClass).forEach(([className, count]) => {
            const percentage = Math.round((count / this.maxStudentsPerClass) * 100);
            const card = document.createElement('div');
            card.className = 'class-card';
            card.innerHTML = `
                <div class="class-name">${className}</div>
                <div class="class-count">${count}</div>
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
        let maxCount = 0;
        
        Object.entries(this.data.byClass).forEach(([className, count]) => {
            if (count > maxCount) {
                maxCount = count;
                topClass = className;
            }
        });
        
        topClassElement.textContent = topClass || '-';
    }

    setupAutoRefresh() {
        // Actualiser les données toutes les 30 secondes
        setInterval(() => {
            this.loadData();
            this.render();
        }, 30000);
    }
}

// Initialiser le dashboard quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    new BalDashboard();
});
