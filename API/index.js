import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://*.vercel.app', 'https://*.onrender.com']
    : ['http://localhost:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Fraud Detection API is running!',
    endpoints: {
      fraudCheck: '/api/fraud/check',
      health: '/health'
    }
  });
});

// Fraud detection endpoint
app.post('/api/fraud/check', async (req, res) => {
  try {
    const { transaction } = req.body;
    
    // Basic fraud detection logic
    let riskScore = 0;
    let reasons = [];
    
    // Check for high amount
    if (transaction.amount > 1000) {
      riskScore += 30;
      reasons.push('High transaction amount');
    }
    
    // Check for unusual location
    if (transaction.location && transaction.location.country !== 'US') {
      riskScore += 20;
      reasons.push('International transaction');
    }
    
    // Check for velocity
    if (transaction.velocity && transaction.velocity > 5) {
      riskScore += 25;
      reasons.push('High transaction velocity');
    }
    
    const isFraudulent = riskScore > 50;
    
    res.json({
      isFraudulent,
      riskScore,
      reasons,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in fraud check:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;
