import React from "react";
import { useState } from "react";
import { isOnlineBooks, handleOfflineSubmit } from "./OfflineUtils";

const AddBook = () =>{
    const [book, setBook] = useState({ id: "", title: "", author: "", yearpublished: "" });

    const handleAddBookSubmit = async(e) => {
        e.preventDefault();
        try {
            const newBook = {
                id: parseInt(book.id),
                title:book.title,
                author:book.author,
                yearpublished: parseInt(book.yearpublished)
            };
            const response = await fetch("http://localhost:3001/api/books", {
                method:"POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newBook)
            });
            console.log(response);
            window.location = "/";
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setBook((prevBook) => ({
            ...prevBook, [name]: value,
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const online = await isOnlineBooks();
        if (online) {
            handleAddBookSubmit(e);
        } else {
            handleOfflineSubmit(book);
            setTimeout(() => handleSubmit(e), 20000);
        }
    };

    return(
        <div>
            <h1>Add book</h1>
            <form onSubmit = {handleSubmit}>
                <label> ID
                    <input type="text" name="id" placeholder="Enter id" value={book.id} onChange={handleChange}></input>
                </label>
                <label> Title
                    <input type="text" name="title" placeholder="Enter title" value={book.title} onChange={handleChange}></input>
                </label>
                <label> Author
                    <input type="text" name="author" placeholder="Enter author" value={book.author} onChange={handleChange}></input>
                </label>
                <label>Publication Year
                    <input type="text" name="yearpublished" placeholder="Enter publication year" value={book.yearpublished} onChange={handleChange}></input>
                </label>
                <button type="submit">Add</button>
            </form>
        </div>
    );
};

export default AddBook;