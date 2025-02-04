import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const SignUp = () => {
  const navigate = useNavigate(); // Hook for navigation

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role_id: 2,
    level_id: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch("https://fitquest-backend-2.onrender.com/levels");
        if (response.ok) {
          const data = await response.json();
          setLevels(data);
        } else {
          throw new Error("Failed to fetch levels.");
        }
      } catch (err) {
        setError("An error occurred while fetching levels.");
      }
    };

    fetchLevels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "level_id" ? parseInt(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.username || !formData.email || !formData.password || !formData.level_id) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("https://fitquest-backend-2.onrender.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("User created successfully!");
        setTimeout(() => {
          navigate("/login"); // Redirect to login after success
        }, 2000);
      } else {
        setError(result.error || "Failed to create user.");
      }
    } catch (err) {
      setError("An error occurred while creating the user.");
    }
  };

  return (
    <div className="signup-container">
      <h3>Sign Up</h3>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="level_id">Select Level</label>
        <select
          id="level_id"
          name="level_id"
          value={formData.level_id}
          onChange={handleChange}
          required
        >
          <option value="">Choose a level</option>
          {levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </select>

        <button type="submit">Sign Up</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>

      <style>{`
        .signup-container {
          max-width: 400px;
          margin: auto;
          padding: 20px;
          background: #f2f2f2;
          border-radius: 5px;
        }
        label {
          display: block;
          margin-top: 10px;
        }
        input, select {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          width: 100%;
          background-color: #4CAF50;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }
        button:hover {
          background-color: #45a049;
        }
        .error {
          color: red;
        }
        .success {
          color: green;
        }
      `}</style>
    </div>
  );
};

export default SignUp;
