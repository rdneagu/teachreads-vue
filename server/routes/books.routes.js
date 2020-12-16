'use strict';

const { BooksController } = require('../controllers/_index').controllers;

exports.config = (app) => {
  /* GET all details of all books */
  app.get('/api/books', BooksController.getAllBooks);

  /* GET top 5 best rated books */
  app.get('/api/books/best', BooksController.getBestRated);

  /* GET distinct categories for books */
  app.get('/api/books/categories', BooksController.getAllCategories);

  /* GET search books */
  app.get('/api/books/search', BooksController.searchBook);

  /* GET book by id */
  app.get('/api/books/:id', BooksController.getBookById);

  /* POST add rating for book by id */
  app.post('/api/books/:id/rate', BooksController.rateBook);

  /* POST new review for book by id */
  /* body should be of the form {"reviewer":"anon", "review":"Great book"} */
  app.post('/api/books/:id/review', BooksController.reviewBook);

  /* GET books recommendations */
  app.get('/api/books/:user/recommend', BooksController.getAllRecommendations);
};
