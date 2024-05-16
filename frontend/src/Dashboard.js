import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = ({ setAuth }) => {
  const [username, setUserName] = useState("");

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
    </div>
  );
};

export default Dashboard;