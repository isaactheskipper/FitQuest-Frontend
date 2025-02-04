// src/components/Header.js
import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <header style={styles.header}>
    <div style={styles.logoContainer}>
      <h1 style={styles.logo}>FitQuest</h1>
    </div>
    <nav style={styles.nav}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link to="/dashboard" style={styles.navLink}>Home</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/login" style={styles.navLink} onClick={handleLogout}>Logout</Link>
        </li>
      </ul>
    </nav>
  </header>
);

const handleLogout = () => {
  sessionStorage.removeItem("userId");
};

const styles = {
  header: {
    backgroundColor: "#f0f0f0",  // Light grey background
    padding: "10px 20px",  // Reduced padding for smaller header
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333", // Darker text for better contrast
    margin: 0,
  },
  nav: {
    flex: 2,
    display: "flex",
    justifyContent: "flex-end",
  },
  navList: {
    listStyle: "none",
    display: "flex",
    margin: 0,
    padding: 0,
  },
  navItem: {
    marginLeft: "20px",
  },
  navLink: {
    color: "#333", // Dark grey color for the links
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer", // Indicate that it's clickable
  },
};

export default Header;
