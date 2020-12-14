'use strict';

const BooksController = require('./book.controller');
const HistoryController = require('./history.controller');
const InterestsController = require('./interests.controller');

exports.controllers = {
  BooksController: new BooksController(this.controllers),
  HistoryController: new HistoryController(this.controllers),
  InterestsController: new InterestsController(this.controllers)
};
