/**
 * @fileoverview Unit tests for the /api/auth/token endpoint.
 */

'use strict';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

describe('POST /api/auth/token', () => {
  it('should return 200 with a token string', async () => {
    const res = await request(app).post('/api/auth/token');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('should return a valid JWT that can be verified', async () => {
    const res = await request(app).post('/api/auth/token');
    const { token } = res.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    expect(decoded).toHaveProperty('client', 'itunes-search-app');
  });

  it('should return a token that expires in ~24 hours', async () => {
    const res = await request(app).post('/api/auth/token');
    const decoded = jwt.decode(res.body.token);
    const hoursUntilExpiry = (decoded.exp - decoded.iat) / 3600;
    // Allow a 1-second tolerance for test execution time.
    expect(hoursUntilExpiry).toBeCloseTo(24, 0);
  });
});
