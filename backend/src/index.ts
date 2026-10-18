import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { toNodeHandler } from "better-auth/node";
import { auth } from './config/auth';

// Import routers (to be created)
// import router from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // required for better-auth cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Better Auth Route
app.all("/api/auth/*", toNodeHandler(auth));

// Custom API Routes
import router from './routes';
app.use('/api', router);

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
