// Tests for the /books routes
const request = require('supertest');
const app = require('../app.js');
const database = require('../app/models/db.js');
let newBookId;

// Close the database connection after all tests have run
afterAll(async () => {
  database.end((error) => {
    if (error) throw error;
  });
});

// Test the GET /books route
describe("GET /books", () => {
  it("should return all books", async () => {
    const res = await request(app).get("/books");

    expect(res.statusCode).toBe(200);

    expect(res.body.length).toBeGreaterThan(0);
  });
});

// Test the GET /books route with a valid title query parameter
describe("GET /books?title=The Catcher in the Rye", () => {
  it("should return all books with the title The Catcher in the Rye", async () => {
    const res = await request(app).get("/books?title=The Catcher in the Rye");

    expect(res.statusCode).toBe(200);

    expect(res.body.length).toBeGreaterThan(0);

    expect(res.body[0].title).toBe("The Catcher in the Rye");
  });
});

// Test the GET /books route with an invalid title query parameter
describe("GET /books?title=Invalid", () => {
  it("should return no books", async () => {
    const res = await request(app).get("/books?title=Invalid");

    expect(res.statusCode).toBe(404);

    expect(res.body.message).toBe("No books found.");
  });
});

// Test the GET /books/:id route with valid id
describe("GET /books/:id", () => {
  it("should return a single book", async () => {
    const res = await request(app).get("/books/1");

    expect(res.statusCode).toBe(200);

    expect(res.body.id).toBe(1);
    expect(res.body.title).toBe("Harry Potter and the Chamber of Secrets");
    expect(res.body.author_id).toBe(29);
    expect(res.body.publish_date).toBe("1998-07-01T12:00:00.000Z");
  });
});

// Test the GET /books/:id route with invalid id
describe("GET /books/:id", () => {
  it("should return an error message", async () => {
    const res = await request(app).get("/books/0");

    expect(res.statusCode).toBe(404);

    expect(res.body.message).toBe("Book with id=0 not found.");
  });
});

// Test the POST /books/create route with 1 new book
describe("POST /books/create", () => {
  it("should create a new book", async () => {
    const res = await request(app).post("/books/create").send({
      title: "The Lord of the Rings",
      author_id: 28,
      publish_date: "1954-07-29T00:00:00.000Z"
    });

    expect(res.statusCode).toBe(201);

    expect(res.body[0]).toHaveProperty("id");
    newBookId = res.body[0].id;
    expect(res.body[0].title).toBe("The Lord of the Rings");
    expect(res.body[0].author_id).toBe(28);
    expect(res.body[0].publish_date).toBe("1954-07-29T00:00:00.000Z");
  });
});

// Test the POST /books/create route with multiple new books
describe("POST /books/create", () => {
  it("should create multiple new books", async () => {
    const res = await request(app).post("/books/create").send([
      {
        title: "The Lord of the Rings",
        author_id: 28,
        publish_date: "1954-07-29T00:00:00.000Z"
      },
      {
        title: "The Hobbit",
        author_id: 29,
        publish_date: "1937-09-21T00:00:00.000Z"
      }
    ]);

    expect(res.statusCode).toBe(201);

    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0].title).toBe("The Lord of the Rings");
    expect(res.body[0].author_id).toBe(28);
    expect(res.body[0].publish_date).toBe("1954-07-29T00:00:00.000Z");

    expect(res.body[1]).toHaveProperty("id");
    expect(res.body[1].title).toBe("The Hobbit");
    expect(res.body[1].author_id).toBe(29);
    expect(res.body[1].publish_date).toBe("1937-09-21T00:00:00.000Z");
  });
});

// Test the POST /books/create route with no request body
describe("POST /books/create", () => {
  it("should return an error message", async () => {
    const res = await request(app).post("/books/create");

    expect(res.statusCode).toBe(400);

    expect(res.body.message).toBe("Content cannot be empty!");
  });
});

