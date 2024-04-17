import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";

const ViewReview = () =>{
    const { id } = useParams();
    const [review, setReview] = useState({});

    useEffect(() => {
        const fetchReview = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/reviews/${id}`);
            const data = await response.json();
            setReview(data);
        } catch (error) {
            console.error('Error fetching review:', error);
            }
        };
        fetchReview();
    }, [id]);

    return(
        <div>
            <h1>Review Details</h1>
            <p>ID: {review.id}</p>
            <p>Username: {review.user}</p>
            <p>Text: {review.text}</p>
            <p>Book ID: {review.bookid}</p>
        </div>
    );
};

export default ViewReview;