import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './customer.css';

const CustomerComponent = () => {
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' or 'history'
  const [feedback, setFeedback] = useState({
    productId: '',
    rating: '',
    feedbackType: 'general',
    message: '',
    suggestions: ''
  });
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);

  const token = localStorage.getItem('token');

  // Fetch products for dropdown
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch feedback history when switching to history tab
  useEffect(() => {
    if (activeTab === 'history') {
      fetchFeedbackHistory();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...'); // Debug log
      console.log('Token:', token); // Debug log
      
      const response = await axios.get('http://localhost:5000/api/customer/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Products API Response:', response.data); // Debug log
      setProducts(response.data);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      console.error('Error response:', error.response?.data); // Debug log
      setProducts([]); // Set empty array on error
    } finally {
      setProductsLoading(false);
    }
  };

  // Debug: Log products whenever they change
  useEffect(() => {
    console.log('Products state updated:', products); // Debug log
  }, [products]);

  const fetchFeedbackHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customer/feedback', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbackHistory(response.data);
    } catch (error) {
      console.error('Error fetching feedback history:', error);
    }
  };

  // Fixed handleSubmitFeedback function
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare the data to send
    const feedbackData = {
      productId: feedback.productId || null,
      rating: parseInt(feedback.rating),
      feedbackType: feedback.feedbackType,
      message: feedback.message,
      suggestions: feedback.suggestions
    };

    console.log('Sending feedback data:', feedbackData); // Debug log
    console.log('Token:', token); // Debug log

    try {
      const response = await axios.post(
        'http://localhost:5000/api/customer/feedback', 
        feedbackData, // This is the data (2nd parameter)
        {             // This is the config (3rd parameter)
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Response:', response.data); // Debug log
      alert('Feedback submitted successfully!');
      
      // Reset form after successful submission
      setFeedback({
        productId: '',
        rating: '',
        feedbackType: 'general',
        message: '',
        suggestions: ''
      });
      
    } catch (error) {
      console.error('Full error:', error); // Debug log
      console.error('Error response:', error.response?.data); // Debug log
      alert('Error: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-dashboard">
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={activeTab === 'submit' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('submit')}
        >
          Submit Feedback
        </button>
        <button 
          className={activeTab === 'history' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('history')}
        >
          My Feedback History
        </button>
      </div>

      {/* Submit Feedback Tab */}
      {activeTab === 'submit' && (
        <motion.div 
          className="feedback-form-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Submit Your Feedback</h2>
          <form onSubmit={handleSubmitFeedback} className="feedback-form">
            
            <div className="form-group">
              <label>Product (Optional)</label>
              <select
                value={feedback.productId}
                onChange={(e) => setFeedback({...feedback, productId: e.target.value})}
              >
                <option value="">Select a product</option>
                {productsLoading && <option disabled>Loading products...</option>}
                {!productsLoading && products.length === 0 && <option disabled>No products available</option>}
                {!productsLoading && products.map(product => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
              
              {/* Debug info */}
              <small style={{color: 'gray'}}>
                Debug: Found {products.length} products
              </small>
            </div>

            <div className="form-group">
              <label>Rating *</label>
              <select
                value={feedback.rating}
                onChange={(e) => setFeedback({...feedback, rating: e.target.value})}
                required
              >
                <option value="">Select rating</option>
                <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                <option value="4">⭐⭐⭐⭐ Good</option>
                <option value="3">⭐⭐⭐ Average</option>
                <option value="2">⭐⭐ Poor</option>
                <option value="1">⭐ Very Poor</option>
              </select>
            </div>

            <div className="form-group">
              <label>Feedback Type</label>
              <select
                value={feedback.feedbackType}
                onChange={(e) => setFeedback({...feedback, feedbackType: e.target.value})}
              >
                <option value="general">General Feedback</option>
                <option value="complaint">Complaint</option>
                <option value="suggestion">Suggestion</option>
                <option value="compliment">Compliment</option>
                <option value="bug-report">Bug Report</option>
              </select>
            </div>

            <div className="form-group">
              <label>Your Feedback *</label>
              <textarea
                rows="4"
                value={feedback.message}
                onChange={(e) => setFeedback({...feedback, message: e.target.value})}
                placeholder="Share your detailed feedback..."
                required
              />
            </div>

            <div className="form-group">
              <label>Suggestions (Optional)</label>
              <textarea
                rows="3"
                value={feedback.suggestions}
                onChange={(e) => setFeedback({...feedback, suggestions: e.target.value})}
                placeholder="Any suggestions for improvement?"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Feedback History Tab */}
      {activeTab === 'history' && (
        <motion.div 
          className="feedback-history-section"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Your Feedback History</h2>
          
          {feedbackHistory.length === 0 ? (
            <div className="no-feedback">
              <p>You haven't submitted any feedback yet.</p>
              <button 
                onClick={() => setActiveTab('submit')}
                className="switch-tab-btn"
              >
                Submit Your First Feedback
              </button>
            </div>
          ) : (
            <div className="feedback-list">
              {feedbackHistory.map((item) => (
                <div key={item._id} className="feedback-item">
                  <div className="feedback-header">
                    <div className="rating">
                      {'⭐'.repeat(item.rating)} ({item.rating}/5)
                    </div>
                    <div className="date">
                      {new Date(item.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="feedback-type">{item.feedbackType}</div>
                  <div className="feedback-message">{item.message}</div>
                  {item.suggestions && (
                    <div className="feedback-suggestions">
                      <strong>Suggestions:</strong> {item.suggestions}
                    </div>
                  )}
                  <div className="feedback-status">
                    Status: <span className={`status ${item.status}`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CustomerComponent;
