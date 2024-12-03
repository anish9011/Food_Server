const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import jwt
const User = require('../models/UserSchema'); // Adjust path if needed
const router = express.Router();
const tokenVerification = require('../middlewear/tokenVerification');

router.post('/signup', async (req, res) => {
    const { name, phoneNumber, email, password } = req.body;

    try {

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, phoneNumber, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET , 
            { expiresIn: '15h' }
        );
        res.status(200).json({
            message: 'Login successful',
            token,
            userId: user._id.toString(),
            name: user.name,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

router.get('/userdetails', tokenVerification, async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
      res.status(200).send(user); 
    } catch (error) {
      res.status(500).send({ error: 'Server error' });
    }
  });

  router.put('/userdetails', tokenVerification, async (req, res) => {
    const { name, email, gender, country } = req.body;
    if (!name || !email ) {
      return res.status(400).json({ error: 'All fields (name, email, gender, country) are required' });
    }
  
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      user.name = name;
      user.email = email;
      user.gender = gender;
      user.country = country;
      await user.save();
      res.status(200).json({
        name: user.name,
        email: user.email,
        gender: user.gender,
        country: user.country,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  



module.exports = router;
