const Book = require("../models/books.model.js");

// Create and Save a new Book
exports.createBook = (req, res) => {
  // Validate request
  if (Array.isArray(req.body)) {
    for (let i = 0; i < req.body.length; i++) {
      if (!req.body[i] || Object.keys(req.body[i]).length === 0) {
        res.status(400).send({ message: "Content cannot be empty!" });
        return;
      }
    }
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "Content cannot be empty!" });
    return;
  }

  let books = [];
  if (Array.isArray(req.body)) {
    // If the request body is an array, handle each object separately
    books = req.body.map(bookData => ({
      title: bookData.title,
      author_id: bookData.author_id,
      publish_date: bookData.publish_date
    }));
  } else {
    // If the request body is a single object, create a single book
    books.push({
      title: req.body.title,
      author_id: req.body.author_id,
      publish_date: req.body.publish_date,
    });
  }

  // Validate that each book has a title, author_id, and publish_date
  for (let i = 0; i < books.length; i++) {
    if (!books[i].title || !books[i].author_id || !books[i].publish_date) {
      res.status(400).send({ message: "Title, Author ID, and Publish Date are required!" });
      return;
    }
  }

  // Validate each book has an author_id that exists in the database
  const authorIds = books.map(book => book.author_id);

  Book.validateAuthorIds(authorIds, (err, data) => {
    if (err) res.status(500).send({ message: err.message || "Some error occurred while validating the Author IDs." });
    else if (data.length !== authorIds.length) res.status(400).send({ message: "Some Author IDs do not exist in the database." });
  });

  console.log(books);

  // Save Books in the database
  Book.createBook(books, (err, data) => {
    if (err) res.status(500).send({ message: err.message || "Some error occurred while creating the Book." });
    else res.send(data);
  });
};

// Retrieve all Books from the database.
exports.getAllBooks = (req, res) => {
  let params = "";

  if (req.query.title) {
    params += `WHERE title LIKE '%${req.query.title}%'`;
  }

  if (req.query.author_id) {
    if (params) {
      params += ` AND author_id = ${req.query.author_id}`;
    } else {
      params += `WHERE author_id = ${req.query.author_id}`;
    }
  }

  Book.getAllBooks(params, (err, data) => {
    if (err) res.status(500).send({ message: err.message || "Some error occurred while retrieving books." });
    else res.send(data);
  });
};

// Find a single Book with an id
exports.getBookById = (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send({ message: "ID cannot be empty!" });
    return;
  }

  Book.getBookById(id, (err, data) => {
    if (err) res.status(500).send({ message: err.message || `Error retrieving Book with id=${id}.` });
    else res.send(data);
  });
};

// Update a Book by the id in the request
exports.updateBookById = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty!" });
    return;
  }

  const id = req.params.id;

  if (!id) {
    res.status(400).send({ message: "ID cannot be empty!" });
    return;
  }

  Book.updateBookById(id, new Book(req.body), (err, data) => {
    if (err) res.status(500).send({ message: err.message || `Error updating Book with id=${id}.` });
    else res.send(data);
  });
};

// Delete a Book with the specified id in the request
exports.deleteBookById = (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send({ message: "ID cannot be empty!" });
    return;
  }

  Book.deleteBookById(id, (err, data) => {
    if (err) res.status(500).send({ message: err.message || `Error deleting Book with id=${id}.` });
    else res.send(data);
  });
};

// Delete all Books from the database.
exports.deleteAllBooks = (req, res) => {
  Book.deleteAllBooks((err, data) => {
    if (err) res.status(500).send({ message: err.message || "Some error occurred while deleting all books." });
    else res.send(data);
  });
};