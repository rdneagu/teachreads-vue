'use strict';

const BooksController = require('./book.controller');
const HistoryController = require('./history.controller');
const InterestsController = require('./interests.controller');
const WishlistController = require('./wishlist.controller');

class Controllers {
  constructor() {
    this.BooksController = new BooksController(this);
    this.HistoryController = new HistoryController(this);
    this.InterestsController = new InterestsController(this);
    this.WishlistController = new WishlistController(this);
  }
}

exports.controllers = new Controllers();
