import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../Header/CartContext";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import PaystackCheckoutForm from "./CheckOut_Form";
import { useLocation } from "react-router-dom";
import Swal from 'sweetalert2';

const Checkout = ({ sessionId }) => {
    const location = useLocation()
    const [cartItems, setCartItems] = useState([]);
    const [states, setStates] = useState([
        "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", 
        "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe",
        "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", 
        "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", 
        "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
    ]);
    const [paymentDiv, setPaymentDiv] = useState(false);
    const [subTotal, setSubTotal] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [total, setTotal] = useState(0);
    const [firstName, setFirstName] = useState(sessionStorage.getItem("User"));
    const [lastName, setLastName] = useState(sessionStorage.getItem("lastname"));
    const [email, setEmail] = useState(sessionStorage.getItem("email"));
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [successfulMsg, setSuccessfulMsg] = useState("");
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [paymentOption, setPaymentOption] = useState('');
    const [selectedState, setSelectedState] = useState("");
    const token = sessionStorage.getItem("userToken");

    const handlePaymentOptionChange = (event) => {
        setPaymentOption(event.target.value);
    };

    const Proceed = (e) => {
        e.preventDefault();
        paymentOption === "prepay-now" ? setPaymentDiv(true) : setPaymentDiv(false);
    };

    const Confirm = (e) => {
        e.preventDefault();
        const cartDetails = cartItems?.map(item => ({
            pricePerQuantity: item.pricePerQuantity,
            totalPrice: item.totalPrice,
            quantity: item.quantity,
            itemDetails: {
                name: item.itemDetails?.name || item.itemDetails?.productName,
                category: item.itemDetails?.category,
                price: item.itemDetails?.price,
                oldPrice: item.itemDetails?.oldPrice,
                description: item.itemDetails?.description,
                imageUrl: item.itemDetails?.imageUrl
            }
        }))
        console.log(cartDetails)
        const fetching = {
            method: 'POST',
            url: `${process.env.REACT_APP_SERVER}/api/user/checkout?sessionId=${sessionId}`,
            data: {
                firstName,
                lastName,
                email,
                state: selectedState,
                address,
                paymentOption,
                quantity,
                phone,
                subTotal,
                total,
                cartDetails
            }
        };
        axios(fetching)
            .then((result) => {
                setSuccessfulMsg(result.data.message);
                setError("");
                Swal.fire({
                    icon: 'success',
                    title: successfulMsg,
                    text: result.data.message,
                });
    
            })
            .catch((error) => {
                setError(error.response.data.message);
                setSuccessfulMsg("");
                Swal.fire({
                    icon: 'error',
                    //title: successfulMsg,
                    text: error.response.data.message,
                });
            });
    };
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const result = await axios.get(`${process.env.REACT_APP_SERVER}/api/cart?sessionId=${sessionId}`);
                setCartItems(result.data.jalabs || []);
                console.log(cartItems);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setCartItems([]); 
            }
        };
    
        fetchCartItems();
       
        const totalPrice = cartItems?.reduce((acc, item) => acc + item.totalPrice, 0);
        setSubTotal(totalPrice);
        const totalQuantity = cartItems?.reduce((acc, item) => acc + item.quantity, 0);
        setQuantity(totalQuantity);
        setTotal(subTotal + deliveryFee)
      }, [sessionId, cartItems]);
    return (
        <>
            <Header />
            <main className="bg-gray-700 lg:p-16">
                <form className="rounded-lg xs:py-10 lg:ml-10 xs:ml-0 md:py-10 sm:py-10" onSubmit={(e) => Confirm(e)}>
                    <div className="bg-red-200 xs:p-10 md:flex rounded-2xl lg:px-16 py-4 lg:w-1/2 md:mx-auto md:p-10 sm:p-10 sm:w-4/5 sm:mx-auto md:w-2/3">
                        <div className="">
                            <div className="pt-20 mb-10 flex flex-col items-start space-y-3">
                                <label htmlFor="firstname">{token && "Firstname:"}</label>
                                <input className="rounded-lg sm:w-96 py-4 px-10 m-auto" type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="mb-10  flex flex-col items-start space-y-3">
                                <label htmlFor="lastname">{token && "Lastname:"}</label>
                                <input className="rounded-lg sm:w-96 py-4 px-10 m-auto" type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                            <div className="mb-10 flex flex-col items-start space-y-3">
                                <label htmlFor="email">{token && "Email:"}</label>
                                <input className="rounded-lg sm:w-96 py-4 px-10 m-auto" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="mb-10 flex justify-center">
                                <select className="sm:w-96 py-4 px-10" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                                    <option value="">Select a state</option>
                                    {states.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-10 flex justify-center">
                                <label htmlFor="address"></label>
                                <input className="rounded-lg sm:w-96 py-4 px-10" type="text" placeholder="Home Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>
                            <div className="mb-10 flex justify-center">
                                <label htmlFor="tel"></label>
                                <input className="rounded-lg sm:w-96 py-4 px-10" type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <h2 className="font-extrabold mb-5 text-3xl">Payment Options</h2>
                            <div>
                                <input
                                    type="radio"
                                    id="payment-on-delivery"
                                    name="payment-option"
                                    value="payment-on-delivery"
                                    checked={paymentOption === 'payment-on-delivery'}
                                    onChange={handlePaymentOptionChange}
                                />
                                <label className="" htmlFor="payment-on-delivery">Payment on Delivery</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    id="prepay-now"
                                    name="payment-option"
                                    value="prepay-now"
                                    checked={paymentOption === 'prepay-now'}
                                    onChange={handlePaymentOptionChange}
                                />
                                <label htmlFor="prepay-now">Pre-pay Now</label>
                            </div>
                            <button onClick={(e) => Proceed(e)} className="mt-10 cursor-pointer font-bold rounded-lg bg-red-800 py-3 px-5 w-1/3 text-white">Proceed</button>
                        </div>
                    </div>
                    {paymentDiv && (
                        <div>
                            <PaystackCheckoutForm total={total} />
                        </div>
                    )}
                    <div>
                        <div className="bg-yellow-100 p-5 lg:fixed sm:mt-10 lg:w-1/5 md:justify-center sm:w-4/5 sm:mx-auto xs:mt-10 right-10 top-1/3 flex md:static md:mx-auto md:w-2/3 rounded-lg">
                            <div>
                                <div className="mb-3">
                                    <h3 className="mb-3 font-extrabold">Order Summary</h3>
                                    <hr />
                                </div>
                                <div className="flex mb-3 justify-between">
                                    <h4>Item's total ({quantity}):</h4>
                                    <h4 className="font-extrabold">₦{subTotal}</h4>
                                </div>
                                <hr className="mb-3" />
                                <div className="flex mb-3 justify-between">
                                    <h4>Delivery Fee:</h4>
                                    <h4 className="font-extrabold">₦{deliveryFee}</h4>
                                </div>
                                <hr className="mb-3" />
                                <div className="flex mb-3 justify-between">
                                    <h4>Total:</h4>
                                    <h4 className="font-extrabold">₦{total}</h4>
                                </div>
                                <hr className="mb-3" />
                                <button onClick={(e) => Confirm(e)} className="cursor-pointer font-bold rounded-lg bg-red-800 py-3 px-5 text-white">CONFIRM ORDER</button>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
            <Footer />
        </>
    );
};

export default Checkout;
