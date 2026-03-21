/**
 * Analysis controller.
 * Handles HTTP request / response logic for the /analysis endpoint.
 * Delegates all business logic to the analysis service.
 */

import { analyseContent } from '../services/analysis.service.js';

/**
 * POST /analysis
 *
 * Expects a JSON body:
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
 *   "score":       number,
 *   "insights":    string[],
 *   "suggestions": string[]
 * }
 *
 * @type {import('express').RequestHandler}
 */
export const analyseVideo = (req, res, next) => {
  try {
    const { title, description, metrics } = req.body;

    // --- Input validation ---
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: '`title` must be a non-empty string.' });
    }

    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: '`description` must be a non-empty string.' });
    }

    if (!metrics || typeof metrics !== 'object') {
      return res.status(400).json({ error: '`metrics` must be an object.' });
    }

    const { views, likes, watchTime } = metrics;

    if (typeof views !== 'number' || views < 0) {
      return res.status(400).json({ error: '`metrics.views` must be a non-negative number.' });
    }

    if (typeof likes !== 'number' || likes < 0) {
      return res.status(400).json({ error: '`metrics.likes` must be a non-negative number.' });
    }

    if (typeof watchTime !== 'number' || watchTime < 0) {
      return res.status(400).json({ error: '`metrics.watchTime` must be a non-negative number.' });
    }

    // --- Delegate to service ---
    const result = analyseContent({ title, description, metrics });

    return res.status(200).json(result);
  } catch (err) {
    // Forward unexpected errors to the global error handler
    next(err);
  }
};
