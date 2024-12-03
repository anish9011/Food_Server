const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  about: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true 
});


const BurgerSchema = mongoose.model('BurgerSchema', imageSchema); 
const FriesSchema = mongoose.model('FriesSchema', imageSchema); 
const ColdSchema = mongoose.model('ColdSchema', imageSchema); 

module.exports = { BurgerSchema,FriesSchema,ColdSchema};
