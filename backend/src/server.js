import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import dbconnect from './config/db.js'
import authRoute from './routes/authRoutes.js'
import portfolioRoute from './routes/portfolioRoutes.js'



const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
dotenv.config();


app.get('/', (req, res) => {
    res.json({ msg: "server is running successfully" })
})

app.use('/api', authRoute);
app.use('/api/portfolio', portfolioRoute);


dbconnect()

app.listen(PORT, () => {
    console.log(`server is runnit at port: ${PORT}`);

})