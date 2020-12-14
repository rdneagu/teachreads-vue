'use strict';

const debug = require('debug')('techreads-server:InterestsController');

class InterestsController {
  constructor(rootController) {
    this.interests = [];
    this.rootController = rootController;

    // Binding 'this' to all the methods used in routes
    this.getInterests = this.getInterests.bind(this);
    this.addInterests = this.addInterests.bind(this);

    debug('InterestsController object created');
  }

  getInterests(req, res) {
    const { user } = req.params;
    const result = this.interests.filter(topic => (topic.user === user));
    res.status(200).send(result);
  }

  addInterests(req, res) {
    const { user, topic } = req.body;
    const data = { user, topic };
    this.interests.push(data);
    res.status(202).send(data);
  }
}

module.exports = InterestsController;
