import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const AddWorkout = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const created_by = queryParams.get('created_by'); // Get user ID from URL

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_minutes: '',
    calories_burned: '',
    level_id: '',
  });

  const [levels, setLevels] = useState([]); // State to store levels
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch levels from the API
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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "level_id" ? parseInt(value) : value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.name || !formData.duration_minutes || !formData.calories_burned) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("https://fitquest-backend-2.onrender.com/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, created_by }),
      });

      const workout = await response.json();

      if (response.ok) {
        setSuccessMessage("Workout created successfully!");
        setTimeout(() => navigate(`/dashboard`), 1500);
      } else {
        setError(workout.error || "Workout creation failed.");
      }
    } catch (err) {
      setError("An error occurred while creating the workout.");
    }
  };

  return (
    <div>
      <Header />
        <div className="workout-container">
          <h3>Add Workout</h3>
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="input-group">
                <label htmlFor="name">Workout Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Workout Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="level_id">Select Level</label>
                <select
                  id="level_id"
                  name="level_id"
                  value={formData.level_id}
                  onChange={handleChange}
                >
                  <option value="">Choose a level</option>
                  {levels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="duration_minutes">Duration (Minutes)</label>
                <input
                  type="number"
                  id="duration_minutes"
                  name="duration_minutes"
                  placeholder="Duration (minutes)"
                  value={formData.duration_minutes}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="calories_burned">Calories Burned</label>
                <input
                  type="number"
                  id="calories_burned"
                  name="calories_burned"
                  placeholder="Calories Burned"
                  value={formData.calories_burned}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit">Create Workout</button>
          </form>
          
      </div>
      <style>{`
          .form-row {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            width: 100%; /* Ensure form row takes full width */
          }

          .form-row .input-group {
            width: 48%; /* Keep form fields responsive within the row */
          }

          h3 {
            font-size: 28px;                        /* A decent font size */
            font-weight: 600;                       /* Semi-bold for emphasis */
            text-align: center;                     /* Centered text */
            text-transform: uppercase;              /* Capital letters */
            font-family: 'Arial', sans-serif;       /* Simple, clean font */
            color: #333;                            /* Dark gray color for the text */
            margin-bottom: 10px;                    /* Space below the heading */
            padding-bottom: 5px;                    /* Space between text and the line */
            border-bottom: 3px solid #4CAF50;       /* Green underline */
            width: 50%;                             /* Reduces the length of the line */
            margin-left: auto;                      /* Center the line */
            margin-right: auto;                     /* Center the line */
          }

          .workout-container {
            width: 100%; /* Take full width of the page */
            max-width: 95%; /* Set max-width to 95% of the screen width */
            margin: 0 auto; /* Center container horizontally */
            padding: 20px; /* Add padding inside the container */
            background-color: #f9f9f9; /* Light background color */
            border-radius: 8px; /* Rounded corners */
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
          }

          label {
            display: block;
            margin-bottom: 8px;
            font-size: 16px;
            color: #333;
          }

          input, select, textarea {
            width: 100%; 
            padding: 10px;
            margin-top: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
            text-align: center;
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
            background-color: #45a049; /* Darker green on hover */
          }

          /* Ensuring the form takes full width and aligns properly */
          .input-group input, .input-group select, .input-group textarea {
            width: 100%; /* Ensure input elements take the full width of the form */
          }
        `}</style>




    </div>
  );
};

export default AddWorkout;


