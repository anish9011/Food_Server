const express = require('express');
const jwt = require('jsonwebtoken');
const DebitCard = require('../models/DebitCardSchema'); 
const router = express.Router();
const tokenVerification = require('../middlewear/tokenVerification');

router.post('/add', tokenVerification, async (req, res) => {
  console.log("Request Body:", req.body); 

  const { cardName, cardNumber, expirationDate, cvc, nameOnCard } = req.body;
  const userId = req.userId; 

  if (!cardName || !cardNumber || !expirationDate || !cvc || !nameOnCard) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const newDebitCard = new DebitCard({
      userId,
      cardName,
      cardNumber,
      expirationDate,
      cvc,
      nameOnCard,
    });
    await newDebitCard.save(); 
    res.status(201).json(newDebitCard);
  } catch (err) {
    console.error('Error saving card:', err);
    res.status(400).json({ message: 'Error saving debit card', error: err.message });
  }
});

router.get('/user', tokenVerification, async (req, res) => {
  const userId = req.userId; 
  try {
    const debitCards = await DebitCard.find({ userId });
    res.status(200).json(debitCards); 
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error fetching debit cards', error: err.message });
  }
});

router.put('/updateCard/:cardName', tokenVerification, async (req, res) => {
  console.log("Request Body:", req.body); 
  const { cardName, cardNumber, expirationDate, cvc, nameOnCard } = req.body;
  const userId = req.userId; 
  const requestedCardName = req.params.cardName; 
  console.log("Requested cardName:", requestedCardName); 
  console.log("UserId from token:", userId);
  if (!cardName || !cardNumber || !expirationDate || !cvc || !nameOnCard) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const card = await DebitCard.findOne({ cardName: requestedCardName, userId });
    if (!card) {
      console.log("Card not found with cardName:", requestedCardName); 
      return res.status(404).json({ message: 'Card not found or not authorized' });
    }
    card.cardName = cardName;
    card.cardNumber = cardNumber;
    card.expirationDate = expirationDate;
    card.cvc = cvc;
    card.nameOnCard = nameOnCard;
    await card.save();
    res.status(200).json(card);
  } catch (err) {
    console.error('Error updating card:', err);
    res.status(400).json({ message: 'Error updating debit card', error: err.message });
  }
});

router.delete('/deleteCard/:cardName', tokenVerification, async (req, res) => {
  console.log("Request Params:", req.params); 
  const userId = req.userId; //
  const requestedCardName = req.params.cardName; 

  console.log("Requested cardName:", requestedCardName); 
  console.log("UserId from token:", userId); 

  try {
    const card = await DebitCard.findOneAndDelete({ cardName: requestedCardName, userId });
    if (!card) {
      console.log("Card not found with cardName:", requestedCardName); 
      return res.status(404).json({ message: 'Card not found or not authorized' });
    }
    res.status(200).json({ message: 'Card deleted successfully', deletedCard: card }); 
  } catch (err) {
    console.error('Error deleting card:', err);
    res.status(400).json({ message: 'Error deleting debit card', error: err.message });
  }
});




module.exports = router;
