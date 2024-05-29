import React, { useEffect, useState } from "react";
import Asad from "../../assets/shared/asad.png";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../Header/CartContext";
import Swal from 'sweetalert2';

const Article_Cart = ({ sessionId }) => {
  const { cartValue } = useCart();
  const [ myCarts, setMyCarts ] = useState([]);
  const location = useLocation();
  const [subTotal, setSubTotal] = useState(0);
const adminToken = sessionStorage.getItem("adminToken")
useEffect(() => {
  const fetching =  {
    method: 'GET',
    url : `http://localhost:4000/api/cart?sessionId=${sessionId}`
}
axios(fetching)
.then((result) => {
    console.log(result.data.jalabs);
    setMyCarts(result.data.jalabs)
     console.log(myCarts)
    })
  . catch ((error) => {
    console.log('Error Fetching Jalabs in Cart', error);
  })
}, [sessionId, myCarts])

 
useEffect(() => {
    const totalPrice = myCarts.reduce((acc, item) => acc + item.totalPrice, 0);
    setSubTotal(totalPrice);
  }, [myCarts]);

  const removeJalab = (jalabId) => {
    const fetching = {
        method: 'DELETE',
        url: `http://localhost:4000/api/delete?jalabId=${jalabId}`,
    };

    axios(fetching)
        .then((response) => {
            setMyCarts(myCarts.filter(jalab => jalab._id !== jalabId));
            console.log('Jalab deleted successfully:', response);
        })
        .catch((error) => {
            console.log('Error deleting jalab:', error);
        });
};

const handleClearCart = () => {
  Swal.fire({
      title: 'Are you sure you want to clear All?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
  }).then((result) => {
      if (result.isConfirmed) {
          clearCart();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your cart is safe', 'error');
      }
  });
};
const clearCart = () => {
    const fetching = {
        method: 'DELETE',
        url: 'http://localhost:4000/api/deleteAll',
    };

    axios(fetching)
        .then(() => {
            setMyCarts([]);
            console.log('Cart cleared successfully');
            Swal.fire('Deleted!', 'Your Cart has been deleted.')
          })
        .catch((error) => {
            console.log('Error clearing cart:', error);
        });
};


  return (
    <>  
      <div className="md:flex justify-between xs:min-h-screen">
        <div className="flex flex-col space-y-3 justify-between">
          {myCarts.map(myCart => (
            <div className="bg-yellow-100 max-h-62 min-h-62 sm:max-w-2/3 md:w-3/4 sm:min-w-36 md:min-w-36 p-10 m-5">
            <article key={myCart._id} className=" relative sm:flex md:flex justify-between sm:items-center md:items-center">
              <img className="w-1/3 mb-5" src={`http://localhost:4000/${myCart.itemDetails?.imageUrl}`} alt="perfume-img"/>
              <div>
                <h3 className="sm:flex md:flex justify-center mt-10 font-semibold text-3xl">{myCart.itemDetails?.name || myCart.productName}</h3>
                <h3 className="w-96 m-5 sm:text-center md:text-center">{myCart.description}</h3>
                <div className="flex sm:space-x-10 sm:justify-center md:justify-between xs:space-x-20">
                  <h3 className="font-bold text-center">Qty: {myCart.quantity}</h3>
                  <h3 className="font-bold text-center">Price: #{myCart.totalPrice}</h3>
                </div>
              </div>
            </article>
               <button onClick={() => removeJalab(myCart._id)} className=" xs:mt-5 md:bottom-0 md:right-1/3 text-white mb-3 bg-red-800 py-3 px-5 rounded-lg">Remove Jalab</button>
            </div>
          ))}
       {myCarts.length === 0 || <button onClick={handleClearCart} className="text-white sm:w-1/6 xs:w-1/2 ml-5 mb-3 bg-red-800 py-3 px-5 rounded-lg">Clear Cart</button>} 
          {myCarts.length === 0 && (
        <div className="bg-yellow-100 mt-10 sm:ml-10 md:ml-10 lg:ml-10 xs:mx-auto xs:w-4/5 rounded-lg py-5 px-5 uppercase">
            <h3 className="text-2xl font-bold text-center">Sorry, Your Cart is empty</h3>
            <div className="relative mt-4 text-center">
                <i className="fa fa-shopping-cart fa-4x cursor-pointer mt-auto" aria-hidden="true"></i>
                <div className="bg-red-800 rounded-full absolute top-0 left-1/2">
                  <p className=" text-white text-center px-3 py-1">0</p>
                </div>
              </div>
              <div className="relative mt-4 text-xl">
                <Link to="/" className="text-red-800">
                  <i className="fa fa-hand-o-left mr-5" aria-hidden="true"></i>
                  Continue Shopping
                </Link>
              </div>
        </div>
        ) }
          
        <div>
          <div className="xs:px-5 xs:pt-10 sm:pt-10 sm:px-5">
            <div className="bg-yellow-100 p-5 lg:fixed md:w-1/3 lg:w-1/5 right-10 top-1/3 flex m-auto rounded-lg">
              <div>
                <div className="mb-3">
                  <h3 className="mb-3">CART SUMMARY</h3>
                  <hr/>
                </div>
                <div className="flex mb-3 justify-between">
                  <h4>Subtotal:</h4>
                  <h4 className="font-extrabold">₦{subTotal}</h4>
                </div>
                <hr className="mb-3"/>
                <Link to={"/checkout"} state={{myCarts}}>
                  <p className="cursor-pointer font-bold rounded-lg bg-red-800 py-3 px-5 text-white">CHECKOUT(₦{subTotal})</p> 
                </Link>
              </div>
            </div>
          </div>
        </div>
       
        </div>
      </div>
    </>
  );
};

export default Article_Cart;
