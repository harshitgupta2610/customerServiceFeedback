import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './customer.css';

const CustomerComponent = () => {
  const [activeTab, setActiveTab] = useState('submit');
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
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchFeedbackHistory();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://customerservicefeedback.onrender.com/api/customer/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchFeedbackHistory = async () => {
    try {
      const response = await axios.get('https://customerservicefeedback.onrender.com/api/customer/feedback', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbackHistory(response.data);
    } catch (error) {
      console.error('Error fetching feedback history:', error);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setLoading(true);

    const feedbackData = {
      productId: feedback.productId || null,
      rating: parseInt(feedback.rating),
      feedbackType: feedback.feedbackType,
      message: feedback.message,
      suggestions: feedback.suggestions
    };

    try {
      const response = await axios.post(
        'https://customerservicefeedback.onrender.com/api/customer/feedback', 
        feedbackData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
      
      setFeedback({
        productId: '',
        rating: '',
        feedbackType: 'general',
        message: '',
        suggestions: ''
      });
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const feedbackTypeIcons = {
    'general': '💬',
    'complaint': '⚠️',
    'suggestion': '💡',
    'compliment': '👍',
    'bug-report': '🐛'
  };

  const statusColors = {
    'pending': '#ff6b35',
    'reviewed': '#f7b801',
    'resolved': '#5cb85c',
    'closed': '#6c757d'
  };

  return (
    <div className="customer-dashboard">
      
        <div className="header-content">
          <h1>Customer Feedback Portal</h1>
          <p>Share your experience and help us improve</p>
        </div>
     

      <div className="tab-navigation">
        <div className="nav-container">
          <button 
            className={`nav-tab ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => setActiveTab('submit')}
          >
            <span className="tab-icon">✍️</span>
            Submit Feedback
          </button>
          <button 
            className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <span className="tab-icon">📋</span>
            My History
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'submit' && (
          <motion.div 
            key="submit"
            className="content-section"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <div className="form-container">
              <div className="form-header">
                <h2>Submit Your Feedback</h2>
                <p>We value your opinion and suggestions</p>
              </div>

              {submitSuccess && (
                <motion.div 
                  className="success-message"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="success-icon">✅</span>
                  Feedback submitted successfully!
                </motion.div>
              )}

              <form onSubmit={handleSubmitFeedback} className="modern-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-text">Product</span>
                      <span className="label-optional">Optional</span>
                    </label>
                    <div className="select-wrapper">
                      <select
                        value={feedback.productId}
                        onChange={(e) => setFeedback({...feedback, productId: e.target.value})}
                        className="form-select"
                      >
                        <option value="">Choose a product</option>
                        {productsLoading && <option disabled>Loading...</option>}
                        {!productsLoading && products.map(product => (
                          <option key={product._id} value={product._id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-text">Rating</span>
                      <span className="label-required">*</span>
                    </label>
                    <div className="select-wrapper">
                      <select
                        value={feedback.rating}
                        onChange={(e) => setFeedback({...feedback, rating: e.target.value})}
                        className="form-select"
                        required
                      >
                        <option value="">Rate your experience</option>
                        <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                        <option value="4">⭐⭐⭐⭐ Good</option>
                        <option value="3">⭐⭐⭐ Average</option>
                        <option value="2">⭐⭐ Poor</option>
                        <option value="1">⭐ Very Poor</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-text">Feedback Type</span>
                  </label>
                  <div className="feedback-type-grid">
                    {Object.entries(feedbackTypeIcons).map(([type, icon]) => (
                      <label key={type} className="radio-card">
                        <input
                          type="radio"
                          name="feedbackType"
                          value={type}
                          checked={feedback.feedbackType === type}
                          onChange={(e) => setFeedback({...feedback, feedbackType: e.target.value})}
                        />
                        <div className="radio-card-content">
                          <span className="radio-icon">{icon}</span>
                          <span className="radio-label">{type.replace('-', ' ')}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-text">Your Feedback</span>
                    <span className="label-required">*</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    rows="4"
                    value={feedback.message}
                    onChange={(e) => setFeedback({...feedback, message: e.target.value})}
                    placeholder="Tell us about your experience in detail..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-text">Suggestions</span>
                    <span className="label-optional">Optional</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    value={feedback.suggestions}
                    onChange={(e) => setFeedback({...feedback, suggestions: e.target.value})}
                    placeholder="How can we improve? Share your suggestions..."
                  />
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? (
                    <span className="button-content">
                      <span className="loading-spinner"></span>
                      Submitting...
                    </span>
                  ) : (
                    <span className="button-content">
                      <span className="button-icon">🚀</span>
                      Submit Feedback
                    </span>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div 
            key="history"
            className="content-section"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.3 }}
          >
            <div className="history-container">
              <div className="history-header">
                <h2>Your Feedback History</h2>
                <p>Track all your submitted feedback</p>
              </div>
              
              {feedbackHistory.length === 0 ? (
                <motion.div 
                  className="empty-state"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="empty-icon">📝</div>
                  <h3>No feedback yet</h3>
                  <p>Start sharing your experience with us</p>
                  <button 
                    onClick={() => setActiveTab('submit')}
                    className="cta-button"
                  >
                    Submit Your First Feedback
                  </button>
                </motion.div>
              ) : (
                <div className="feedback-grid">
                  {feedbackHistory.map((item, index) => (
                    <motion.div 
                      key={item._id}
                      className="feedback-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="card-header">
                        <div className="feedback-meta">
                          <span className="feedback-type-badge">
                            {feedbackTypeIcons[item.feedbackType]} {item.feedbackType}
                          </span>
                          <span className="feedback-date">
                            {new Date(item.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="rating-display">
                          {'⭐'.repeat(item.rating)}
                          <span className="rating-number">({item.rating}/5)</span>
                        </div>
                      </div>
                      
                      <div className="card-content">
                        <p className="feedback-message">{item.message}</p>
                        {item.suggestions && (
                          <div className="suggestions-section">
                            <strong>💡 Suggestions:</strong>
                            <p>{item.suggestions}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="card-footer">
                        <div 
                          className="status-badge" 
                          style={{ backgroundColor: statusColors[item.status] }}
                        >
                          {item.status}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerComponent;
