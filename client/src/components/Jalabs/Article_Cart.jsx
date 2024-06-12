import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../Header/CartContext";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../Firebase";
import Swal from 'sweetalert2';

const Article_Cart = ({ sessionId }) => {
  const { cartValue, removeItemFromCart, setCartValue } = useCart(); // Import removeItemFromCart from CartContext
  const [myCarts, setMyCarts] = useState([]);
  const location = useLocation();
  const [subTotal, setSubTotal] = useState(0);
  const adminToken = sessionStorage.getItem("adminToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_SERVER}/api/cart?sessionId=${sessionId}`);
        const cartsWithImageUrls = await Promise.all(data.jalabs.map(async (myCart) => {
          try {
            const storageRef = ref(storage, myCart.itemDetails.imageUrl);
            const url = await getDownloadURL(storageRef);
            return {
              ...myCart,
              itemDetails: {
                ...myCart.itemDetails,
                imageUrl: url,
              },
            };
          } catch (error) {
            console.error("Error getting image URL:", error.message);
            return myCart;
          }
        }));
        setMyCarts(cartsWithImageUrls);
      } catch (error) {
        console.error('Error Fetching Jalabs in Cart', error);
      }
    };

    fetchData();
  }, [sessionId]);

  useEffect(() => {
    const totalPrice = myCarts.reduce((acc, item) => acc + item.totalPrice, 0);
    setSubTotal(totalPrice);
  }, [myCarts]);

  const removeJalab = async (jalabId, quantity) => {
    try {
      await axios.delete(`${process.env.REACT_APP_SERVER}/api/delete?jalabId=${jalabId}`);
      const updatedCarts = myCarts.filter(jalab => jalab._id !== jalabId);
      console.log(updatedCarts);
      setMyCarts(updatedCarts);
      const quantity = updatedCarts.reduce((acc, item) => acc + item.quantity, 0);
      console.log(quantity)
      removeItemFromCart(jalabId, quantity)
      console.log('Jalab deleted successfully');
    } catch (error) {
      console.error('Error deleting jalab:', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_SERVER}/api/deleteAll`);
      setMyCarts([]);
      setCartValue(0);
      console.log('Cart cleared successfully');
      Swal.fire('Deleted!', 'Your Cart has been deleted.');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleClearCart = () => {
    Swal.fire({
      title: 'Are you sure you want to clear All?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your cart is safe', 'error');
      }
    });
  };

  return (
    <>
      <div className="md:flex justify-between xs:min-h-screen">
        <div className="flex flex-col space-y-3 justify-between">
          
          {myCarts.map(myCart => (
            <div key={myCart._id} className="bg-red-200 max-h-62 min-h-62 sm:max-w-2/3 md:w-3/4 sm:min-w-36 md:min-w-36 p-10 m-5">
              <article className="relative sm:flex md:flex justify-between sm:items-center md:items-center">
                <img className="w-1/3 mb-5" src={myCart.itemDetails._doc?.imageUrl} alt="perfume-img" />
                <div>
                  <h3 className="sm:flex md:flex justify-center mt-10 font-semibold text-3xl">{myCart.itemDetails._doc?.name || myCart.itemDetails._doc?.productName}<span className="text-xl font-normal mt-1">({myCart.itemDetails._doc?.size || myCart.itemDetails._doc?.brandName || 52})</span></h3>
                  <h3 className="w-96 m-5 sm:text-center md:text-center">{myCart.description}</h3>
                  <div className="flex sm:space-x-10 sm:justify-center md:justify-between xs:space-x-20">
                    <h3 className="font-bold text-center">Qty: {myCart.quantity}</h3>
                    <h3 className="font-bold text-center">Price: #{myCart.totalPrice}</h3>
                  </div>
                </div>
              </article>
              <button onClick={() => removeJalab(myCart._id, myCart.quantity)} className="xs:mt-5 md:bottom-0 md:right-1/3 text-white mb-3 bg-amber-800 py-3 px-5 rounded-lg">Remove Jalab</button>
            </div>
          ))}
          {myCarts.length > 0 && (
            <button onClick={handleClearCart} className="text-white sm:w-1/6 xs:w-1/2 ml-5 mb-3 bg-amber-800 py-3 px-5 rounded-lg">Clear Cart</button>
          )}
          {myCarts.length === 0 && (
            <div className="bg-yellow-100 mt-10 sm:mx-auto md:ml-10 lg:ml-10 xs:mx-auto xs:w-4/5 rounded-lg py-5 px-5 lg:px-5 uppercase">
              <h3 className="text-2xl font-bold text-center">Sorry, Your Cart is empty</h3>
              <div className="relative mt-4 text-center">
                <i className="fa fa-shopping-cart fa-4x cursor-pointer mt-auto" aria-hidden="true"></i>
                <div className="bg-amber-800 rounded-full absolute top-0 left-1/2">
                  <p className="text-white text-center px-3 py-1">0</p>
                </div>
              </div>
              <div className="relative mt-4 text-xl">
                <Link to="/" className="text-amber-800">
                  <i className="fa fa-hand-o-left mr-5" aria-hidden="true"></i>
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
          {myCarts.length > 0 && (
            <div className="xs:px-5 xs:pt-10 sm:pt-10 sm:px-5">
              <div className="bg-red-200 p-5 lg:fixed md:w-1/3 lg:w-1/5 right-10 top-80 flex m-auto rounded-lg">
                <div>
                  <div className="mb-3">
                    <h3 className="mb-3">CART SUMMARY</h3>
                    <hr />
                  </div>
                  <div className="flex mb-3 justify-between">
                    <h4>Subtotal:</h4>
                    <h4 className="font-extrabold">₦{subTotal}</h4>
                  </div>
                  <hr className="mb-3" />
                  <Link to={"/checkout"} state={{ myCarts }}>
                    <p className="cursor-pointer font-bold rounded-lg bg-amber-800 py-3 px-5 text-white">CHECKOUT(₦{subTotal})</p>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Article_Cart;