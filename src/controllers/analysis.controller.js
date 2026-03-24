/**
 * Analysis controller.
 * Handles HTTP request / response logic for the /analysis endpoint.
 * Delegates all business logic to the analysis service.
 */

import { analyseContent } from '../services/analysis.service.js';

/**
 * POST /analysis
 *
 * Expects a JSON body (from frontend):
 * {
 *   "title":       string,
 *   "description": string,
 *   "views":       number,
 *   "likes":       number,
 *   "watchTime":   number
 * }
 *
 * Or (legacy format):
 * {
 *   "title":       string,
 *   "description": string,
 *   "metrics": {
 *     "views":     number,
 *     "likes":     number,
 *     "watchTime": number
 *   }
 * }
 *
 * Responds with:
 * {
 *   "id":              string (uuid),
 *   "score":           number,
 *   "engagementRate":  number,
 *   "insights":        string[],
 *   "suggestions":     string[]
 * }
 *
 * @type {import('express').RequestHandler}
 */
export const analyseVideo = (req, res, next) => {
  try {
    const { title, description, views, likes, watchTime, metrics } = req.body;

    // Support both formats: flat and nested metrics
    let flatMetrics = { views, likes, watchTime };
    if (!views && metrics) {
      flatMetrics = metrics;
    }

    // --- Input validation ---
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: '`title` must be a non-empty string.' });
    }

    if (description && typeof description !== 'string') {
      return res.status(400).json({ error: '`description` must be a string.' });
    }

    const { views: v, likes: l, watchTime: w } = flatMetrics;

    if (typeof v !== 'number' || v < 0) {
      return res.status(400).json({ error: '`views` must be a non-negative number.' });
    }

    if (typeof l !== 'number' || l < 0) {
      return res.status(400).json({ error: '`likes` must be a non-negative number.' });
    }

    if (typeof w !== 'number' || w < 0) {
      return res.status(400).json({ error: '`watchTime` must be a non-negative number.' });
    }

    // --- Delegate to service ---
    const result = analyseContent({
      title,
      description: description || '',
      metrics: flatMetrics,
    });

    // Add ID and engagement rate for frontend
    const engagementRate = v > 0 ? l / v : 0;
    const response = {
      id: generateId(),
      ...result,
      engagementRate,
    };

    return res.status(200).json(response);
  } catch (err) {
    // Forward unexpected errors to the global error handler
    next(err);
  }
};

// Simple UUID-like ID generator for analysis results
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
