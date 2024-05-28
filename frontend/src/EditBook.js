import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { isOnlineBooks, handleOfflineSubmit } from "./OfflineUtils";

const EditBook = () =>{
    const { id } = useParams();
    const [book, setBook] = useState({});

    useEffect(() => {
        const fetchBook = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/books/${id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error('Error fetching book');
              }
            const data = await response.json();
            setBook(data);
        } catch (error) {
            console.error('Error fetching book:', error);
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
            } catch (err) {
              console.error(err.message);
            }
          };

        fetchBook();
        getProfile();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setBook((prevBook) => ({
            ...prevBook, [name]: value,
        }));
    };

    const updateBook = async(e) =>{
        e.preventDefault();
        try {
            const body = {...book};
            const response = await fetch(`http://localhost:3001/api/books/${book.id}`, {
                method:"PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                throw new Error('Error updating book');
              }
            window.location = "/booksAndReviews";
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const online = await isOnlineBooks();
        if (online) {
            updateBook(e);
        } else {
            handleOfflineSubmit(book);
            setTimeout(() => handleSubmit(e), 20000);
        }
    };

    return(
        <div>
            <h1>Edit book</h1>
            <form >
                <label>Title
                    <input type="text" name="title" value={book.title} onChange={handleChange} />
                </label> 
                <label>Author
                    <input type="text" name="author" value={book.author} onChange={handleChange}/>
                </label>
                <label>Publication Year
                    <input type="text" name="yearpublished" value={book.yearpublished} onChange={handleChange} />
                </label>
                <button type="submit" onClick={e=> handleSubmit(e)}>Save Changes</button>
            </form>
        </div>
    );
};

export default EditBook;