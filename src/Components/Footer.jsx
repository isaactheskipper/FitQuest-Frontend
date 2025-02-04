// src/components/Footer.js
import React from "react";

const Footer = () => (
  <footer style={styles.footer}>
    <p style={styles.footerText}>© 2025 Your Fitness App. All rights reserved.</p>
  </footer>
);

const styles = {
  footer: {
    backgroundColor: "#333",
    color: "white",
    textAlign: "center",
    padding: "10px",
    marginTop: "auto",  // Ensures footer stays at the bottom
    width: "100%",
  },
  footerText: {
    margin: "0",
    fontSize: "14px",
  },
};

export default Footer;
