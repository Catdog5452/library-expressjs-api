module.exports = app => {
  const authors = require('../controllers/authors.controller.js');

  // Create a new Author
  app.post('/authors/create', authors.createAuthor);

  // Retrieve all Authors
  app.get('/authors', authors.getAllAuthors);

  // Retrieve a single Author by id
  app.get('/authors/:id', authors.getAuthorById);

  // Update a Author by id
  app.put('/authors/:id', authors.updateAuthorById);

  // Delete a Author by id
  app.delete('/authors/:id', authors.deleteAuthorById);

  // Delete all Authors
  app.delete('/authors', authors.deleteAllAuthors);
}