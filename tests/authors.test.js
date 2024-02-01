// Tests for the /authors routes
const request = require('supertest');
const app = require('../app.js');
const database = require('../app/models/db.js');
let newAuthorId;

// Close the database connection after all tests have run
afterAll(async () => {
  database.end((error) => {
    if (error) throw error;
  });
});

// Test the GET /authors route
describe("GET /authors", () => {
  it("should return all authors", async () => {
    const res = await request(app).get("/authors");

    expect(res.statusCode).toBe(200);

    expect(res.body.length).toBeGreaterThan(0);
  });
});

// Test the GET /authors route with a valid first_name query parameter
describe("GET /authors?first_name=John", () => {
  it("should return all authors with the first name John", async () => {
    const res = await request(app).get("/authors?first_name=John");

    expect(res.statusCode).toBe(200);

    expect(res.body.length).toBeGreaterThan(0);

    expect(res.body[0].first_name).toBe("John");
  });
});

// Test the GET /authors route with a invalid first_name query parameter
describe("GET /authors?first_name=Invalid", () => {
  it("should return no authors", async () => {
    const res = await request(app).get("/authors?first_name=Invalid");

    expect(res.statusCode).toBe(404);

    expect(res.body.message).toBe("No authors found.");
  });
});

// Test the GET /authors/:id route with valid id
describe("GET /authors/:id", () => {
  it("should return a single author", async () => {
    const res = await request(app).get("/authors/28");

    expect(res.statusCode).toBe(200);

    expect(res.body.id).toBe(28);
    expect(res.body.first_name).toBe("John");
    expect(res.body.last_name).toBe("Doe");
    expect(res.body.birth_date).toBe("1993-02-16T11:00:00.000Z");
  });
});

// Test the GET /authors/:id route with invalid id
describe("GET /authors/:id", () => {
  it("should return an error message", async () => {
    const res = await request(app).get("/authors/0");

    expect(res.statusCode).toBe(404);

    expect(res.body.message).toBe("Author with ID 0 not found.");
  });
});

// Test the GET /authors/create route with 1 new author
describe("POST /authors/create", () => {
  it("should create a new author", async () => {
    const res = await request(app).post("/authors/create").send({
      first_name: "Jane",
      last_name: "Doe",
      birth_date: "1985-06-15T12:00:00.000Z"
    });

    expect(res.statusCode).toBe(201);

    expect(res.body[0]).toHaveProperty("id");
    newAuthorId = res.body[0].id;
    expect(res.body[0].first_name).toBe("Jane");
    expect(res.body[0].last_name).toBe("Doe");
    expect(res.body[0].birth_date).toBe("1985-06-15T12:00:00.000Z");
  });
});

// Test the GET /authors/create route with multiple new authors
describe("POST /authors/create", () => {
  it("should create multiple new authors", async () => {
    const res = await request(app).post("/authors/create").send([
      {
        first_name: "Jane",
        last_name: "Doe",
        birth_date: "1985-06-15T12:00:00.000Z"
      },
      {
        first_name: "Jack",
        last_name: "Doe",
        birth_date: "1988-07-16T12:00:00.000Z"
      }
    ]);

    expect(res.statusCode).toBe(201);

    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0].first_name).toBe("Jane");
    expect(res.body[0].last_name).toBe("Doe");
    expect(res.body[0].birth_date).toBe("1985-06-15T12:00:00.000Z");

    expect(res.body[1]).toHaveProperty("id");
    expect(res.body[1].first_name).toBe("Jack");
    expect(res.body[1].last_name).toBe("Doe");
    expect(res.body[1].birth_date).toBe("1988-07-16T12:00:00.000Z");
  });
});

// Test the GET /authors/:id route
describe("PUT /authors/:id", () => {
  it("should update a single author", async () => {
    const date = generateRandomDate(new Date(1900, 0, 1), new Date());

    const res = await request(app).put("/authors/29").send({
      first_name: "John",
      last_name: "Smith",
      birth_date: date
    });

    expect(res.statusCode).toBe(201);

    console.log(res.body);

    //expect(res.body.author.id).toBe(28);
    expect(res.body.author.first_name).toBe("John");
    expect(res.body.author.last_name).toBe("Smith");
    expect(res.body.author.birth_date).toBe(date.toISOString());
  });
});

// Test the GET /authors/:id route
describe("DELETE /authors/:id", () => {
  it("should delete a single author", async () => {
    const res = await request(app).delete("/authors/" + newAuthorId);

    expect(res.statusCode).toBe(200);

    expect(res.body.message).toBe(`Author with id: ${newAuthorId} was deleted successfully!`);

  });
});

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