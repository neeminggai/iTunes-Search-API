/**
 * @fileoverview Authentication routes.
 * Provides a single endpoint that issues a short-lived JWT to any
 * client that requests it. The token is then required for all
 * protected API calls (e.g. /api/search).
 *
 * No user credentials are involved – the token simply authorises
 * access to the backend API layer.
 */

'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

/**
 * POST /api/auth/token
 * Issues a JWT valid for 24 hours.
 *
 * Response JSON: { token: string }
 */
router.post('/token', (req, res) => {
  const payload = { client: 'itunes-search-app' };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  return res.status(200).json({ token });
});

module.exports = router;
