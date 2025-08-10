// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerComponent from '../components/CustomerDashboard';
import ManagerComponent from '../components/ManagerDashboard';
import './Dashboard.css';
import { FaSun, FaMoon, FaCloudSun } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

const getGreeting = () => {
  const hour = currentTime.getHours();
  if (hour < 12) return (
    <>
      <FaSun style={{ color: '#fbbf24', marginRight: '8px' }} />
      Good Morning
    </>
  );
  if (hour < 17) return (
    <>
      <FaCloudSun style={{ color: '#f59e0b', marginRight: '8px' }} />
      Good Afternoon
    </>
  );
  return (
    <>
      <FaMoon style={{ color: '#6366f1', marginRight: '8px' }} />
      Good Evening
    </>
  );
};



  const getRoleIcon = () => {
    return role === 'customer' ? '👤' : '👨‍💼';
  };

  const getRoleDisplay = () => {
    return role === 'customer' ? 'Customer' : 'Manager';
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-background"></div>
        
        {/* Navigation Bar */}
        <nav className="dashboard-nav">
          <div className="nav-brand">
            <div className="brand-icon">⭐</div>
            <span className="brand-text">FeedbackHub</span>
          </div>
          
          <div className="nav-actions">
            <div className="time-display">
              {currentTime.toLocaleTimeString()}
            </div>
            
            <div className="profile-section">
              <button 
                className="profile-trigger"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="profile-avatar">
                  {getRoleIcon()}
                </div>
                <div className="profile-info">
                  <span className="profile-name">{name}</span>
                  <span className="profile-role">{getRoleDisplay()}</span>
                </div>
                <span className="dropdown-arrow">▼</span>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    className="profile-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">{getRoleIcon()}</div>
                      <div>
                        <div className="dropdown-name">{name}</div>
                        <div className="dropdown-email">{email}</div>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item">
                      <span className="item-icon">⚙️</span>
                      Settings
                    </button>
                    <button className="dropdown-item">
                      <span className="item-icon">📊</span>
                      Analytics
                    </button>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <span className="item-icon">🚪</span>
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>

        {/* Welcome Section */}
        <div className="welcome-section">
          <motion.div 
            className="welcome-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="welcome-title">
              {getGreeting()}, {name}! 
            </h1>
            <p className="welcome-subtitle">
              {role === 'customer' 
                ? 'Ready to share your feedback and help us improve?' 
                : 'Monitor feedback and manage customer satisfaction today.'}
            </p>
            <div className="welcome-stats">
              <div className="stat-item">
                <span className="stat-icon">📅</span>
                <span className="stat-text">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </motion.div>
          
          <div className="header-decoration">
            <div className="decoration-line line-1"></div>
            <div className="decoration-line line-2"></div>
            <div className="decoration-line line-3"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <motion.div 
          className="component-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {role === 'customer' && <CustomerComponent />}
          {role === 'manager' && <ManagerComponent />}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>&copy; 2025 FeedbackHub. Built with ❤️ for better customer experiences.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
