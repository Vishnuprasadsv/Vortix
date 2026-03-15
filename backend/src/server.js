import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import dbconnect from './config/db.js'
import authRoute from './routes/authRoutes.js'
import portfolioRoute from './routes/portfolioRoutes.js'

// dotenv MUST be first to load env vars before anything else uses them
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to allow cross-origin requests from the frontend
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ensure DB is connected on every request (critical for Vercel serverless)
app.use(async (req, res, next) => {
    try {
        await dbconnect(); // Create MongoDB connection
        next(); // Proceed to the actual route handler
    } catch (error) {
        console.error('DB Connection failed:', error.message);
        res.status(500).json({ msg: 'Database connection failed', error: error.message });
    }
});

// Basic health check endpoint
app.get('/', (req, res) => {
    res.json({ msg: "server is running successfully" })
})

// Define base paths for API routes
app.use('/api', authRoute); // All auth routes will start with /api (e.g., /api/login)
app.use('/api/portfolio', portfolioRoute); // Portfolio routes start with /api/portfolio

// Start server (Only runs in local development, Vercel handles this in prod)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`server is running at port: ${PORT}`);
    });
}

export default app;