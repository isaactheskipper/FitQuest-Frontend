import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Dashboard = () => {
  const [workouts, setWorkouts] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const created_by = sessionStorage.getItem("userId");
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isNutritionHovered, setIsNutritionHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!created_by) {
      console.error("No user ID found, redirecting...");
      navigate("/login");
      return;
    }

    // Timer for loading progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(prevProgress + 10, 100); // Increase progress by 10%
      });
    }, 300); // Adjust the interval time as needed

    // Fetch user details
    axios
      .get(`http://localhost:5000/users/${created_by}`)
      .then((response) => {
        setUsername(response.data.username);
      })
      .catch(() => {
        setError("Error fetching user details.");
      });

    // Fetch workouts
    axios
      .get(`http://localhost:5000/workouts_with_levels?created_by=${created_by}`)
      .then((response) => {
        setWorkouts(response.data);
      })
      .catch(() => {
        console.warn("Could not fetch workouts, but proceeding.");
      })
      .finally(() => {
        setLoading(false);
        clearInterval(interval); // Clear the interval when loading is complete
      });

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [created_by, navigate]);

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

  const handleAddWorkout = () => {
    navigate(`/add-workout?created_by=${created_by}`);
  };

  const handleCheckNutrition = () => {
    navigate(`/nutrition?created_by=${created_by}`);
  };

  const handleMoreClick = (workoutId) => {
    navigate(`/workout-details/${workoutId}`);
  };

  const handleAddExerciseClick = (workoutId) => {
    navigate(`/add-exercise/${workoutId}`);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 1:
        return { color: "green" };
      case 2:
        return { color: "blue" };
      case 3:
        return { color: "red" };
      default:
        return {};
    }
  };

  return (
    <div style={styles.dashboard}>
      <Header />
      
      <h2 style={styles.title}>Welcome, {username || "User"}</h2>
      <div style={styles.buttonContainer}>
        <button
          onClick={handleAddWorkout}
          style={{
            ...styles.addButton,
            ...(isHovered ? styles.addButtonHover : {}),
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Add a new workout"
        >
          <span
            style={{
              ...styles.plusSign,
              ...(isHovered ? styles.addButtonHovered : {}),
            }}
          >
            +
          </span>
          Add New Workout
        </button>

        <button
          onClick={handleCheckNutrition}
          style={{
            ...styles.addButton,
            ...(isNutritionHovered ? styles.addButtonHover : {}),
          }}
          onMouseEnter={() => setIsNutritionHovered(true)}
          onMouseLeave={() => setIsNutritionHovered(false)}
          aria-label="Check your nutrition"
        >
          <span
            style={{
              ...styles.plusSign,
              ...(isNutritionHovered ? styles.addButtonHovered : {}),
            }}
          >
            🍎
          </span>
          Check Nutrition
        </button>
      </div>

      <div style={styles.workoutTable}>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Workout Name", "Calories Burned", "Level", "More"].map((heading, index) => (
                <th key={index} style={styles.tableHeader} scope="col">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {workouts.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noWorkouts}>
                  You haven't created any workouts yet. Start by adding some!
                </td>
              </tr>
            ) : (
              workouts.map((workout, index) => (
                <tr key={workout.id} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                  <td style={styles.tableCell}>{workout.name}</td>
                  <td style={styles.tableCell}>{workout.calories_burned} kcal</td>
                  <td style={{ ...styles.tableCell, ...getLevelColor(workout.level?.id) }}>
                    {workout.level ? workout.level.name : "N/A"}
                  </td>
                  <td style={styles.tableCellWithButton}>
                    <button
                      onClick={() => handleMoreClick(workout.id)}
                      style={styles.moreButton}
                      aria-label={`More details for ${workout.name}`}
                      onMouseEnter={(e) =>
                        (e.target.querySelector("span").style.transform = "rotate(90deg)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.querySelector("span").style.transform = "rotate(0deg)")
                      }
                    >
                      More
                      <span style={styles.moreButtonArrow}>→</span>
                    </button>
                  </td>
                  <td style={styles.exerciseButtonContainer}>
                    <button
                      onClick={() => handleAddExerciseClick(workout.id)}
                      style={styles.moreButton}
                      aria-label={`Add exercise to ${workout.name}`}
                    >
                      Add Exe...
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  dashboard: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
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
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 20px",
  },
  addButton: {
    padding: "10px 20px",
    fontSize: "16px",
    background: "linear-gradient(to right,rgb(2, 97, 10),rgb(110, 245, 117))",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
    maxWidth: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.3s ease, transform 0.3s ease",
  },
  addButtonHover: {
    background: "linear-gradient(to right,rgb(0, 80, 0),rgb(80, 200, 80))",
    transform: "scale(1.05)",
  },
  plusSign: {
    marginRight: "8px",
    transition: "transform 0.3s ease",
  },
  addButtonHovered: {
    transform: "rotate(360deg)",
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
  tableCellWithButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
  moreButton: {
    padding: "4px 8px",
    fontSize: "17px",
    background: "linear-gradient(to right,rgb(2, 97, 10),rgb(110, 245, 117))",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "auto",
    minWidth: "60px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.3s ease",
  },
  moreButtonArrow: {
    marginLeft: "8px",
    fontSize: "14px",
    transition: "transform 0.3s ease",
  },
  exerciseButtonContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "10px 0",
  },
};

export default Dashboard;
