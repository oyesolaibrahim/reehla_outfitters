import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../Header/CartContext";
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";

const Admin_Cart = ({ sessionId, myOrders }) => {
    const [myCarts, setMyCarts] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const { cartValue, changeCartValue } = useCart();
    const [totalItems, setTotalItems] = useState(0);
    const [deliveryFee, setDeliveryFee] = useState(0); // State for delivery fee

    useEffect(() => {
        const fetching = {
            method: 'GET',
            url: `${process.env.REACT_APP_SERVER}/api/orders`
        };
        axios(fetching)
            .then((result) => {
                console.log(result.data.carts);
                setMyCarts(result.data.carts);
                const totalPrice = result.data.carts?.reduce((acc, item) => acc + item.total, 0);
                setSubTotal(totalPrice);

                const totalItemCount = result.data.carts?.reduce((acc, cart) => {
                    return acc + cart.cartDetails.reduce((itemAcc, item) => itemAcc + item.quantity, 0);
                }, 0);
                setTotalItems(totalItemCount);
                
                // Assuming the delivery fee is fetched from the server
                // setDeliveryFee(result.data.deliveryFee || 0);
            })
            .catch((error) => {
                console.log('Error Fetching Jalabs in Cart', error);
            });
    }, []);

    const removeJalab = (clientId) => {
        console.log(clientId);
        const fetching = {
            method: 'DELETE',
            url: `${process.env.REACT_APP_SERVER}/api/deleteoneclient?clientId=${clientId}`,
        };

        axios(fetching)
            .then((response) => {
                setMyCarts(myCarts?.filter(client => client._id !== clientId)); // Use client._id instead of jalabId
                console.log('Client deleted successfully:', response);
            })
            .catch((error) => {
                console.log('Error deleting client:', error);
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
                Swal.fire('Cancelled', 'Orders are safe', 'error');
            }
        });
    };

    const clearCart = () => {
        const fetching = {
            method: 'DELETE',
            url: `${process.env.REACT_APP_SERVER}/api/deleteallclients`,
        };

        axios(fetching)
            .then(() => {
                setMyCarts([]);
                console.log('Cart cleared successfully');
                Swal.fire('Deleted!', 'Orders have been deleted.', 'success');
            })
            .catch((error) => {
                console.log('Error clearing cart:', error);
            });
    };

    const handleDeliveryFeeChange = (e) => {
        setDeliveryFee(parseFloat(e.target.value));
    };

    const saveDeliveryFee = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_SERVER}/api/delivery`, { deliveryFee });
            Swal.fire('Success!', 'Delivery fee updated successfully.', 'success');
        } catch (error) {
            console.error('Error updating delivery fee:', error);
            Swal.fire('Error!', 'Failed to update delivery fee.', 'error');
        }
    };
    const deleteDeliveryFee = () => {
        try {
            axios.delete(`${process.env.REACT_APP_SERVER}/api/deletedelivery`);
            Swal.fire('Success!', 'Delivery fees deleted successfully.', 'success');
        } catch (error) {
            console.error('Error updating delivery fee:', error);
            Swal.fire('Error!', 'Failed to delete delivery fee.', 'error');
        }
    };
    return (
        <>
            <div>
                <div className="flex flex-col space-y-3
                justify-between">
                {myCarts.map(myCart => (
                    <article key={myCart._id} className="bg-red-200 flex flex-col relative sm:flex md:flex sm:items-center md:items-center max-h-62 min-h-62 sm:max-w-2/3 md:w-3/4 sm:min-w-36 md:min-w-36 p-10 m-5">
                        {myCart.cartDetails?.map((item, index) => (
                            <div key={index} className="flex xs:flex-col">
                                <img className="sm:w-1/6 h-1/2 flex flex-col" src={item.itemDetails?.imageUrl} alt="item-img" />
                                <div className="sm:ml-10">
                                    <h3 className="sm:flex md:flex justify-center mt-10 font-semibold text-2xl">{item.itemDetails?.name}</h3>
                                    <div className="flex my-3 justify-between space-x-20">
                                        <h3 className="font-bold">Firstname: {myCart.firstName}</h3>
                                        <h3 className="font-bold">Lastname: {myCart.lastName}</h3>
                                    </div>
                                    <div className="flex my-3 justify-between space-x-5">
                                        <h3 className="font-bold xs:text-xs">Email: {myCart.email}</h3>
                                        <h3 className="font-bold">Phone Number: {myCart.phone}</h3>
                                    </div>
                                    <div className="flex my-3 justify-between space-x-20">
                                        <h3 className="font-bold text-center">Qty: {item.quantity}</h3>
                                        <h3 className="font-bold text-center">Price: ₦{item.totalPrice}</h3>
                                    </div>
                                    <div className="flex my-3 justify-between space-x-20">
                                        <h3 className="font-bold text-center">State: {myCart.state}</h3>
                                        <h3 className="font-bold text-center">Address: {myCart.address}</h3>
                                    </div>
                                    <div className="flex my-3 justify-between space-x-20">
                                        <h3 className="font-bold text-center">Payment Option: {myCart.paymentOption}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => { removeJalab(myCart._id) }} className="md:absolute xs:mt-5 md:-bottom-2 md:right-1/3 text-white mb-3 bg-amber-800 py-3 px-5 rounded-lg">Remove Client</button>
                    </article>
                ))}
                {myCarts.length === 0 ? (
                    <div className="bg-red-200 mt-10 sm:ml-10 rounded-lg py-5 px-5 sm:w-1/3 xs:w-5/6 xs:mx-auto uppercase">
                        <h3 className="text-2xl font-bold">Sorry, Orders is empty</h3>
                        <div className="relative mt-4 text-center">
                            <i className="fa fa-shopping-cart fa-4x cursor-pointer mt-auto" aria-hidden="true"></i>
                            <div className="bg-amber-800 rounded-full absolute top-0 left-1/2">
                                <p className="text-white text-center px-3 py-1">0</p>
                            </div>
                        </div>
                    </div>
                ) : ""} 
                {myCarts.length === 0 ? "" : (
                    <button onClick={handleClearCart} className="ml-5 inline justify-center items-center sm:w-1/5 md:w-1/6 xs:w-1/2 text-white bg-amber-800 py-3 px-5 rounded-lg">Clear Cart</button>
                )}
            </div>

            <div>
                <div className="xs:px-5 xs:pt-10 sm:pt-10 sm:px-5">
                    <div className="bg-red-200 p-5 lg:fixed right-10 md:w-1/3 md:static lg:w-1/6 top-1/3 flex m-auto rounded-lg">
                        <form>
                            <div className="mb-3">
                                <h3 className="mb-3">CART SUMMARY</h3>
                                <hr />
                            </div>
                            <div className="flex mb-3 justify-between">
                                <h4>Subtotal ({totalItems}):</h4>
                                <h4 className="font-extrabold">₦{subTotal}</h4>
                            </div>
                            <div className="mb-10 flex justify-center">
                                <label htmlFor="deliveryFee">Delivery Fee:</label>
                                <input
                                    className="ml-2 p-2 border rounded"
                                    type="number"
                                    id="deliveryFee"
                                    placeholder="Delivery Fee"
                                    value={deliveryFee}
                                    onChange={handleDeliveryFeeChange}
                                />
                            </div>
                            <div className="flex mb-3 justify-between">
                                <h4>Total:</h4>
                                <h4 className="font-extrabold">₦{subTotal + deliveryFee}</h4>
                            </div>
                            <button
                                type="button"
                                onClick={saveDeliveryFee}
                                className="bg-amber-800 text-white py-2 px-4 rounded"
                            >
                                Save Delivery Fee
                            </button>
                            <hr className="mb-3" />
                        </form>
                          
                    </div>
                </div>
            </div>
            <button
                type="button"
                onClick={deleteDeliveryFee}
                className="bg-amber-800 mt-3 ml-5 text-white py-2 px-4 rounded"
            >
                Delete Delivery Fee
            </button>
                         
        </div>
    </>
);
};

export default Admin_Cart;
