// addProducts.js
const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  addSampleProducts();
})
.catch((err) => {
  console.error('❌ MongoDB connection failed:', err);
});

// Sample products data
const sampleProducts = [
  {
    name: 'Smartphone X1',
    description: 'Latest smartphone with amazing features',
    category: 'Electronics',
    price: 599.99
  },
  {
    name: 'Laptop Pro',
    description: 'High-performance laptop for professionals',
    category: 'Electronics', 
    price: 1299.99
  },
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-canceling headphones',
    category: 'Electronics',
    price: 199.99
  },
  {
    name: 'Running Shoes',
    description: 'Comfortable running shoes for athletes',
    category: 'Sports',
    price: 129.99
  },
  {
    name: 'Coffee Maker',
    description: 'Automatic coffee maker with timer',
    category: 'Home Appliances',
    price: 89.99
  }
];

// Function to add products
const addSampleProducts = async () => {
  try {
    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    
    if (existingProducts > 0) {
      console.log(`✅ Products already exist (${existingProducts} products found)`);
      console.log('Skipping product creation...');
      process.exit(0);
    }

    // Add sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully added ${products.length} products:`);
    
    products.forEach(product => {
      console.log(`   - ${product.name} ($${product.price})`);
    });

  } catch (error) {
    console.error('❌ Error adding products:', error);
  } finally {
    mongoose.connection.close();
    console.log('📱 Database connection closed');
  }
};
