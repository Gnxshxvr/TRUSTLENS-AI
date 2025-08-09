// API client for fraud detection
class FraudAPI {
    constructor() {
        this.baseURL = this.getBaseURL();
    }

    getBaseURL() {
        // Determine the base URL based on the current environment
        const isLocal = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
        
        if (isLocal) {
            return 'http://localhost:5000';
        } else {
            // Use the deployed API URL
            return 'https://your-api-domain.vercel.app'; // Update this with your actual deployed URL
        }
    }

    async checkFraud(transactionData) {
        try {
            const response = await fetch(`${this.baseURL}/api/fraud/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transaction: transactionData })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error checking fraud:', error);
            throw error;
        }
    }

    async getHealth() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            return await response.json();
        } catch (error) {
            console.error('Error checking health:', error);
            throw error;
        }
    }
}

// Create global instance
window.fraudAPI = new FraudAPI();
