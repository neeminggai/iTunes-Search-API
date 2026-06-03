/**
 * @fileoverview API service module.
 * Handles all HTTP communication with the Express backend, including
 * JWT token acquisition and authenticated search requests.
 */

const API_BASE = '/api';

/** Module-level token cache so we only fetch once per session. */
let cachedToken = null;

/**
 * Fetches a JWT from the backend and caches it for the session.
 * The token is attached to every subsequent search request.
 *
 * @returns {Promise<string>} A valid JWT string.
 * @throws {Error} If the token request fails.
 */
async function getToken() {
  if (cachedToken) return cachedToken;

  const response = await fetch(`${API_BASE}/auth/token`, { method: 'POST' });
  if (!response.ok) {
    throw new Error('Failed to obtain authentication token.');
  }
  const data = await response.json();
  cachedToken = data.token;
  return cachedToken;
}

/**
 * Searches the iTunes catalogue via the backend proxy.
 *
 * @param {string} term - The search keyword(s).
 * @param {string} [media='all'] - The media type filter.
 * @param {number} [limit=24] - Maximum number of results.
 * @returns {Promise<{ results: Object[], totalResults: number }>}
 * @throws {Error} If the search request fails.
 */
async function searchItunes(term, media = 'all', limit = 24) {
  const token = await getToken();
  const params = new URLSearchParams({ term, media, limit });

  const response = await fetch(`${API_BASE}/search?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Search request failed.');
  }

  return response.json();
}

export { searchItunes };
