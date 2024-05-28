import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = ({ setAuth }) => {
  const [inputs, setInputs] = useState({email: "", password: "", username: ""});
  const { email, password, username } = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { email, password, username };
      const response = await fetch("http://localhost:3001/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );
      const parseRes = await response.json();
      if (parseRes.jwtToken) {
        localStorage.setItem("token", parseRes.jwtToken);
        setAuth(true);
      } else {
        setAuth(false);
        alert(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form>
        <input
          type="text"
          name="email"
          value={email}
          placeholder="email"
          onChange={e => onChange(e)}
        />
        <input
          type="password"
          name="password"
          value={password}
          placeholder="password"
          onChange={e => onChange(e)}
        />
        <input
          type="text"
          name="username"
          value={username}
          placeholder="username"
          onChange={e => onChange(e)}
        />
        <button onClick={onSubmitForm}>Submit</button>
      </form>
      <Link to="/login" style={{ color: 'yellow' }}>Login</Link>
    </div>
  );
};

export default Register;