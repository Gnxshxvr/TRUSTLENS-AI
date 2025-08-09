// Configuration for API endpoints
const API_CONFIG = {
    development: {
        baseURL: 'http://localhost:5000'
    },
    production: {
        baseURL: process.env.NODE_ENV === 'production' 
            ? 'https://your-api-domain.vercel.app' 
            : 'https://your-api-domain.onrender.com'
    }
};

// Get current environment
const getEnvironment = () => {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' 
        ? 'development' 
        : 'production';
};

// Get API base URL
const getApiUrl = () => {
    return API_CONFIG[getEnvironment()].baseURL;
};

// Export for use in other files
window.API_CONFIG = {
    baseURL: getApiUrl(),
    endpoints: {
        fraudCheck: '/api/fraud/check',
        health: '/health',
        submit: '/submit',
        anomalous: '/anomalous',
        data: '/data'
    }
};
