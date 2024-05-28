const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const pool = require("./db");
const { authorize, authorizeRoles } = require("./authorize");

dotenv.config();

const app = express();
const port = process.env.PORT;

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/auth", require("./jwtAuth"));
app.use("/dashboard", require("./dashboard"));

app.get("/api/reviews", authorize, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM reviews");
        const reviews = result.rows.map(review => ({
            ...review,
            id: parseInt(review.id),
            userid:parseInt(review.userid),
            bookid: parseInt(review.bookid)
        }));
        res.status(200).json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/books", authorize, async (req, res) => {
    try {
        let sortOrder = "ASC";
        if (req.query.sort === "yearpublished_desc") {
            sortOrder = "DESC";
        }
        const result = await pool.query(`SELECT * FROM books ORDER BY yearpublished ${sortOrder}`);
        const books = result.rows.map(book => ({
            ...book,
            id: parseInt(book.id),
            yearpublished: parseInt(book.yearpublished),
            userid: parseInt(book.userid)
        }));
        res.status(200).json(books);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/reviews/:id", authorize, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query('SELECT * FROM reviews WHERE id = $1', [id]);
        const review = result.rows[0];
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        res.status(200).json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/books/:id", authorize, async (req, res) => {
    try {
        const bookId = parseInt(req.params.id);
        const result = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);
        const book = result.rows[0];
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.status(200).json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/reviews", authorize, authorizeRoles("manager", "admin"), async (req, res) => {
    try {
        const { id, text, bookid } = req.body;
        const userid = req.user.id;
        const newReview = await pool.query("INSERT INTO reviews (id, userid, text, bookid) VALUES ($1, $2, $3, $4) RETURNING *", [id, userid, text, bookid]);
        res.status(201).json({ message: "Review added successfully", review: newReview.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/books", authorize, authorizeRoles("manager", "admin"), async (req, res) => {
    try {
        const { id, title, author, yearpublished } = req.body;
        const userid = req.user.id;
        const newBook = await pool.query('INSERT INTO books (id, title, author, yearpublished, userid) VALUES ($1, $2, $3, $4, $5) RETURNING *', [id, title, author, yearpublished, userid]);
        res.status(201).json({ message: "Book added successfully", book: newBook.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.patch("/api/reviews/:id", authorize, authorizeRoles("manager", "admin"), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { userid, text, bookid } = req.body;
        const result = await pool.query('UPDATE reviews SET "userid" = $1, text = $2, bookid = $3 WHERE id = $4 RETURNING *', [userid, text, bookid, id]);
        const updatedReview = result.rows[0];
        if (!updatedReview) {
            return res.status(404).json({ error: "Review not found" });
        }
        res.status(200).json({ message: "Review updated successfully", review: updatedReview });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.patch("/api/books/:id", authorize, authorizeRoles("manager", "admin"), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, author, yearpublished } = req.body;
        const book = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
        if (req.user.role === 'manager' && book.rows[0].userid !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        const result = await pool.query('UPDATE books SET title = $1, author = $2, yearpublished = $3 WHERE id = $4 RETURNING *', [title, author, yearpublished, id]);
        const updatedBook = result.rows[0];
        res.status(200).json({ message: "Book updated successfully", book: updatedBook });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.delete("/api/reviews/:id", authorize, authorizeRoles("manager", "admin"), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query('DELETE FROM reviews WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Review not found" });
        }
        res.status(204).end();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.delete("/api/books/:id", authorize, authorizeRoles("manager", "admin"), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const book = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
        if (req.user.role === 'manager' && book.rows[0].userid !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        const result = await pool.query('DELETE FROM books WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.status(204).end();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/users", authorize, authorizeRoles("admin"), async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM users");
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server error" });
    }
  });
  
app.patch("/api/users/:id/role", authorize, authorizeRoles("admin"), async (req, res) => {
    try {
      const { role } = req.body;
      const { id } = req.params;
      const result = await pool.query("UPDATE users SET role = $1 WHERE id = $2 RETURNING *", [role, id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ message: "Role updated successfully", user: result.rows[0] });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server error" });
    }
  });
  
app.listen(port, () => {
    console.group();
    console.log(`Server started on port ${port}`);
    console.groupEnd();
});

module.exports = app;
