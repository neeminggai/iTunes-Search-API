/**
 * @fileoverview iTunes Search API proxy route.
 * Accepts a search term and optional media type, calls the public
 * iTunes Search API, normalises the response, and returns it to the
 * React client. All requests must carry a valid JWT (see middleware/auth.js).
 */

'use strict';

const express = require('express');
const axios = require('axios');
const authenticateToken = require('../middleware/auth');

const router = express.Router();
const ITUNES_API_URL = 'https://itunes.apple.com/search';

/**
 * Maps the user-facing media type labels to iTunes API values.
 * iTunes uses camelCase for multi-word types (e.g. tvShow, shortFilm).
 */
const MEDIA_TYPE_MAP = {
  all: 'all',
  music: 'music',
  movie: 'movie',
  podcast: 'podcast',
  audiobook: 'audiobook',
  'short film': 'shortFilm',
  tvshow: 'tvShow',
  software: 'software',
  ebook: 'ebook',
};

/**
 * Normalises a raw iTunes result object into a consistent shape that
 * the frontend can consume regardless of media type.
 *
 * @param {Object} item - Raw result from iTunes Search API.
 * @returns {Object} Normalised media item.
 */
function normaliseItem(item) {
  // Prefer track-level name, fall back to collection or artist.
  const title = item.trackName || item.collectionName || item.artistName || 'Unknown';
  // Upgrade the thumbnail to a larger 300×300 image when available.
  const artwork = item.artworkUrl100
    ? item.artworkUrl100.replace('100x100bb', '300x300bb')
    : null;

  return {
    id: item.trackId || item.collectionId || item.artistId,
    title,
    artist: item.artistName || 'Unknown Artist',
    collectionName: item.collectionName || null,
    artwork,
    releaseDate: item.releaseDate || null,
    genre: item.primaryGenreName || null,
    mediaKind: item.kind || item.wrapperType || 'unknown',
    viewUrl: item.trackViewUrl || item.collectionViewUrl || null,
    description: item.longDescription || item.shortDescription || null,
  };
}

/**
 * GET /api/search
 * Query params:
 *   - term  {string}  Required. The search keyword(s).
 *   - media {string}  Optional. Media type (default: 'all').
 *   - limit {number}  Optional. Max results to return (default: 24, max: 200).
 *
 * Response JSON: { results: NormalisedItem[], totalResults: number }
 */
router.get('/', authenticateToken, async (req, res) => {
  const { term, media = 'all', limit = 24 } = req.query;

  if (!term || !term.trim()) {
    return res.status(400).json({ error: 'A search term is required.' });
  }

  // Resolve the media type, defaulting to 'all' for unrecognised values.
  const mediaKey = String(media).toLowerCase().trim();
  const itunesMedia = MEDIA_TYPE_MAP[mediaKey] || 'all';

  try {
    const response = await axios.get(ITUNES_API_URL, {
      params: {
        term: term.trim(),
        media: itunesMedia,
        limit: Math.min(Number(limit) || 24, 200),
      },
      timeout: 8000,
    });

    const results = response.data.results.map(normaliseItem);
    return res.status(200).json({ results, totalResults: response.data.resultCount });
  } catch (error) {
    console.error('iTunes API error:', error.message);
    return res.status(502).json({ error: 'Failed to fetch data from iTunes API.' });
  }
});

module.exports = router;
