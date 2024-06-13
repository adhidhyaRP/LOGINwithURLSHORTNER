import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import homeRouter from './routes/home.js';
import urlRouter from './routes/url.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/homefunctions', homeRouter);
app.use('/', urlRouter);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            // No options needed here as the deprecated options are removed
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('WELCOME TO OUR PAGE');
});

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await connectDB();
});
