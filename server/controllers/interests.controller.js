'use strict';

const debug = require('debug')('techreads-server:InterestsController');

class InterestsController {
  constructor(rootController) {
    this.interests = [];
    this.rootController = rootController;

    // Binding 'this' to all the methods used in routes
    this.getInterests = this.getInterests.bind(this);
    this.addInterest = this.addInterest.bind(this);
    this.deleteInterest = this.deleteInterest.bind(this);

    debug('InterestsController object created');
  }

  /**
   * Overloaded getInterests method: see https://stackoverflow.com/a/17137284
   *
   * 1 param: getInterests(user)
   * 3 param: getInterests(req, res, next)
   */
  getInterests() {
    const overload = {
      1: (user) => {
        return this.interests.filter(interest => (interest.user === user));
      },
      3: (req, res) => {
        const { user } = req.params;
        const result = this.getInterests(user);
        res.status(200).send(result);
      }
    };

    if (!overload[arguments.length]) {
      throw new Error(`getInterests with ${arguments.length} does not exist`);
    }
    return overload[arguments.length].apply(this, arguments);
  }

  addInterest(req, res) {
    const { user, category } = req.body;
    const data = { user, category };
    this.interests.push(data);
    res.status(202).send(data);
  }

  deleteInterest(req, res) {
    const { user, category } = req.params;
    const interestId = this.interests.findIndex(interest => (interest.user === user && interest.category === category));
    if (interestId !== -1) {
      this.interests.splice(interestId, 1);
      res.status(200);
    } else {
      res.status(404);
    }
    res.send();
  }
}

module.exports = InterestsController;
