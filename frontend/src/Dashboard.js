import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Dashboard = ({ setAuth }) => {
  const [username, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchUserRole = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const role = decodedToken.user.role;
          const idOfUser = decodedToken.user.id;
          setUserRole(role);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };
    fetchUserRole();
  }, []);

  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:3001/dashboard/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      const parseData = await res.json();
      setUserName(parseData.username);
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProfile();
    console.log(userRole);
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome {username}</h2>
      <button onClick={e => logout(e)}>
        Logout
      </button>
      <br></br>
      <Link to="/booksAndReviews" style={{ color: 'yellow' }}>See books and reviews</Link>
      <br></br>
      {userRole === "admin" ? (
            <Link to="/admin" style={{ color: 'yellow' }}>Go to admin panel</Link>
      ) : null}
    </div>
  );
};

export default Dashboard;