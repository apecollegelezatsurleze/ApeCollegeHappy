// scripts/bal-counter.js
class BalCounter {
    constructor() {
        this.apiUrl = 'https://script.google.com/macros/s/AKfycbzWccyjFEkVqdJpmczlOKP1ZuTCoeveRKXiN79jgKqIURse170q9iC7MH_CHPL-SPXOhw/exec';
        this.goal = 200;
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupAutoRefresh();
    }

    async loadData() {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                }
            });
            const data = await response.json();
            
            if (data.error) {
                console.error('Error fetching data:', data.error);
                this.updateDisplay(0);
                return;
            }
            
            this.updateDisplay(data.total || 0);
            
        } catch (error) {
            console.error('Error loading Bal d\'Hiver data:', error);
            this.updateDisplay(0);
        }
    }

    updateDisplay(total) {
        const totalElement = document.getElementById('bal-total-registrations');
        const progressFill = document.getElementById('bal-progress-fill');
        const progressText = document.getElementById('bal-progress-text');
        
        if (totalElement) totalElement.textContent = total;
        if (progressFill && progressText) {
            const percentage = Math.round((total / this.goal) * 100);
            progressFill.style.width = Math.min(percentage, 100) + '%';
            progressText.textContent = percentage + '%';
        }
    }

    setupAutoRefresh() {
        setInterval(() => this.loadData(), 30000);
    }
}

// Initialize when DOM is loaded
if (document.getElementById('bal-total-registrations')) {
    new BalCounter();
}
