import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

const ListBooksAndReviews = () => {
    const [books, setBooks] = useState([]);
    const [reviews, setReviews] = useState([]);
    
    const getBooks = async () =>{
        try {
            const response = await fetch("http://localhost:3001/api/books?sort=yearpublished_asc", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
            });
            const jsonData = await response.json();
            setBooks(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    const getReviews = async () =>{
        try {
            const response = await fetch("http://localhost:3001/api/reviews", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
            });
            const jsonData = await response.json();
            setReviews(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(()=>{
        getBooks();
        getReviews();
    }, []);

    const deleteBook = async(id)=>{
        try {
            id = parseInt(id);
            const bookToDelete = await fetch(`http://localhost:3001/api/books/${id}`,{
                method:"DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            setBooks(books.filter(book => book.id !== id));
        } catch (err) {
            console.error(err.message)
        }
    };
    
    const deleteReview = async(id)=>{
        try {
            id = parseInt(id);
            const reviewToDelete = await fetch(`http://localhost:3001/api/reviews/${id}`,{
                method:"DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            setReviews(reviews.filter(review => review.id !== id));
        } catch (err) {
            console.error(err.message)
        }
    };

    return (
        <div>
            <h1>Books</h1>
            <table>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Publication year</th>
                    <th>Actions</th>
                </tr>
                {Array.isArray(books) && books.map(book =>
                    <tr>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.yearpublished}</td>
                        <td>
                            <Link to={`/editBook/${book.id}`}><button>Edit</button></Link>
                            <button onClick={()=>deleteBook(parseInt(book.id))}>Delete</button>
                            <Link to={`/viewBook/${book.id}`}><button>View</button></Link>
                        </td>
                    </tr>
                    )
                }
            </table>
            <Link to="/addBook">
                <button>Add book</button>
            </Link>
            <h1>Reviews</h1>
            <table>
                <tr>
                    <th>Username</th>
                    <th>Text</th>
                    <th>Book id</th>
                    <th>Actions</th>
                </tr>
                {Array.isArray(reviews) && reviews.map(review =>
                    <tr>
                        <td>{review.user}</td>
                        <td>{review.text}</td>
                        <td>{review.bookid}</td>
                        <td>
                            <Link to={`/editReview/${review.id}`}><button>Edit</button></Link>
                            <button onClick={()=>deleteReview(review.id)}>Delete</button>
                            <Link to={`/viewReview/${review.id}`}><button>View</button></Link>
                        </td>
                    </tr>
                    )
                }
            </table>
            <Link to="/addReview">
                <button>Add review</button>
            </Link>
            <br></br>
            <Link to="/dashboard" style={{ color: 'yellow' }}>Dashboard</Link>
        </div>
    );
};

export default ListBooksAndReviews;