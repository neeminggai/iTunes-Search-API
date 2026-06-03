/**
 * @fileoverview Express server entry point.
 * Configures middleware, mounts API routes, and serves the React
 * build in production mode.
 */

'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 5001;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);

// ── Production static files ───────────────────────────────────────────────────
// Serve the compiled React app when running in production.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

// ── Start server ──────────────────────────────────────────────────────────────
// Only bind the port when this file is the process entry point, not when it is
// required by tests (where supertest opens its own ephemeral connection).
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app; // Exported for supertest in tests
