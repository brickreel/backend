/**
 * Analysis service.
 *
 * Contains the core business logic for scoring real estate video content
 * and generating mock insights / suggestions.
 *
 * This module is intentionally kept simple so it can be extended later
 * (e.g. by swapping in an AI model or a database-backed scoring algorithm).
 */

/**
 * Compute a content score based on engagement metrics.
 *
 * Scoring formula (all values are normalised to a 0–100 scale):
 *   - views     contributes 30 % of the total score
 *   - likes     contributes 30 % (measured as like-rate relative to views)
 *   - watchTime contributes 40 % (in seconds; capped at 300 s for full marks)
 *
 * @param {{ views: number, likes: number, watchTime: number }} metrics
 * @returns {number} A rounded score between 0 and 100
 */
export const computeScore = ({ views, likes, watchTime }) => {
  // Views component — scale linearly up to 10,000 views for a full 30 pts
  const viewScore = Math.min(views / 10_000, 1) * 30;

  // Like-rate component — avoid division by zero when views is 0
  const likeRate = views > 0 ? likes / views : 0;
  const likeScore = Math.min(likeRate / 0.1, 1) * 30; // 10 % like-rate = full 30 pts

  // Watch-time component — cap at 300 seconds for full 40 pts
  const watchScore = Math.min(watchTime / 300, 1) * 40;

  return Math.round(viewScore + likeScore + watchScore);
};

/**
 * Generate a list of human-readable insights based on the provided metrics.
 *
 * @param {{ views: number, likes: number, watchTime: number }} metrics
 * @returns {string[]}
 */
export const generateInsights = ({ views, likes, watchTime }) => {
  const insights = [];

  if (watchTime >= 120) {
    insights.push('Videos with higher watch time perform significantly better in search rankings.');
  }

  if (views > 0 && likes / views >= 0.05) {
    insights.push('A strong like-to-view ratio signals high audience satisfaction.');
  }

  if (views < 500) {
    insights.push('Low view count detected — distribution channels may need attention.');
  }

  if (likes === 0) {
    insights.push('No likes recorded yet — engagement prompts inside the video can help.');
  }

  // Always include at least one generic insight
  insights.push('Consistent posting cadence is one of the strongest predictors of channel growth.');

  return insights;
};

/**
 * Generate a list of actionable suggestions to improve content performance.
 *
 * @param {{ views: number, likes: number, watchTime: number }} metrics
 * @returns {string[]}
 */
export const generateSuggestions = ({ views, likes, watchTime }) => {
  const suggestions = [];

  if (watchTime < 60) {
    suggestions.push('Try starting with a stronger hook in the first 3 seconds to retain viewers.');
  }

  if (views > 0 && likes / views < 0.02) {
    suggestions.push('Add a clear call-to-action asking viewers to like the video if they found it helpful.');
  }

  if (views < 500) {
    suggestions.push('Share the video across social platforms and embed it in your listing pages to boost reach.');
  }

  if (watchTime >= 180) {
    suggestions.push('Repurpose your best-performing segments as short-form clips for Reels or TikTok.');
  }

  // Always include at least one generic suggestion
  suggestions.push('Use high-quality thumbnails with clear text overlays to improve click-through rates.');

  return suggestions;
};

/**
 * Analyse a real estate video submission and return a score with insights and suggestions.
 *
 * @param {{ title: string, description: string, metrics: { views: number, likes: number, watchTime: number } }} payload
 * @returns {{ score: number, insights: string[], suggestions: string[] }}
 */
export const analyseContent = ({ title, description, metrics }) => {
  // title and description are available here for future use (e.g. NLP analysis)
  void title;
  void description;

  const score = computeScore(metrics);
  const insights = generateInsights(metrics);
  const suggestions = generateSuggestions(metrics);

  return { score, insights, suggestions };
};
