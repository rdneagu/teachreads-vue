'use strict';

const debug = require('debug')('techreads-server:WishlistController');

class WishlistController {
  constructor(rootController) {
    this.wishlist = [];
    this.rootController = rootController;

    // Binding 'this' to all the methods used in routes
    this.getWishlist = this.getWishlist.bind(this);
    this.addToWishlist = this.addToWishlist.bind(this);

    debug('WishlistController object created');
  }

  getWishlist(req, res) {
    const { user } = req.params;
    const result = this.wishlist.filter(book => (book.user === user));
    res.status(200).send(result);
  }

  addToWishlist(req, res) {
    const { user, book } = req.body;
    const data = { user, book };
    this.wishlist.push(data);
    res.status(202).send(data);
  }
}

module.exports = WishlistController;
