'use strict';

class InterestsController {
  constructor(rootController) {
    this.interests = [];
    this.rootController = rootController;

    // Binding 'this' to all the methods used in routes
    this.getInterests = this.getInterests.bind(this);
    this.addInterests = this.addInterests.bind(this);
  }

  getInterests(req, res) {
    const { user } = req.params;
    const result = this.interests.filter(topic => (topic.user === user));
    if (result.length) {
      res.status(200);
    } else {
      res.status(404);
    }
    res.send(result);
  }

  addInterests(req, res) {
    const { user = 'Anonymous User', topic } = req.body;
    this.interests.push({ user, topic });
    res.status(202).send();
  }
}

module.exports = InterestsController;
