import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css'; // Custom styles for Home page

const Home = () => {
  return (
    <div className="home-container">
      <motion.h1
        className="home-title"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Welcome to the Customer Feedback System
      </motion.h1>

      <motion.p
        className="home-subtitle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Share your experience, review feedback, and help us improve our services.
      </motion.p>

      <motion.div
        className="home-buttons"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Link to="/login" className="btn">
          Log In
        </Link>
        <Link to="/register" className="btn">
          Register
        </Link>
        {/* <Link to="/submit-feedback" className="btn">
          Submit Feedback
        </Link> */}
      </motion.div>
    </div>
  );
};

export default Home;
