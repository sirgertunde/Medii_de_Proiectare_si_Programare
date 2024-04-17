const request = require("supertest");
const app = require("./index");
const pool = require("./db");

jest.mock("./db", () => ({
  query: jest.fn(),
}));

describe('POST /api/books', () => {
    test('should add a new book when all required parameters are provided', async () => {
      const bookData = {
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
        yearpublished: 2022
      };
  
      pool.query.mockResolvedValueOnce({
        rows: [{ ...bookData }]
      });
  
      const response = await request(app)
        .post('/api/books')
        .send(bookData);
  
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'Book added successfully');
      expect(response.body).toHaveProperty('book');
      expect(response.body.book).toMatchObject(bookData);
  
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO books (id, title, author, yearpublished) VALUES ($1, $2, $3, $4) RETURNING *',
        [bookData.id, bookData.title, bookData.author, bookData.yearpublished]
      );
    });
});

test('GET /api/reviews', async () => {
    const response = await request(app).get('/api/reviews');
    expect(response.statusCode).toBe(200);
});

test('GET /api/books', async () => {
    const response = await request(app).get('/api/books');
    expect(response.statusCode).toBe(200);
});

test("POST /api/reviews", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, user: "TestUser", text: "Test review", bookid: 1 }],
    });
  
    const response = await request(app)
      .post("/api/reviews")
      .send({ id: 1, user: "TestUser", text: "Test review", bookid: 1 });
  
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      message: "Review added successfully",
      review: { id: 1, user: "TestUser", text: "Test review", bookid: 1 },
    });
  
    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO reviews (id, \"user\", text, bookid) VALUES ($1, $2, $3, $4) RETURNING *",
      [1, "TestUser", "Test review", 1]
    );
  });
