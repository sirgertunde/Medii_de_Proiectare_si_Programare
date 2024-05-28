import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const ListBooksAndReviews = () => {
    const [books, setBooks] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [userRole, setUserRole] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const fetchUserRole = () => {
          const token = localStorage.getItem("token");
          if (token) {
            try {
              const decodedToken = jwtDecode(token);
              const role = decodedToken.user.role;
              const idOfUser = decodedToken.user.id;
              setUserRole(role);
              setUserId(idOfUser);
            } catch (error) {
              console.error("Error decoding token:", error);
            }
          }
        };
        fetchUserRole();
      }, []);

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
            <thead>
              <tr>
              <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Publication year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(books) && books.map((book) => (
                <tr key={book.id}>
                    <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.yearpublished}</td>
                  <td>
                    <Link to={`/viewBook/${book.id}`}>
                      <button>View</button>
                    </Link>
                    {(userRole === "manager" && book.userid === userId) || userRole === "admin" ? (
                      <>
                        <Link to={`/editBook/${book.id}`}>
                          <button>Edit</button>
                        </Link>
                        <button onClick={()=>deleteBook(book.id)}>Delete</button>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {userRole === "manager" || userRole === "admin" ? (
            <Link to="/addBook">
                <button>Add book</button>
            </Link>
            ) : null}
          <h1>Reviews</h1>
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Text</th>
                <th>Book ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(reviews) && reviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.userid}</td>
                  <td>{review.text}</td>
                  <td>{review.bookid}</td>
                  <td>
                    <Link to={`/viewReview/${review.id}`}>
                      <button>View</button>
                    </Link>
                    {(userRole === "manager" && review.userid === userId) || userRole === "admin" ? (
                      <>
                        <Link to={`/editReview/${review.id}`}>
                          <button>Edit</button>
                        </Link>
                        <button onClick={()=>deleteReview(review.id)}>Delete</button>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {userRole === "manager" || userRole === "admin" ? (
            <Link to="/addReview">
                <button>Add review</button>
            </Link>
            ) : null}
          <br />
          <Link to="/dashboard" style={{ color: "yellow" }}>
            Dashboard
          </Link>
        </div>
      );
};

export default ListBooksAndReviews;