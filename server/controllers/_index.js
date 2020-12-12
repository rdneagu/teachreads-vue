'use strict';

const BookController = require('./book.controller');
const HistoryController = require('./history.controller');
const InterestsController = require('./interests.controller');

exports.controllers = {
  BookController: new BookController(this.controllers),
  HistoryController: new HistoryController(this.controllers),
  InterestsController: new InterestsController(this.controllers)
};
