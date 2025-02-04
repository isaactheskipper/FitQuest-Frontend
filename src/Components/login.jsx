import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";  // ✅ Import the external CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);
  
    if (!email || !password) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch("https://fitquest-backend-2.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("Login successful!");
  
        // ✅ Use sessionStorage instead of localStorage
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userId", data.user_id); // Store user ID
  
        setTimeout(() => navigate("/dashboard"), 1500); // Redirect after success
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to log in.");
      }
    } catch (err) {
      setError("An error occurred while logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h3>Login</h3>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/sign-up">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