// Test the POST /books/create route with an invalid body request
describe("POST /books/create", () => {
  it("should return an error message", async () => {
    const res = await request(app).post("/books/create").send({ title: "The Lord of the Rings" });

    expect(res.statusCode).toBe(400);

    expect(res.body.message).toBe("Title, Author ID, and Publish Date are required!");
  });
});

// Test the PUT /books/:id route
describe("PUT /books/:id", () => {
  it("should update a single book", async () => {
    const date = generateRandomDate(new Date(1900, 0, 1), new Date());

    const res = await request(app).put("/books/3").send({
      title: "Harry Potter and the Chamber of Secrets",
      author_id: 29,
      publish_date: date
    });

    expect(res.statusCode).toBe(201);

    expect(res.body.book.id).toBe("3");
    expect(res.body.book.title).toBe("Harry Potter and the Chamber of Secrets");
    expect(res.body.book.author_id).toBe(29);
    expect(res.body.book.publish_date).toBe(date.toISOString());
  });
});

// Test the PUT /books/:id route with invalid id
describe("PUT /books/:id", () => {
  it("should return an error message", async () => {
    const res = await request(app).put("/books/0").send({
      title: "Harry Potter and the Chamber of Secrets",
      author_id: 29,
      publish_date: "1998-07-02T00:00:00.000Z"
    });

    expect(res.statusCode).toBe(404);

    expect(res.body.message).toBe("Book with id=0 not found.");
  });
});

// Test the PUT /books/:id route with no request body
describe("PUT /books/:id", () => {
  it("should return an error message", async () => {
    const res = await request(app).put("/books/1");

    expect(res.statusCode).toBe(400);

    expect(res.body.message).toBe("Content cannot be empty!");
  });
});

// Test the PUT /books/:id route with an array request body
describe("PUT /books/:id", () => {
  it("should return an error message", async () => {
    const res = await request(app).put("/books/3").send([
      {
        title: "Harry Potter and the Chamber of Secrets",
        author: "J.K. Rowling",
        published_date: "1998-07-02T00:00:00.000Z"
      }
    ]);

    expect(res.statusCode).toBe(400);

    expect(res.body.message).toBe("Invalid request! Cannot update from an array!");
  });
});

// Test the PUT /books/:id route with an invalid body request
describe("PUT /books/:id", () => {
  it("should return an error message", async () => {
    const res = await request(app).put("/books/3").send({ title: "Harry Potter" });

    expect(res.statusCode).toBe(400);

    expect(res.body.message).toBe("Title, Author ID, and Publish Date are required!");
  });
});

// Test the DELETE /books/:id route with valid id
describe("DELETE /books/:id", () => {
  it("should delete a single book", async () => {
    const res = await request(app).delete("/books/" + newBookId);

    expect(res.statusCode).toBe(200);

    expect(res.body.message).toBe(`Book with id=${newBookId} was deleted successfully!`);

  });
});

// Test the DELETE /books/:id route with invalid id
describe("DELETE /books/:id", () => {
  it("should return an error message", async () => {
    const res = await request(app).delete("/books/0");

    expect(res.statusCode).toBe(404);

    expect(res.body.message).toBe("Book with id=0 not found.");
  });
});

// Test the DELETE /books route
// I don't actually want to test this at this point
// describe("DELETE /books", () => {
//   it("should delete all books", async () => {
//     const res = await request(app).delete("/books");

//     expect(res.statusCode).toBe(200);

//     expect(res.body.message).toBe("All books were deleted successfully!");
//   });
// });

/**
 * Generates a random date between two dates.
 * Used for testing update route.
 * 
 * @param {Date} from Earliest possible date
 * @param {Date} to Latest possible date
 * @returns {Date} Random date between from and to
 */
function generateRandomDate(from, to) {
  return new Date(
    from.getTime() +
    Math.random() * (to.getTime() - from.getTime()),
  );
}