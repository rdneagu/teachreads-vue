'use strict';

const { BookController } = require('../controllers/_index').controllers;

exports.config = (app) => {
  /* GET all details of all books */
  app.get('/books', BookController.getAllBooks);

  /* GET distinct categories for books */
  app.get('/books/categories', BookController.getAllCategories);

  /* GET search books */
  app.get('/books/search', BookController.searchBook);

  /* GET book by id */
  app.get('/books/:id', BookController.getBookById);

  /* POST add rating for book by id */
  app.post('/books/:id/rate', BookController.rateBook);

  /* POST new review for book by id */
  /* body should be of the form {"reviewer":"anon", "review":"Great book"}  */
  app.post('/books/:id/review', BookController.reviewBook);
};
