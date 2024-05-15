import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import './App.css';
import AddBook from './AddBook';
import AddReview from './AddReview';
import ListBooksAndReviews from './ListBooksAndReviews';
import EditBook from './EditBook';
import EditReview from './EditReview';
import ViewBook from './ViewBook';
import ViewReview from './ViewReview';
import { isOnlineReviews } from './OfflineUtils';
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

function App() {
  const checkAuthenticated = async () => {
    try {
      const res = await fetch("http://localhost:3001/auth/verify", {
        method: "POST",
        headers: { 
          jwt_token: localStorage.token
         }
      });
      const parseRes = await res.json();
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  useEffect(() => {
    const handleNetworkStatus = () => {
      isOnlineReviews();
    };

    handleNetworkStatus();
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <Login setAuth={setAuth} />
              }
            />
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <Register setAuth={setAuth} />
              }
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard setAuth={setAuth} /> : <Navigate to="/login" />}
            />
          <Route exact path="/booksAndReviews" element={<ListBooksAndReviews/>}></Route>
          <Route exact path="/addBook" element={<AddBook/>}></Route>
          <Route exact path="/addReview" element={<AddReview/>}></Route>
          <Route exact path="/editBook/:id" element={<EditBook />} />
          <Route exact path="/editReview/:id" element={<EditReview />} />
          <Route exact path="/viewBook/:id" element ={<ViewBook/>}></Route>
          <Route exact path="/viewReview/:id" element ={<ViewReview/>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;


// import React, {useState, useEffect} from 'react';
// import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
// import './App.css';
// import AddBook from './AddBook';
// import AddReview from './AddReview';
// import ListBooksAndReviews from './ListBooksAndReviews';
// import EditBook from './EditBook';
// import EditReview from './EditReview';
// import ViewBook from './ViewBook';
// import ViewReview from './ViewReview';
// import { isOnlineReviews } from './OfflineUtils';
// import Login from './Login';
// import Register from './Register';
// import Dashboard from './Dashboard';

// function App() {
//   const checkAuthenticated = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setIsAuthenticated(false);
//         return;
//       }
//       const res = await fetch("http://localhost:3001/auth/verify", {
//         method: "POST",
//         headers: { 
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       });
//       console.log(localStorage.getItem("token"));
//       const parseRes = await res.json();
//       parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   useEffect(() => {
//     checkAuthenticated();
//   }, []);

//   useEffect(() => {
//     const handleNetworkStatus = () => {
//       isOnlineReviews();
//     };

//     handleNetworkStatus();
//   });

//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const setAuth = boolean => {
//     setIsAuthenticated(boolean);
//   };

//   return (
//     <BrowserRouter>
//       <div className="App">
//         <Routes>
//           <Route
//               path="/login"
//               element={
//                 isAuthenticated ? <Navigate to="/dashboard" /> : <Login setAuth={setAuth} />
//               }
//             />
//             <Route
//               path="/"
//               element={
//                 isAuthenticated ? <Navigate to="/dashboard" /> : <Register setAuth={setAuth} />
//               }
//             />
//             <Route
//               path="/dashboard"
//               element={isAuthenticated ? <Dashboard setAuth={setAuth} /> : <Navigate to="/login" />}
//             />
//           <Route exact path="/booksAndReviews" element={<ListBooksAndReviews/>}></Route>
//           <Route exact path="/addBook" element={<AddBook/>}></Route>
//           <Route exact path="/addReview" element={<AddReview/>}></Route>
//           <Route exact path="/editBook/:id" element={<EditBook />} />
//           <Route exact path="/editReview/:id" element={<EditReview />} />
//           <Route exact path="/viewBook/:id" element ={<ViewBook/>}></Route>
//           <Route exact path="/viewReview/:id" element ={<ViewReview/>}></Route>
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;