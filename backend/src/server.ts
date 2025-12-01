import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth.routes';
import vendorRoutes from './routes/vendor.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import dashboardRoutes from './routes/dashboard.routes';
import supportRoutes from './routes/support.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(morgan('combined')); // Logging

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/support', supportRoutes);

// Root route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Satıcı Paneli API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      vendor: '/api/vendor',
      products: '/api/products',
      orders: '/api/orders',
      dashboard: '/api/dashboard',
      support: '/api/support',
    },
  });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`🚀 Satıcı Paneli Backend çalışıyor: http://localhost:${PORT}`);
  console.log(`📚 API Endpoints: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

export default app;
