/**
 * Entry point for the BrickReel backend server.
 * Loads environment variables, then starts the HTTP server.
 */

import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[BrickReel] Server running on port ${PORT} — environment: ${process.env.NODE_ENV || 'development'}`);
});
