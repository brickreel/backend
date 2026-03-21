/**
 * Simple request logger utility.
 * Logs the HTTP method, URL, status code, and response time for every request.
 */

/**
 * Returns a middleware function that logs each incoming request.
 * @returns {import('express').RequestHandler}
 */
const requestLogger = () => (req, res, next) => {
  const start = Date.now();

  // Log after the response is finished so we can capture the status code
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} — ${duration}ms`,
    );
  });

  next();
};

export default requestLogger;
