'use strict';

const { WishlistController } = require('../controllers/_index').controllers;

exports.config = (app) => {
  // /* GET wishlist by user */
  app.get('/api/wishlist/:user', WishlistController.getWishlist);

  // /* POST new item in wishlist by user */
  // /* body should be of the form {"user":"anon", "book":1} */
  app.post('/api/wishlist/add', WishlistController.addToWishlist);
};
