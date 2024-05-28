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
import AdminPanel from "./AdminPanel";
import { jwtDecode } from 'jwt-decode';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  const checkAuthenticated = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      const res = await fetch("http://localhost:3001/auth/verify", {
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
      });
      const parseRes = await res.json();
      if (parseRes) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const fetchUserRole = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const role = decodedToken.user.role;
          setUserRole(role);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    checkAuthenticated();
  }, []);

  useEffect(() => {
    const handleNetworkStatus = () => {
      isOnlineReviews();
    };

    handleNetworkStatus();
  }, []);

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
          {/* <Route exact path="/admin"
              element={
                isAuthenticated && userRole === "admin" ? (
                  <AdminPanel />
                ) : (
                  <Navigate to="/login" />
                )}
            /> */}
            <Route exact path="/admin" element ={<AdminPanel/>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;