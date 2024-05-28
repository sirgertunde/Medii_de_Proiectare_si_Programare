// import React from "react";
// import { useState, useEffect } from "react";
// import { isOnlineReviews, handleOfflineSubmit } from "./OfflineUtils";

// const AddReview = () =>{
//     const [username, setUserName] = useState("");
//     const [review, setReview] = useState({id:"", user:"", text:"", bookid:""});

//     const getProfile = async () => {
//         try {
//           const res = await fetch("http://localhost:3001/dashboard/", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${localStorage.getItem("token")}`
//             }
//           });
//           if (!res.ok) {
//             throw new Error('Error fetching profile');
//           }
//           const parseData = await res.json();
//           setUserName(parseData.username);
//         } catch (err) {
//           console.error(err.message);
//         }
//       };

//     useEffect(() => {
//         getProfile();
//     }, []);

//     const handleAddReview = async(e) => {
//         e.preventDefault();
//         try {
//             const newReview = {
//                 id: parseInt(review.id),
//                 user:username,
//                 text:review.text,
//                 bookid: parseInt(review.bookid)
//             };
//             const isBookIdValid = await validateBookId(newReview.bookid, localStorage.getItem("token"));
//             if (!isBookIdValid) {
//                 alert("Invalid book ID");
//                 return;
//             }
//             const response = await fetch("http://localhost:3001/api/reviews", {
//                 method:"POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${localStorage.getItem("token")}`
//                 },
//                 body: JSON.stringify(newReview)
//             });
//             if (!response.ok) {
//                 throw new Error('Error adding review');
//               }
//             window.location = "/booksAndReviews";
//         } catch (err) {
//             console.error(err.message);
//         }
//     };

//     const validateBookId = async (bookId, token) => {
//         try {
//             const response = await fetch(`http://localhost:3001/api/books/${bookId}`, {
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             });
//             return response.ok;
//         } catch (error) {
//             console.error("Error validating book ID:", error);
//             return false;
//         }
//     };

//     const handleChange = (event) => {
//         const { name, value } = event.target;
//         setReview((prevReview) => ({
//             ...prevReview, [name]: value,
//         }));
//     };

//     const handleSubmit = async(e) => {
//         e.preventDefault();
//         const online = await isOnlineReviews();
//         if (online) {
//             handleAddReview(e);
//         } else {
//             handleOfflineSubmit(review);
//             setTimeout(() => handleSubmit(e), 20000);
//         }
//     };

//     return(
//         <div>
//             <h1>Add review</h1>
//             <form onSubmit = {handleSubmit}>
//                 <label> ID
//                     <input type="text" name="id" placeholder="Enter id" value={review.id} onChange={handleChange}></input>
//                 </label>
//                 <label> Username
//                     <input type="text" name="user" placeholder="Enter user name" value={username}></input>
//                 </label>
//                 <label> Text
//                     <input type="text" name="text" placeholder="Enter text" value={review.text} onChange={handleChange}></input>
//                 </label>
//                 <label>Book ID
//                     <input type="text" name="bookid" placeholder="Enter book id" value={review.bookid} onChange={handleChange}></input>
//                 </label>
//                 <button type="submit">Add</button>
//             </form>
//         </div>
//     );
// };

// export default AddReview;

import React, { useState, useEffect } from "react";
import { isOnlineReviews, handleOfflineSubmit } from "./OfflineUtils";

const AddReview = () => {
    const [userid, setUserId] = useState("");
    const [review, setReview] = useState({ id: "", text: "", bookid: "" });

    const getProfile = async () => {
        try {
            const res = await fetch("http://localhost:3001/dashboard/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!res.ok) {
                throw new Error('Error fetching profile');
            }
            const parseData = await res.json();
            setUserId(parseData.id);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    const handleAddReview = async (e) => {
        e.preventDefault();
        try {
            const newReview = {
                id: parseInt(review.id),
                userid,
                text: review.text,
                bookid: parseInt(review.bookid)
            };
            const isBookIdValid = await validateBookId(newReview.bookid, localStorage.getItem("token"));
            if (!isBookIdValid) {
                alert("Invalid book ID");
                return;
            }
            const response = await fetch("http://localhost:3001/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(newReview)
            });
            if (!response.ok) {
                throw new Error('Error adding review');
            }
            window.location = "/booksAndReviews";
        } catch (err) {
            console.error(err.message);
        }
    };

    const validateBookId = async (bookId, token) => {
        try {
            const response = await fetch(`http://localhost:3001/api/books/${bookId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response.ok;
        } catch (error) {
            console.error("Error validating book ID:", error);
            return false;
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setReview((prevReview) => ({
            ...prevReview,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const online = await isOnlineReviews();
        if (online) {
            handleAddReview(e);
        } else {
            handleOfflineSubmit({ ...review, userid });
            setTimeout(() => handleSubmit(e), 20000);
        }
    };

    return (
        <div>
            <h1>Add review</h1>
            <form onSubmit={handleSubmit}>
                <label> ID
                    <input type="text" name="id" placeholder="Enter id" value={review.id} onChange={handleChange}></input>
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
