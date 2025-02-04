// src/pages/AddExercise.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const AddExercise = () => {
  const { workoutId } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [durationSeconds, setDurationSeconds] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(`http://localhost:5000/exercises`, {
        workout_id: workoutId,
        name,
        description,
        duration_seconds: durationSeconds,
      });
      navigate(`/dashboard`); // Redirect to dashboard or workout details page
    } catch (err) {
      setError("Failed to add exercise. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exercise-container">
      <Header />
      <h3>Add Exercise</h3>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}

        <div className="form-row">
          <div className="input-group">
            <label htmlFor="name">Exercise Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="duration_seconds">Duration (seconds):</label>
            <input
              type="number"
              id="duration_seconds"
              value={durationSeconds}
              onChange={(e) => setDurationSeconds(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group" style={{ width: "100%" }}>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Exercise"}
        </button>
      </form>
      <style>{styles}</style>
    </div>
  );
};

const styles = `
  .exercise-container {
    width: 100%;
    max-width: 95%;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  h3 {
    font-size: 28px;
    font-weight: 600;
    text-align: center;
    text-transform: uppercase;
    font-family: 'Arial', sans-serif;
    color: #333;
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 3px solid #4CAF50;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 16px;
    color: #333;
  }

  .form-row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
  }

  .input-group {
    width: 48%;
  }

  input, textarea {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align: center;
  }

  textarea {
    min-height: 100px;
  }

  button {
    width: 100%;
    background-color: #4CAF50;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #45a049;
  }

  .error {
    color: red;
    margin-bottom: 15px;
  }

  .success {
    color: green;
    margin-bottom: 15px;
  }
`;

export default AddExercise;
