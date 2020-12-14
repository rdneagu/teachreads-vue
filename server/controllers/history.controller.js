'use strict';

const debug = require('debug')('techreads-server:HistoryController');

class HistoryController {
  constructor(rootController) {
    this.history = [];
    this.rootController = rootController;

    // Binding 'this' to all the methods used in routes
    this.getReadHistory = this.getReadHistory.bind(this);
    this.addReadHistory = this.addReadHistory.bind(this);

    debug('HistoryController object created');
  }

  getReadHistory(req, res) {
    const { user } = req.params;
    const result = this.history.filter(read => (read.user === user));
    if (result.length) {
      res.status(200);
    } else {
      res.status(404);
    }
    res.send(result);
  }

  addReadHistory(req, res) {
    const { user = 'Anonymous User', book, date = Date.now() } = req.body;
    this.history.push({ user, book, date });
    res.status(202).send();
  }
}

module.exports = HistoryController;
