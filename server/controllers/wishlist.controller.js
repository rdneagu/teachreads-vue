'use strict';

const debug = require('debug')('techreads-server:WishlistController');

class WishlistController {
  constructor(rootController) {
    this.wishlist = [];
    this.rootController = rootController;

    // Binding 'this' to all the methods used in routes
    this.getWishlist = this.getWishlist.bind(this);
    this.addWishlistItem = this.addWishlistItem.bind(this);
    this.deleteWishlistItem = this.deleteWishlistItem.bind(this);

    debug('WishlistController object created');
  }

  getWishlist() {
    const overload = {
      1: (user) => {
        return this.wishlist.filter(item => (item.user === user)).map((item) => {
          const { date } = item;
          return {
            book: this.rootController.BooksController.getBookById(item.book),
            date
          };
        });
      },
      3: (req, res) => {
        const { user } = req.params;
        const result = this.getWishlist(user);
        res.status(200).send(result);
      }
    };

    if (!overload[arguments.length]) {
      throw new Error(`getWishlist with ${arguments.length} does not exist`);
    }
    return overload[arguments.length].apply(this, arguments);
  }

  addWishlistItem(req, res) {
    const { user, book, date = Date.now() } = req.body;
    this.wishlist.push({ user, book, date });
    const bookData = this.rootController.BooksController.getBookById(book);
    res.status(202).send({
      book: bookData,
      date
    });
  }

  deleteWishlistItem(req, res) {
    const { user, book } = req.params;
    const itemId = this.wishlist.findIndex(item => (item.user === user && item.book === book));
    if (itemId !== -1) {
      this.wishlist.splice(itemId, 1);
      res.status(200);
    } else {
      res.status(404);
    }
    res.send();
  }
}

module.exports = WishlistController;
