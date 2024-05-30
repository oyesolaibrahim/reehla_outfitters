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
