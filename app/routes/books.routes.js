module.exports = app => {
  const books = require('../controllers/books.controller.js');

  // Create a new Book
  app.post('/books/create', books.createBook);

  // Retrieve all Books
  app.get('/books', books.getAllBooks);

  // Retrieve a single Book by id
  app.get('/books/:id', books.getBookById);

  // Update a Book by id
  app.put('/books/:id', books.updateBookById);

  // Delete a Book by id
  app.delete('/books/:id', books.deleteBookById);

  // Delete all Books
  app.delete('/books', books.deleteAllBooks);
}