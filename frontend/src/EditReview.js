// import React, {useState, useEffect} from "react";
// import { useParams } from "react-router-dom";
// import { isOnlineReviews, handleOfflineSubmit } from "./OfflineUtils";

// const EditReview = () =>{
//     const { id } = useParams();
//     const [review, setReview] = useState({});

//     useEffect(() => {
//         const fetchReview = async () => {
//         try {
//             const response = await fetch(`http://localhost:3001/api/reviews/${id}`, {
//                 headers: {
//                     "Authorization": `Bearer ${localStorage.getItem("token")}`,
//                     "Content-Type": "application/json"
//                 }
//             });
//             if (!response.ok) {
//                 throw new Error('Error fetching review');
//               }
//             const data = await response.json();
//             setReview(data);
//         } catch (error) {
//             console.error('Error fetching review:', error);
//             }
//         };

//         const getProfile = async () => {
//             try {
//               const res = await fetch("http://localhost:3001/dashboard/", {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                   "Authorization": `Bearer ${localStorage.getItem("token")}`
//                 }
//               });
//               if (!res.ok) {
//                 throw new Error('Error fetching profile');
//               }
//               const parseData = await res.json();
//               setUsername(parseData.username);
//             } catch (err) {
//               console.error(err.message);
//             }
//           };

//         fetchReview();
//         getProfile();
//     }, [id]);

//     const handleChange = (event) => {
//         const { name, value } = event.target;
//         setReview((prevReview) => ({
//             ...prevReview, [name]: value,
//         }));
//     };

//     const updateReview = async(e) =>{
//         e.preventDefault();
//         try {
//             const body = {...review};
//             const response = await fetch(`http://localhost:3001/api/reviews/${review.id}`, {
//                 method:"PATCH",
//                 headers: {
//                     "Authorization": `Bearer ${localStorage.getItem("token")}`,
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(body)
//             });
//             if (!response.ok) {
//                 throw new Error('Error updating review');
//             }
//             window.location = "/booksAndReviews";
//         } catch (err) {
//             console.error(err.message);
//         }
//     };

//     const handleSubmit = async(e) => {
//         e.preventDefault();
//         const online = await isOnlineReviews();
//         if (online) {
//             updateReview(e);
//         } else {
//             handleOfflineSubmit(review);
//             setTimeout(() => handleSubmit(e), 20000);
//         }
//     };

//     return(
//         <div>
//             <h1>Edit review</h1>
//             <form >
//                 <label>User
//                     <input type="text" name="user" value={review.user} onChange={handleChange} />
//                 </label> 
//                 <label>Text
//                     <input type="text" name="text" value={review.text} onChange={handleChange}/>
//                 </label>
//                 <label>Book ID
//                     <input type="text" name="bookid" value={review.bookid} onChange={handleChange} />
//                 </label>
//                 <button type="submit" onClick={e=> handleSubmit(e)}>Save Changes</button>
//             </form>
//         </div>
//     );
// };

// export default EditReview;


import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { isOnlineReviews, handleOfflineSubmit } from "./OfflineUtils";

const EditReview = () => {
    const { id } = useParams();
    const [review, setReview] = useState({});
    // const [userRole, setUserRole] = useState("");
    // const [userId, setUserId] = useState("");

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/reviews/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                });
                if (!response.ok) {
                    throw new Error('Error fetching review');
                }
                const data = await response.json();
                setReview(data);
            } catch (error) {
                console.error('Error fetching review:', error);
            }
        };

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
                // setUserRole(parseData.role);
                // setUserId(parseData.id);
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchReview();
        getProfile();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setReview((prevReview) => ({
            ...prevReview,
            [name]: value,
        }));
    };

    const updateReview = async (e) => {
        e.preventDefault();
        try {
            const body = { ...review };
            const response = await fetch(`http://localhost:3001/api/reviews/${review.id}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                throw new Error('Error updating review');
            }
            window.location = "/booksAndReviews";
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const online = await isOnlineReviews();
        if (online) {
            updateReview(e);
        } else {
            handleOfflineSubmit(review);
            setTimeout(() => handleSubmit(e), 20000);
        }
    };
    // if (review.userid !== userId && userRole !== "admin") {
    //     return <div>You do not have permission to edit this review.</div>;
    // }

    return (
        <div>
            <h1>Edit review</h1>
            <form onSubmit={handleSubmit}>
                <label>Text
                    <input type="text" name="text" value={review.text} onChange={handleChange} />
                </label>
                <label>Book ID
                    <input type="text" name="bookid" value={review.bookid} onChange={handleChange} />
                </label>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditReview;
