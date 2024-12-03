
const express = require('express');
const Address = require('../models/AddressSchema'); 
const tokenVerification = require('../middlewear/tokenVerification'); 
const router = express.Router();


router.post('/address', tokenVerification, async (req, res) => {
  try {
    const { fullAddress, state, city, pinCode, phoneNumber } = req.body;

    // Create a new address document
    const newAddress = new Address({
      fullAddress,
      state,
      city,
      pinCode,
      phoneNumber,
      userId: req.userId,
    });

    
    await newAddress.save();

    res.status(201).json({ message: 'Address added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add address' });
  }
});


router.get('/address', tokenVerification, async (req, res) => {
    try {
      const userId = req.userId; 
      const addresses = await Address.find({ userId });
  
      if (!addresses.length) {
        return res.status(404).json({ message: 'No addresses found for this user' });
      }
  
      res.status(200).json(addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      res.status(500).json({ error: 'Failed to fetch addresses' });
    }
  });
  

  router.put('/address/select/:id', tokenVerification,async (req, res) => {
    try {
      const { id } = req.params;
  

      await Address.updateMany({}, { $set: { selected: false } });
  

      const updatedAddress = await Address.findByIdAndUpdate(
        id,
        { $set: { selected: true } },
        { new: true }
      );
  
      if (!updatedAddress) {
        return res.status(404).json({ message: 'Address not found' });
      }
  
      res.status(200).json({ message: 'Address selected', address: updatedAddress });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to select address' });
    }
  });
  
  router.get('/selected-address', tokenVerification,async (req, res) => {
    try {
      const userId = req.userId; 
      const selectedAddress = await Address.findOne({ selected: true ,userId});
  
      if (!selectedAddress) {
        return res.status(404).json({ message: 'No address found where selected is true.' });
      }
  
      res.status(200).json({
        message: 'Selected address fetched successfully',
        data: selectedAddress,
      });
    } catch (error) {
      console.error('Error fetching selected address:', error);
      res.status(500).json({
        message: 'Failed to fetch selected address',
        error: error.message,
      });
    }
  });

module.exports = router;
