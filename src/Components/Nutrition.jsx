// src/pages/Nutrition.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Nutrition.css";
import Header from "./Header";
const Nutrition = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const created_by = params.get("created_by");

  const [nutritionData, setNutritionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return oldProgress + 10;
      });
    }, 200);

    axios
      .get(`https://fitquest-backend-2.onrender.com/nutrition?created_by=${created_by}`)
      .then((response) => {
        setNutritionData(response.data);
      })
      .catch(() => {
        console.error("Error fetching nutrition data");
      })
      .finally(() => {
        setLoading(false);
      });

    return () => clearInterval(timer);
  }, [created_by]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p>Loading nutrition data...</p>
      </div>
    );
  }

  return (
    
    <div className="nutrition-container">
              <Header />

      <h2 className="nutrition-title">Nutrition Details</h2>
      {nutritionData.length === 0 ? (
        <p className="no-data">No nutrition data found.</p>
      ) : (
        <table className="nutrition-table">
          <thead>
            <tr>
              <th>Food</th>
              <th>Calories</th>
              <th>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {nutritionData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                <td>{item.meal_name}</td>
                <td>{item.calories} kcal</td>
                <td>{formatDate(item.logged_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="button-container">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
        <button
          className="add-nutrition-button"
          onClick={() => navigate("/add-nutrition?created_by=" + created_by)} // Navigate to the Add Nutrition page
        >
           🍎 Add Nutrition
        </button>
      </div>
    </div>
  );
};

export default Nutrition;
