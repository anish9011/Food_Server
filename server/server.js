// server.js or app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes'); 
const cartRoutes = require('./routes/cartRoutes'); 
const addressRoutes = require('./routes/addressRoutes'); 
const debitCardRoutes = require('./routes/debitcardRoutes');
const tokenVerification = require('./middlewear/tokenVerification');
const app = express();
const PORT = 5000;

// Middleware setup
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Use the authRoutes for handling authentication-related endpoints
app.use('/auth',authRoutes); // All routes in authRoutes will now be prefixed with /auth
app.use('/api', imageRoutes); 
app.use('/api',tokenVerification, cartRoutes); 
app.use('/api',tokenVerification, addressRoutes); 
app.use('/api', tokenVerification,debitCardRoutes);

// Simple test route
app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
