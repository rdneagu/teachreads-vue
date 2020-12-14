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
    res.status(200).send(result);
  }

  addReadHistory(req, res) {
    const { user, book, date = Date.now() } = req.body;
    const data = { user, book, date };
    this.history.push(data);
    res.status(202).send(data);
  }
}

module.exports = HistoryController;
