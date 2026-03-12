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

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ensure DB is connected on every request (critical for Vercel serverless)
app.use(async (req, res, next) => {
    try {
        await dbconnect();
        next();
    } catch (error) {
        console.error('DB Connection failed:', error.message);
        res.status(500).json({ msg: 'Database connection failed', error: error.message });
    }
});

app.get('/', (req, res) => {
    res.json({ msg: "server is running successfully" })
})

app.use('/api', authRoute);
app.use('/api/portfolio', portfolioRoute);

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`server is running at port: ${PORT}`);
    });
}

export default app;