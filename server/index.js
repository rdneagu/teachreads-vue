'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');
const debug = require('debug')('techreads-server:index');

// Load custom routes
const { booksRoutes, historyRoutes, interestsRoutes } = require('./routes/_index');

const app = express();
app.use(logger('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// Include the custom routes for our API
booksRoutes.config(app);
historyRoutes.config(app);
interestsRoutes.config(app);

// Only deal with index.html, Vue routing will handle 404 links
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

const port = parseInt(process.env.PORT || '3000');
app.listen(port);

debug(`Server is listening on port ${port}`);
