'use strict';

const debug = require('debug')('techreads-server:BooksController');
const booksData = require('../data/books.json');

class BooksController {
  constructor(rootController) {
    this.books = booksData;
    this.rootController = rootController;

    this.generateAvgRating();

    // Binding 'this' to all the methods used in routes
    this.getAllBooks = this.getAllBooks.bind(this);
    this.getAllCategories = this.getAllCategories.bind(this);
    this.getBestRated = this.getBestRated.bind(this);
    this.getBookById = this.getBookById.bind(this);
    this.searchBook = this.searchBook.bind(this);
    this.rateBook = this.rateBook.bind(this);
    this.reviewBook = this.reviewBook.bind(this);

    debug('BooksController object created');
  }

  generateAvgRating() {
    for (let i = 0; i < this.books.length; i++) {
      const sumRating = this.books[i].ratings.reduce((acc, val) => acc + val, 0);
      const avgRating = (sumRating / this.books[i].ratings.length) || 0;

      this.books[i].avgRating = avgRating;
    }
  }

  isFieldValid(field) {
    if (Object.keys(this.books).indexOf(field) !== -1) {
      throw new Error(`Field '${field}' could not be found in books object`);
    }
    return true;
  }

  filterBooks(books = [], filter) {
    // If the type of the query is a string (passed through a HTTP request)
    // Attempt to parse it as JSON, if it fails default to quick search
    if (typeof (filter) === 'string') {
      try {
        filter = JSON.parse(filter);
      } catch (err) {
        filter = {
          title: filter,
          description: filter
        };
      }
    }
    if (typeof (filter) === 'object') {
      const keys = Object.keys(filter);
      const condition = [];
      keys.forEach((field) => {
        // Sanitize the key: value to make sure no JS is injected
        this.isFieldValid(field);
        const regex = new RegExp(filter[field], 'i');
        condition.push(`(JSON.stringify(book.${field}).search(${regex}) !== -1)`);
      });
      debug(`books.filter(book => ${condition.join(' || ')})`);
      return eval(`books.filter(book => ${condition.join(' || ')})`);
    }
    return books;
  }

  // eslint-disable-next-line class-methods-use-this
  sortBooks(books = [], sort) {
    if (sort) {
      return books.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
    }
    return books;
  }

  findBooks(by, sort, limit = 0) {
    let result = this.sortBooks(this.filterBooks(this.books, by), sort);
    return (limit) ? result.slice(0, limit) : result;
  }

  getAllBooks(req, res) {
    const { limit } = req.params;
    const books = this.findBooks(undefined, true, limit);
    if (books.length) {
      res.status(200);
    } else {
      res.status(404);
    }
    res.send(books);
  }

  getAllCategories(_, res) {
    const categories = this.books.map(book => book.category).filter((val, id, arr) => arr.indexOf(val) === id);
    if (categories.length) {
      res.status(200);
    } else {
      res.status(404);
    }
    res.send(categories);
  }

  getBestRated(_, res) {
    const bestRated = this.books.sort((a, b) => b.avgRating - a.avgRating);
    if (bestRated.length) {
      res.status(200);
    } else {
      res.status(404);
    }
    res.send(bestRated.slice(0, 5));
  }

  getBookById(req, res) {
    const { id = -1 } = req.params;
    const bookFound = this.books.find(book => book.id === id);
    if (bookFound) {
      res.status(200);
    } else {
      res.status(404);
    }
    res.send(bookFound);
  }

  searchBook(req, res) {
    let { search, limit } = req.query;
    try {
      const booksFound = this.findBooks(search, true, limit);
      if (booksFound.length) {
        res.status(200);
      } else {
        res.status(404);
      }
      res.send(booksFound);
    } catch (err) {
      res.status(500).send('Invalid field specified');
    }
  }

  rateBook(req, res) {
    const { id } = req.params;
    const { rating } = req.body;
    const book = this.books.find(b => b.id === id);
    book.ratings.push(rating);
    res.status(202).send(book);
  }

  reviewBook(req, res) {
    const { id } = req.params;
    const data = {
      reviewer: (req.body.reviewer.length) ? req.body.reviewer : 'Anonymous User',
      review: req.body.review
    };
    const book = this.books.find(b => b.id === id);
    book.reviews.push(data);
    res.status(202).send(data);
  }
}

module.exports = BooksController;
