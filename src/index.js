import { dbConnect } from './db/index.js';
import dotenv from 'dotenv';
import express from 'express';
import userRoutes from './routes/user.routes.js';
import product from './routes/product.routes.js';
import cookieParser from 'cookie-parser';
import orderRoutes from './routes/order.routes.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Load environment variables
dotenv.config({ path: './.env' });

console.log('env',process.env.CORS_ORIGIN)

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN , // Allow requests from this origin
    credentials: true, // Allow credentials (cookies, tokens)
  })
);

// Handle preflight requests
// app.options("*", cors());

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use('/api/v1/public', express.static('public'));

// Routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/product', product);
app.use('/api/v1/order', orderRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
dbConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://127.0.0.1:${port}`);
    });
  })
  .catch((err) => {
    console.error(`Error while connecting to the database: ${err}`);
  });