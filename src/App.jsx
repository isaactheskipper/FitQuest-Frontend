
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./Components/sign-up";
import Login from "./Components/login";
import Dashboard from "./Components/dashboard";
import AddWorkout from "./Components/AddWorkout";
import AddExercise from "./Components/AddExercise";
import WorkoutDetails from "./Components/WorkoutDetails";
import Nutrition from "./Components/Nutrition";
import AddNutrition from "./Components/AddNtrition";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-workout" element={<AddWorkout />} />
        <Route path="/add-exercise/:workoutId" element={<AddExercise />} />
        <Route path="/workout-details/:workoutId" element={<WorkoutDetails />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/add-nutrition" element={<AddNutrition />} />

      </Routes>
    </Router>
  );
};

export default App;