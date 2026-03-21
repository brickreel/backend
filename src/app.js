/**
 * Express application.
 * Configures middleware, routes, and error handling.
 * Separated from the server entry point so the app can be imported
 * independently for testing.
 */

import express from 'express';
import cors from 'cors';
import requestLogger from './utils/logger.js';
import analysisRoutes from './routes/analysis.routes.js';

const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

// Enable Cross-Origin Resource Sharing for all origins.
// Restrict origins in production via the CORS_ORIGIN env variable.
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Log every HTTP request
app.use(requestLogger());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/**
 * GET /health
 * Health check endpoint used by Render (and other orchestrators) to verify
 * that the service is running.
 */
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount analysis routes under /analysis
app.use('/analysis', analysisRoutes);

// ---------------------------------------------------------------------------
// 404 handler — must come AFTER all valid routes
// ---------------------------------------------------------------------------
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ---------------------------------------------------------------------------
// Global error handler — must be the LAST middleware (4 parameters)
// ---------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

export default app;
