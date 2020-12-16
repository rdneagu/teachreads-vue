'use strict';

const debug = require('debug')('techreads-server:HistoryController');

class HistoryController {
  constructor(rootController) {
    this.history = [];
    this.rootController = rootController;

    // Binding 'this' to all the methods used in routes
    this.getReadHistory = this.getReadHistory.bind(this);
    this.addReadHistory = this.addReadHistory.bind(this);
    this.deleteReadHistory = this.deleteReadHistory.bind(this);

    debug('HistoryController object created');
  }

  getReadHistory() {
    const overload = {
      1: (user) => {
        return this.history.filter(history => (history.user === user)).map(item => this.rootController.BooksController.getBookById(item.book));
      },
      3: (req, res) => {
        const { user } = req.params;
        const result = this.getReadHistory(user);
        res.status(200).send(result);
      }
    };

    if (!overload[arguments.length]) {
      throw new Error(`getWishlist with ${arguments.length} does not exist`);
    }
    return overload[arguments.length].apply(this, arguments);
  }

  addReadHistory(req, res) {
    const { user, book, date = Date.now() } = req.body;
    this.history.push({ user, book, date });
    const bookData = this.rootController.BooksController.getBookById(book);
    res.status(202).send(bookData);
  }

  deleteReadHistory(req, res) {
    const { user, book } = req.params;
    const historyId = this.history.findIndex(history => (history.user === user && history.book === book));
    if (historyId !== -1) {
      this.history.splice(historyId, 1);
      res.status(200);
    } else {
      res.status(404);
    }
    res.send();
  }
}

module.exports = HistoryController;
