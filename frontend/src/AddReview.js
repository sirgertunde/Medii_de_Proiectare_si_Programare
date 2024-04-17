import React from "react";
import { useState } from "react";
import { isOnlineReviews, handleOfflineSubmit } from "./OfflineUtils";

const AddReview = () =>{
    const [review, setReview] = useState({id:"", user:"", text:"", bookid:""});

    const handleAddReview = async(e) => {
        e.preventDefault();
        try {
            const newReview = {
                id: parseInt(review.id),
                user:review.user,
                text:review.text,
                bookid: parseInt(review.bookid)
            };
            const response = await fetch("http://localhost:3001/api/reviews", {
                method:"POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newReview)
            });
            console.log(response);
            window.location = "/";
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setReview((prevReview) => ({
            ...prevReview, [name]: value,
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const online = await isOnlineReviews();
        if (online) {
            handleAddReview(e);
        } else {
            handleOfflineSubmit(review);
        }
    };

    return(
        <div>
            <h1>Add review</h1>
            <form onSubmit = {handleSubmit}>
                <label> ID
                    <input type="text" name="id" placeholder="Enter id" value={review.id} onChange={handleChange}></input>
                </label>
                <label> Username
                    <input type="text" name="user" placeholder="Enter user name" value={review.user} onChange={handleChange}></input>
                </label>
                <label> Text
                    <input type="text" name="text" placeholder="Enter text" value={review.text} onChange={handleChange}></input>
                </label>
                <label>Book ID
                    <input type="text" name="bookid" placeholder="Enter book id" value={review.bookid} onChange={handleChange}></input>
                </label>
                <button type="submit">Add</button>
            </form>
        </div>
    );
};

export default AddReview;