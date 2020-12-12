'use strict';

const debug = require('debug')('techreads-server:BookController');
const booksData = require('../data/books.json');

class BookController {
  constructor(rootController) {
    this.books = booksData;
    this.rootController = rootController;

    // Binding 'this' to all the methods used in routes
    this.getAllBooks = this.getAllBooks.bind(this);
    this.getAllCategories = this.getAllCategories.bind(this);
    this.getBookById = this.getBookById.bind(this);
    this.searchBook = this.searchBook.bind(this);
    this.rateBook = this.rateBook.bind(this);
    this.reviewBook = this.reviewBook.bind(this);
  }

  findBooks(by = [{ field: 'id', value: 0 }]) {
    const conditionArr = by.map((condition) => {
      if (Object.keys(this.books).indexOf(condition.field) !== -1) {
        throw new Error(`Field ${condition.field} could not be found in books object`);
      }
      const regex = new RegExp(condition.value, 'i');
      return `(JSON.stringify(book.${condition.field}).search(${regex}) !== -1)`;
    });
    debug(`this.books.filter(book => ${conditionArr.join(' || ')})`);
    return eval(`this.books.filter(book => ${conditionArr.join(' || ')})`);
  }

  getAllBooks(_, res) {
    if (this.books.length) {
      res.status(200);
    } else {
      res.status(404);
    }
    res.send(this.books);
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

  getBookById(req, res) {
    const { id } = req.params;
    const booksFound = this.findBooks([{ field: 'id', value: id || -1 }]);
    if (booksFound.length) {
      res.status(200);
    } else {
      res.status(404);
    }
    res.send(booksFound);
  }

  searchBook(req, res) {
    let { search } = req.query;

    // If the type of the query is a string (passed through URL with ?search=text)
    // then fallback to searching title and description using the value provided
    if (typeof (search) === 'string') {
      search = [
        { field: 'title', value: search },
        { field: 'description', value: search }
      ];
    }

    if (search.length) {
      try {
        const booksFound = this.findBooks(search);
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
    res.status(404).send();
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
    const { reviewer, review } = req.body;
    const book = this.books.find(b => b.id === id);
    book.reviews.push(reviewer, review);
    res.status(202).send(book);
  }
}

module.exports = BookController;
