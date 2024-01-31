const db = require("./db.js");

// Author Model
const Author = function (author) {
  this.first_name = author.first_name;
  this.last_name = author.last_name;
  this.birth_date = author.birth_date;
};

// Create Author
Author.createAuthor = (newAuthors, result) => {
  console.log(newAuthors);

  // Convert authors data to a format that can be inserted in a single query
  const values = newAuthors.map(author => [author.first_name, author.last_name, author.birth_date]);

  db.query("INSERT INTO authors (first_name, last_name, birth_date) VALUES ?", [values], (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
      return;
    }

    console.log("Created author(s): ", newAuthors);
    result(null, newAuthors);
  });
};

// Get All Authors
Author.getAllAuthors = (params, result) => {
  db.query(`SELECT * FROM authors ${params}`, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(null, err);
      return;
    }

    if (res.length === 0) {
      console.log("No authors found.");
      result(null, { message: "No authors found." });
      return;
    }

    console.log("Authors: ", res);
    result(null, res);
  });
};

// Get Author By ID
Author.getAuthorById = (authorId, result) => {
  db.query(`SELECT * FROM authors WHERE id = ${authorId}`, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(null, err);
      return;
    }

    if (res.length === 0) {
      console.log(`Author with ID ${authorId} not found.`);
      result(null, { message: `Author with ID ${authorId} not found.` });
      return;
    }

    console.log("Author: ", res[0]);
    result(null, res[0]);
  });
};

// Update Author By ID
Author.updateAuthorById = (authorId, author, result) => {
  db.query(
    "UPDATE authors SET first_name = ?, last_name = ?, birth_date = ? WHERE id = ?",
    [author.first_name, author.last_name, author.birth_date, authorId],
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows === 0) {
        console.log(`Author with ID ${authorId} not found.`);
        result(null, { message: `Author with ID ${authorId} not found.` });
        return;
      }

      console.log("Updated author: ", { id: authorId, ...author });
      result(null, { id: authorId, ...author });
    }
  );
};

// Delete Author By ID
Author.deleteAuthorById = (authorId, result) => {
  db.query("DELETE FROM authors WHERE id = ?", authorId, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows === 0) {
      console.log(`Author with ID ${authorId} not found.`);
      result(null, { message: `Author with ID ${authorId} not found.` });
      return;
    }

    console.log(`Deleted author with ID ${authorId}.`);
    result(null, res);
  });
};

// Delete All Authors
Author.deleteAllAuthors = (result) => {
  db.query("DELETE FROM authors", (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(null, err);
      return;
    }

    console.log(`Deleted ${res.affectedRows} authors.`);
    result(null, res);
  });
};

module.exports = Author;