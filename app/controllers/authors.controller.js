const Author = require("../models/authors.model.js");

// Create and Save a new Author
exports.createAuthor = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty!" });
    return;
  }

  let authors = [];
  if (Array.isArray(req.body)) {
    // If the request body is an array, handle each object separately
    authors = req.body.map(authorData => ({
      first_name: authorData.first_name,
      last_name: authorData.last_name,
      birth_date: authorData.birth_date
    }));
  } else {
    // If the request body is a single object, create a single author
    authors.push({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      birth_date: req.body.birth_date,
    });
  }

  console.log(authors);

  // Save Authors in the database
  Author.createAuthor(authors, (err, data) => {
    if (err) res.status(500).send({ message: err.message || "Some error occurred while creating the Author." });
    else res.status(201).send(data);
  });
};

// Retrieve all Authors from the database.
exports.getAllAuthors = (req, res) => {
  let params = "";

  if (req.query.first_name) {
    params += `WHERE first_name LIKE '%${req.query.first_name}%'`;
  }

  if (req.query.last_name) {
    if (params) {
      params += ` AND last_name LIKE '%${req.query.last_name}%'`;
    } else {
      params += `WHERE last_name LIKE '%${req.query.last_name}%'`;
    }
  }

  Author.getAllAuthors(params, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving authors." });
    } else if (data.message) {
      res.status(404).send(data);
    } else {
      res.status(200).send(data);
    }
  });
};

// Find a single Author with an id
exports.getAuthorById = (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send({ message: "Content cannot be empty!" });
    return;
  }

  Author.getAuthorById(id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") res.status(404).send({ message: `Not found Author with id ${req.params.authorId}.` });
      else res.status(500).send({ message: "Error retrieving Author with id " + req.params.authorId });
    } else res.send(data);
  });
};

// Update a Author identified by the authorId in the request
exports.updateAuthorById = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty!" });
    return;
  }

  const id = req.params.id;

  if (!id) {
    res.status(400).send({ message: "Content cannot be empty!" });
    return;
  }

  const author = new Author({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    birth_date: req.body.birth_date,
  });

  Author.updateAuthorById(id, author, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: `Not found Author with id ${req.params.authorId}.` });
      } else {
        res.status(500).send({ message: "Error updating Author with id " + req.params.authorId });
      }
    } else {
      res.status(201).send({ message: "Author was updated successfully!", author: author });
    }
  });
};

// Delete a Author with the specified authorId in the request
exports.deleteAuthorById = (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send({ message: "Content cannot be empty!" });
    return;
  }

  Author.deleteAuthorById(id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: `Not found Author with id ${id}.` });
      } else {
        res.status(500).send({ message: "Could not delete Author with id " + id });
      }
    } else {
      res.status(200).send({ message: `Author with id: ${id} was deleted successfully!` });
    }
  });
}

// Delete all Authors from the database.
exports.deleteAllAuthors = (req, res) => {
  Author.deleteAllAuthors((err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error occurred while removing all authors." });
    }
    else {
      res.status(200).send({ message: `All authors were deleted successfully!` });
    }
  });
};