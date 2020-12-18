'use strict';

const debug = require('debug')('techreads-server:BooksController');
const booksData = require('../data/books.json');

class BooksController {
  constructor(rootController) {
    this.books = booksData;
    this.rootController = rootController;

    // Binding 'this' to all the methods used in routes
    this.getAllBooks = this.getAllBooks.bind(this);
    this.getAllCategories = this.getAllCategories.bind(this);
    this.getAllRecommendations = this.getAllRecommendations.bind(this);
    this.getBestRated = this.getBestRated.bind(this);
    this.getBookById = this.getBookById.bind(this);
    this.searchBook = this.searchBook.bind(this);
    this.rateBook = this.rateBook.bind(this);
    this.reviewBook = this.reviewBook.bind(this);

    debug('BooksController object created');
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

  computeData(books = []) {
    books = books.map((book) => {
      const sumRating = book.ratings.reduce((acc, val) => acc + val, 0);
      const avgRating = (sumRating / book.ratings.length) || 0;

      const nWished = this.rootController.WishlistController.wishlist.filter(w => w.book === book.id).length;
      const nRead = this.rootController.HistoryController.history.filter(h => h.book === book.id).length;

      return {
        ...book,
        avgRating,
        nRead,
        nWished
      };
    });
    return books;
  }

  findBooks(by, sort, limit = 0) {
    let result = this.computeData(this.sortBooks(this.filterBooks(this.books, by), sort));
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

  getAllRecommendations(req, res) {
    const { user } = req.params;
    const wishlist = this.rootController.WishlistController.getWishlist(user).map(wish => wish.book);
    const history = this.rootController.HistoryController.getReadHistory(user).map(read => read.book);
    const interests = this.rootController.InterestsController.getInterests(user);

    // 1. Concatenate the wishlist array with the history array
    // 2. Filter the result and keep only distinct books
    // 3. Concatenate the result with the interests arary
    // 4. Filter the result and keep only distinct categories
    const distinctInterests = wishlist
      .concat(history)
      .filter((book1, i, arr) => arr.findIndex(book2 => book1.id === book2.id) === i)
      .concat(interests)
      .filter((interest1, i, arr) => arr.findIndex(interest2 => interest1.category === interest2.category) === i);

    if (distinctInterests.length) {
      const recommendations = this.books.filter(book => distinctInterests.find(interest => interest.category === book.category))
        .sort((a, b) => b.avgRating - a.avgRating)
        .splice(0, 10);
      return res.status(200).send(this.computeData(recommendations));
    }
    return res.status(200).send();
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

  /**
   * Overloaded getBookById method: see https://stackoverflow.com/a/17137284
   *
   * 1 param: getBookById(id)
   * 3 param: getBookById(req, res, next)
   */
  getBookById() {
    const overload = {
      1: (id) => {
        return this.computeData(this.books.filter(book => book.id === id))[0];
      },
      3: (req, res) => {
        const { id = -1 } = req.params;
        const bookFound = this.getBookById(id);
        if (bookFound) {
          res.status(200);
        } else {
          res.status(404);
        }
        res.send(bookFound);
      }
    };

    if (!overload[arguments.length]) {
      throw new Error(`getInterests with ${arguments.length} does not exist`);
    }
    return overload[arguments.length].apply(this, arguments);
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
      review: req.body.review,
      date: Date.now()
    };
    const book = this.books.find(b => b.id === id);
    book.reviews.push(data);
    res.status(202).send(data);
  }
}

module.exports = BooksController;
