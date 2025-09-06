import express, { json } from 'express';
import session from 'express-session';
import cors from 'cors';
import authRoutes from './routes/auth.js';

const app = express();

app.use(json());
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);

app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            secure: false,
            sameSite: 'lax',
        },
    })
);

app.use('/api', authRoutes);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
