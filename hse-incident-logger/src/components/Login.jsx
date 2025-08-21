import React, { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user"); // default is user

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return alert("Enter a username!");

    // Pass info back to App
    onLogin({ username, role });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
