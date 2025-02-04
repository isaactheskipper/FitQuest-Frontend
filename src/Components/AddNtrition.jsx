// src/pages/AddNutrition.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const AddNutrition = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const created_by = queryParams.get('created_by'); // Get user ID from URL

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    meal_name: '',
    calories: '',
    logged_at: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // New loading state

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true); // Set loading to true when submitting
  
    // Validate required fields
    if (!formData.meal_name || !formData.calories || !formData.logged_at) {
      setError("Please fill in all required fields.");
      setLoading(false); // Reset loading if validation fails
      return;
    }
  
    try {
      const response = await fetch("https://fitquest-backend-2.onrender.com/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          user_id: created_by // Change 'created_by' to 'user_id'
        }),
      });
  
      const nutrition = await response.json();
  
      // Check if response is OK
      if (response.ok) {
        setSuccessMessage("Nutrition entry created successfully!");
        setTimeout(() => navigate(`/nutrition?created_by=${created_by}`), 1500);
      } else {
        setError(nutrition.error || "Nutrition entry creation failed.");
        console.error("Response error:", nutrition); // Log the response error
      }
    } catch (err) {
      console.error("Fetch error:", err); // Log the error to the console
      setError("An error occurred while creating the nutrition entry.");
    } finally {
      setLoading(false); // Reset loading regardless of success or failure
    }
  };

  const handleGoBack = () => {
    navigate(`/nutrition?created_by=${created_by}`); // Navigate back to the nutrition page
  };
  
  return (
    <div>
      <Header />
      <div className="nutrition-container">
        <h3>Add Nutrition</h3>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        {loading && <p className="loading">We are waiting... Please wait...</p>} {/* Loading message */}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="meal_name">Meal Name</label>
              <input
                type="text"
                id="meal_name"
                name="meal_name"
                placeholder="Meal Name"
                value={formData.meal_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="calories">Calories</label>
              <input
                type="number"
                id="calories"
                name="calories"
                placeholder="Calories"
                value={formData.calories}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="logged_at">Date Logged</label>
              <input
                type="datetime-local"
                id="logged_at"
                name="logged_at"
                value={formData.logged_at}
                onChange={handleChange}
                required
                style={{ width: '100%' }} // Full width for input
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button type="button" onClick={handleGoBack} style={{ width: '20%' }}>
              Go Back
            </button>
            <button type="submit" style={{ width: '20%' }} disabled={loading}> {/* Disable button when loading */}
              {loading ? "Adding..." : "🍎 Add Nutrition"} {/* Change button text while loading */}
            </button>
          </div>
        </form>
      </div>

      <style>{`
         .form-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          width: 100%;
        }

        .form-row .input-group {
          width: 48%;
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

        .nutrition-container {
          width: 100%;
          max-width: 95%;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-size: 16px;
          color: #333;
        }

        input {
          width: 100%;
          padding: 10px;
          margin-top: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
          text-align: center;
        }

        button {
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
          text-align: center;
        }

        .success {
          color: green;
          text-align: center;
        }

        .loading {
          color: #FFA500; /* Orange color for loading */
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default AddNutrition;
