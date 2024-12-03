const express = require("express");
const router = express.Router();
const Cart = require("../models/CartSchema"); 
const tokenVerification = require('../middlewear/tokenVerification');


router.post("/addcart", tokenVerification, async (req, res) => {
  try {
    const { id, name, price, imageUrl, quantity } = req.body;
    const userEmail = req.userId;
    const itemId = String(id);
    console.log("Incoming request body:", req.body); 
    let userCart = await Cart.findOne({ userEmail });
    if (!userCart) {
      userCart = new Cart({ userEmail, cartItems: [] });
    }
    const existingItem = userCart.cartItems.find(item => item.id === itemId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem = {
        id: itemId,
        name,
        price,
        imageUrl,
        quantity,
      };
      console.log("Adding new cart item:", newItem);
      userCart.cartItems.push(newItem);
    }
    console.log("Updated cartItems before saving:", userCart.cartItems);
    userCart.cartItems = userCart.cartItems.map(item => ({
      id: String(item.id),
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      quantity: item.quantity || 1,
    }));
    await userCart.save();

    res.status(200).json({ message: "Item added to cart", data: userCart });
  } catch (error) {
    console.error("Error saving cart:", error.message);
    res.status(500).json({ message: "Failed to add item to cart", error: error.message });
  }
});

router.get("/usercart", tokenVerification, async (req, res) => {
  try {
    const userEmail = req.userId; 
    const userCart = await Cart.findOne({ userEmail });
    if (!userCart) {
      return res.status(404).json({ message: "Cart not found for this user." });
    }
    res.status(200).json({ message: "User cart fetched successfully", data: userCart });
  } catch (error) {
    console.error("Error fetching user cart:", error.message);
    res.status(500).json({ message: "Failed to fetch user cart", error: error.message });
  }
});

router.get("/usercart/:useremail",  async (req, res) => {
  try {
    const {userEmail  } = req.params;
    const userCart = await Cart.findOne({ userEmail });

    if (!userCart) {
      return res.status(404).json({ message: "Cart not found for this user." });
    }
    res.status(200).json({ message: "User cart fetched successfully", data: userCart });
  } catch (error) {
    console.error("Error fetching user cart:", error.message);
    res.status(500).json({ message: "Failed to fetch user cart", error: error.message });
  }
});


router.delete('/usercart/:itemId', tokenVerification, async (req, res) => {
  try {
    const userId = req.userId;  
    const { itemId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'User not authenticated' });
    }
    console.log('Removing item with ID:', itemId, 'for user:', userId);
    const updatedCart = await Cart.findOneAndUpdate(
      { userEmail: userId }, 
      {
        $inc: { "cartItems.$[elem].quantity": -1 }  
      },
      {
        arrayFilters: [{ "elem.id": itemId }], 
        new: true
      }
    );
    if (!updatedCart) {
      return res.status(404).json({ message: 'Cart not found or item does not exist' });
    }
    const item = updatedCart.cartItems.find(item => item.id === itemId);
    if (item && item.quantity <= 0) {
      const finalCart = await Cart.findOneAndUpdate(
        { userEmail: userId },
        { $pull: { cartItems: { id: itemId } } },  
        { new: true }
      );
      return res.status(200).json({
        message: 'Item removed from cart successfully',
        cartItems: finalCart.cartItems,
      });
    }

    console.log('Updated Cart:', updatedCart);
    res.status(200).json({
      message: 'Item quantity decreased',
      cartItems: updatedCart.cartItems,  
    });
  } catch (error) {
    console.error('Error deleting item from cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;