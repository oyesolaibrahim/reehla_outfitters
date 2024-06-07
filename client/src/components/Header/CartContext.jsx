import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children, initialCartItems }) => {
  const [cartItems, setCartItems] = useState(initialCartItems || []);
  const [cartValue, setCartValue] = useState(0);

  useEffect(() => {
    const initialCartValue = initialCartItems?.reduce((total, item) => total + item.quantity, 0);
    setCartValue(initialCartValue);
  }, [initialCartItems]);

  const addItemToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
    setCartValue((prevValue) => prevValue + item.quantity);
  };
  const removeItemFromCart = (itemId) => {
    // Find the item in the cart by its ID
    const removedItem = cartItems.find((item) => item._id === itemId);
    if (removedItem) {
      // Subtract the quantity of the removed item from the cartValue
      setCartValue((prevValue) => prevValue - removedItem.quantity);
    }
    // Filter out the removed item from the cartItems
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
  };
  
  const clearCart = () => {
    setCartItems([]);
    setCartValue(0);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, cartValue, addItemToCart, removeItemFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
