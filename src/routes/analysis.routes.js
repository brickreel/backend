/**
 * Analysis routes.
 * Mounts the analysis-related endpoints on the router.
 */

import { Router } from 'express';
import { analyseVideo } from '../controllers/analysis.controller.js';

const router = Router();

/**
 * POST /analysis
 * Analyse a real estate video submission and return a performance score with
 * insights and actionable suggestions.
 */
router.post('/', analyseVideo);

export default router;
