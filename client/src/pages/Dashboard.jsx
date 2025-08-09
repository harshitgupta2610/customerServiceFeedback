// src/pages/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerComponent from '../components/CustomerDashboard';
import ManagerComponent from '../components/ManagerDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');

 

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Simple test version first
  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard Works! 🎉</h1>
      <p>Welcome, {name}!</p>
      <p>Your role: {role}</p>
      <button onClick={handleLogout}>Logout</button>
      
      {/* Add your role-based components here */}
      {role === 'customer' && <div><CustomerComponent/></div>}
      {role === 'manager' && <div><ManagerComponent/></div>}
    </div>
  );
};

export default Dashboard;
