import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from './Header';  // Import Header
import Footer from './Footer';  // Import Footer

const WorkoutDetails = () => {
  const { workoutId } = useParams(); // Get workoutId from the route parameters
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 10;
        }
        return prevProgress; // Stop at 100%
      });
    }, 300); // Update every 300 milliseconds

    // Fetch workout details and exercises by workout ID
    axios
      .get(`http://localhost:5000/workouts/${workoutId}`)
      .then((response) => {
        setWorkout(response.data);
        setExercises(response.data.exercises || []); // Extract exercises from the response
        setLoading(false);
        setProgress(100); // Set progress to 100% when loading is complete
      })
      .catch((error) => {
        console.error(error);
        setError("Error fetching workout details. Please try again later.");
        setLoading(false);
      });

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [workoutId]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
        </div>
        <p>Loading workout details...</p>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={styles.pageContainer}>
      <Header /> {/* Render Header component */}

      <div style={styles.dashboard}>
        {workout ? (
          <>
            <h2 style={styles.title}>{workout.name}</h2>

            {/* Workout Details Table */}
            <div style={styles.workoutTable}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {["Workout Name", "Calories Burned", "Level"].map((heading, index) => (
                      <th key={index} style={styles.tableHeader} scope="col">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={styles.evenRow}>
                    <td style={styles.tableCell}>{workout.name}</td>
                    <td style={styles.tableCell}>{workout.calories_burned} kcal</td>
                    <td style={{ ...styles.tableCell, ...getLevelColor(workout.level?.id) }}>
                      {workout.level ? workout.level.name : "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Exercises Table */}
            <h3 style={styles.subtitle}>Exercises</h3>
            <div style={styles.workoutTable}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {["Exercise Name", "Description", "Duration (min)"].map((heading, index) => (
                      <th key={index} style={styles.tableHeader} scope="col">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {exercises.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={styles.noWorkouts}>
                        No exercises available for this workout.
                      </td>
                    </tr>
                  ) : (
                    exercises.map((exercise, index) => (
                      <tr key={index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                        <td style={styles.tableCell}>{exercise.name}</td>
                        <td style={styles.tableCell}>{exercise.description || "No description available"}</td>
                        <td style={styles.tableCell}>{(exercise.duration_seconds / 60).toFixed(2)} min</td> {/* Convert seconds to minutes */}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={styles.addButtonContainer}>
              <button onClick={() => navigate(-1)} style={styles.addButton} aria-label="Go back">
                Go Back
              </button>
            </div>
          </>
        ) : (
          <div>No workout found.</div>
        )}
      </div>

    </div>
  );
};

// Function to determine the text color for the "Level" column
const getLevelColor = (level) => {
  switch (level) {
    case 1:
      return { color: "green" }; // Green text for level 1
    case 2:
      return { color: "blue" };  // Blue text for level 2
    case 3:
      return { color: "red" };   // Red text for level 3
    default:
      return {}; // Default case if level is not 1, 2, or 3
  }
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#888',
  },
  progressBar: {
    width: '80%',
    height: '20px',
    backgroundColor: '#e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '10px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(to right, rgb(2, 97, 10), rgb(110, 245, 117))',
    transition: 'width 0.4s ease',
  },
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // Ensures the page fills the height of the screen
  },
  dashboard: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    flex: 1, // Allows the content to take up the available space
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    padding: "20px 0",
    background: "linear-gradient(to right,rgb(2, 97, 10),rgb(110, 245, 117))",
    color: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textTransform: "uppercase",
    letterSpacing: "2px",
  },
  subtitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginTop: "30px",
  },
  workoutTable: {
    width: "100%",
    border: "1px solid #ccc",
    padding: "15px",
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "center",
    backgroundColor: "#f4f4f4",
  },
  tableCell: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "center",
  },
  evenRow: {
    backgroundColor: "#f9f9f9",
    borderBottom: "1px solid #ddd",
  },
  oddRow: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #ddd",
  },
  noWorkouts: {
    textAlign: "center",
    padding: "20px",
  },
  addButtonContainer: {
    marginTop: "20px",
    textAlign: "center",
  },
  addButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default WorkoutDetails;
