import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";

const ViewBook = () =>{
    const { id } = useParams();
    const [book, setBook] = useState({});

    useEffect(() => {
        const fetchBook = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/books/${id}`);
            const data = await response.json();
            setBook(data);
        } catch (error) {
            console.error('Error fetching book:', error);
            }
        };
        fetchBook();
    }, [id]);

    return(
        <div>
            <h1>Book Details</h1>
            <p>ID: {book.id}</p>
            <p>Title: {book.title}</p>
            <p>Author: {book.author}</p>
            <p>Publication year: {book.yearpublished}</p>
        </div>
    );
};

export default ViewBook;