const mongoose = require('mongoose');

const debitCardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    cardName: {
      type: String,
      required: true,
    },
    cardNumber: {
      type: String,
      required: true,
      minlength: 16, 
      maxlength: 19,
    },
    expirationDate: {
      type: String, 
      required: true,
    },
    cvc: {
      type: String,
      required: true,
      minlength: 3, 
      maxlength: 3, 
    },
    nameOnCard: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('DebitCard', debitCardSchema);
