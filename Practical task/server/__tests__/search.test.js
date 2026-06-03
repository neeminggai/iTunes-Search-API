/**
 * @fileoverview Unit tests for the /api/search endpoint.
 * The iTunes API call is mocked so tests run offline and deterministically.
 */

'use strict';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const app = require('../server');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// Mock axios so we never hit the real iTunes API during tests.
jest.mock('axios');

/** Helper: create a valid JWT for use in tests. */
function makeToken() {
  return jwt.sign({ client: 'itunes-search-app' }, JWT_SECRET, { expiresIn: '1h' });
}

/** A minimal iTunes response item for testing normalisation. */
const MOCK_ITUNES_ITEM = {
  trackId: 123,
  trackName: 'Test Track',
  artistName: 'Test Artist',
  collectionName: 'Test Album',
  artworkUrl100: 'https://example.com/100x100bb.jpg',
  releaseDate: '2024-01-01T00:00:00Z',
  primaryGenreName: 'Pop',
  kind: 'song',
  trackViewUrl: 'https://itunes.apple.com/track/123',
};

describe('GET /api/search', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: { results: [MOCK_ITUNES_ITEM], resultCount: 1 },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 when no token is provided', async () => {
    const res = await request(app).get('/api/search?term=rock');
    expect(res.statusCode).toBe(401);
  });

  it('should return 403 when an invalid token is provided', async () => {
    const res = await request(app)
      .get('/api/search?term=rock')
      .set('Authorization', 'Bearer invalid.token.here');
    expect(res.statusCode).toBe(403);
  });

  it('should return 400 when the term query param is missing', async () => {
    const token = makeToken();
    const res = await request(app)
      .get('/api/search')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return results array with normalised items', async () => {
    const token = makeToken();
    const res = await request(app)
      .get('/api/search?term=test')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('results');
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results).toHaveLength(1);
  });

  it('should normalise artwork URL to 300x300', async () => {
    const token = makeToken();
    const res = await request(app)
      .get('/api/search?term=test')
      .set('Authorization', `Bearer ${token}`);

    const item = res.body.results[0];
    expect(item.artwork).toContain('300x300bb');
  });

  it('should return 502 when iTunes API call fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));
    const token = makeToken();
    const res = await request(app)
      .get('/api/search?term=test')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(502);
    expect(res.body).toHaveProperty('error');
  });

  it('should pass the media type to the iTunes API', async () => {
    const token = makeToken();
    await request(app)
      .get('/api/search?term=beatles&media=music')
      .set('Authorization', `Bearer ${token}`);

    expect(axios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({ media: 'music' }),
      })
    );
  });
});
