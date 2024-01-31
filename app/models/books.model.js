const db = require("./db.js");

// Book Model
const Book = function (book) {
  this.title = book.title;
  this.author_id = book.author_id;
  this.publish_date = book.publish_date;
};

// Create Book
Book.createBook = (newBooks, result) => {
  console.log(newBooks);

  // Convert books data to a format that can be inserted in a single query
  const values = newBooks.map(book => [book.title, book.author_id, book.publish_date]);

  db.query("INSERT INTO books (title, author_id, publish_date) VALUES ?", [values], (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
      return;
    }

    console.log("Created book(s): ", newBooks);
    result(null, newBooks);
  });
};


// Validate Author IDs
Book.validateAuthorIds = (authorIds, result) => {
  db.query(`SELECT id FROM authors WHERE id IN (${authorIds})`, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
      return;
    }

    console.log("Author IDs: ", res);
    result(null, res);
  });
};

// Get All Books
Book.getAllBooks = (params, result) => {
  db.query(`SELECT * FROM books ${params}`, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(null, err);
      return;
    }

    if (res.length === 0) {
      console.log("No books found.");
      result(null, { message: "No books found." });
      return;
    }

    console.log("Books: ", res);
    result(null, res);
  });
};

// Get Book By ID
Book.getBookById = (bookId, result) => {
  db.query(`SELECT * FROM books WHERE id = ${bookId}`, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(null, err);
      return;
    }

    if (res.length === 0) {
      console.log(`Book with ID ${bookId} not found.`);
      result(null, { message: `Book with ID ${bookId} not found.` });
      return;
    }

    console.log("Book: ", res[0]);
    result(null, res[0]);
  });
};

// Update Book By ID
Book.updateBookById = (bookId, book, result) => {
  db.query(
    "UPDATE books SET title = ?, author_id = ?, publish_date = ? WHERE id = ?",
    [book.title, book.author_id, book.publish_date, bookId],
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows === 0) {
        console.log(`Book with ID ${bookId} not found.`);
        result(null, { message: `Book with ID ${bookId} not found.` });
        return;
      }

      console.log("Updated book: ", { id: bookId, ...book });
      result(null, { id: bookId, ...book });
    }
  );
};

// Delete Book By ID
Book.deleteBookById = (bookId, result) => {
  db.query("DELETE FROM books WHERE id = ?", bookId, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows === 0) {
      console.log(`Book with ID ${bookId} not found.`);
      result(null, { message: `Book with ID ${bookId} not found.` });
      return;
    }

    console.log(`Deleted book with ID ${bookId}.`);
    result(null, res);
  });
};

// Delete All Books
Book.deleteAllBooks = result => {
  db.query("DELETE FROM books", (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(null, err);
      return;
    }

    console.log(`Deleted ${res.affectedRows} books.`);
    result(null, res);
  });
};

module.exports = Book;