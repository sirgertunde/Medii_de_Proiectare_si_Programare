const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const pool = require("./db");

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

const validateBookId = async (bookId) => {
    try {
        const response = await fetch(`http://localhost:3001/api/books/${bookId}`);
        return response.ok;
    } catch (error) {
        console.error("Error validating book ID:", error);
        return false;
    }
};

app.post("/api/reviews", async(req, res)=>{
    try {
        const {id, user, text, bookid} = req.body;
        const isBookIdValid = await validateBookId(bookid);
        if (!isBookIdValid) {
            return res.status(400).json({ error: "Invalid book ID" });
        }
        const newReview = await pool.query("INSERT INTO reviews (id, \"user\", text, bookid) VALUES ($1, $2, $3, $4) RETURNING *", [id, user, text, bookid]);
        res.status(201).json({ message: "Review added successfully", review: newReview.rows[0] });
    } catch (err) {
        console.error(err.message);
    }
})

app.post("/api/books", async(req, res)=>{
    try {
        const {id, title, author, yearpublished} = req.body;
        const newBook = await pool.query('INSERT INTO books (id, title, author, yearpublished) VALUES ($1, $2, $3, $4) RETURNING *', [id, title, author, yearpublished]);
        res.status(201).json({ message: "Book added successfully", book: newBook.rows[0] });
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/api/reviews", async (req, res)=>{
    try {
        const result = await pool.query("SELECT * FROM reviews");
        const reviews = result.rows;
        const reviewsWithIntegerFields = reviews.map(review => ({
            ...review,
            id: parseInt(review.id),
            bookid: parseInt(review.bookid)
          }));
          res.status(200).json(reviewsWithIntegerFields);
    } catch (err) {
        console.error(err.message);
    }
});

app.get("/api/books", async (req, res)=>{
    try {
        let sortOrder = "ASC";
        if (req.query.sort === "yearpublished_desc") {
            sortOrder = "DESC";
        }
        const result = await pool.query(`SELECT * FROM books ORDER BY yearpublished ${sortOrder}`);
        const books = result.rows;
        const booksWithIntegerFields = books.map(book => ({
            ...book,
            id: parseInt(book.id),
            yearpublished: parseInt(book.yearpublished)
          }));
          res.status(200).json(booksWithIntegerFields);
    } catch (err) {
        console.error(err.message);
    }
});

app.get("/api/reviews/:id", async(req, res)=>{
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query('SELECT * FROM reviews WHERE id = $1', [id])
        const review = result.rows[0];
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        res.status(200).json(review);
    } catch (err) {
        console.error(err.message);
    }
});

app.get("/api/books/:id", async(req, res)=>{
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query('SELECT * FROM books WHERE id = $1', [id])
        const book = result.rows[0];
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.status(200).json(book);
    } catch (err) {
        console.error(err.message);
    }
});

app.patch("/api/reviews/:id", async(req, res)=>{
    try {
        const id = parseInt(req.params.id);
        const {user, text, bookid} = req.body;
        const result = await pool.query('UPDATE reviews SET "user" = $1, text = $2, bookid = $3 WHERE id = $4 RETURNING *', [user, text, bookid, id]);
        const updatedReview = result.rows[0];
        if (!updatedReview) {
        console.error(`Review with ID ${id} not found.`);
        return res.status(404).json({ error: "Review not found" });
        }
        res.status(200).json({ message: "Review updated successfully", review: updatedReview });
    } catch (err) {
        console.error(err.message);
    }
});

app.patch("/api/books/:id", async(req, res)=>{
    try {
        const id = parseInt(req.params.id);
        const {title, author, yearpublished} = req.body;
        const result = await pool.query('UPDATE books SET title = $1, author = $2, yearpublished = $3 WHERE id = $4 RETURNING *', [title, author, yearpublished, id]);
        const updatedBook = result.rows[0];
        if (!updatedBook) {
        console.error(`Book with ID ${id} not found.`);
        return res.status(404).json({ error: "Book not found" });
        }
        res.status(200).json({ message: "Book updated successfully", book: updatedBook });
    } catch (err) {
        console.error(err.message);
    }
});

app.delete("/api/reviews/:id", async (req, res)=>{
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query('DELETE FROM reviews WHERE id = $1', [id]);
        if (result.rowCount === 0) {
        console.error(`Review with ID ${id} not found.`);
        return res.status(404).json({ error: "Review not found" });
        }
        res.status(204).end();
    } catch (err) {
        console.error(err.message);
    }
});

app.delete("/api/books/:id", async (req, res)=>{
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query('DELETE FROM books WHERE id = $1', [id]);
        if (result.rowCount === 0) {
        console.error(`Book with ID ${id} not found.`);
        return res.status(404).json({ error: "Book not found" });
        }
        res.status(204).end();
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(port, () => {
    console.group();
    console.log(`Server started on port ${port}`);
    console.groupEnd();
});

module.exports = app;