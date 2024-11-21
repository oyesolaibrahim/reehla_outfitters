import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../Header/CartContext";
import Footer from "../../Footer/Footer";
import Header from "../../Header/Header";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../Firebase";
import Swal from 'sweetalert2';

const Single_Fragrance = ({ sessionId }) => {
    const { addItemToCart } = useCart();
    const [error, setError] = useState("");
    const [successfulMessage, setSuccessfulMessage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const location = useLocation();
    const { fragrance, object, brand } = location.state || {};
    const [totalPrice, setTotalPrice] = useState(fragrance?.price || object?.price || 0);
    const [pricePerQuantity, setPricePerQuantity] = useState(fragrance?.price || object?.price || 0);
    const [imageUrl, setImageUrl] = useState("");

    const plus = () => setQuantity(prevState => prevState + 1);
    const minus = () => setQuantity(prevState => (prevState > 1 ? prevState - 1 : prevState));

    const calculateTotalPrice = () => {
        setTotalPrice(quantity * pricePerQuantity);
    };

    const addToCart = async (e) => {
        e.preventDefault();
        if (!fragrance && !object) return;

        const itemDetails = {
            name: fragrance?.productName || object?.productName,
            brandName: fragrance?.brandName || object?.brandName,
            category: fragrance?.category || object?.category,
            price: fragrance?.price || object?.price,
            oldPrice: fragrance?.oldPrice || object?.oldPrice,
            description: fragrance?.description || object?.description,
            imageUrl: fragrance?.imageUrl || object?.imageUrl
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER}/api/cart?sessionId=${sessionId}`, {
                pricePerQuantity,
                totalPrice,
                quantity,
                itemDetails
            });

            setSuccessfulMessage(response.data.message);
            setError("");
            setTimeout(() => setSuccessfulMessage(""), 10000);

            const item = { ...itemDetails, quantity, totalPrice };
            addItemToCart(item);

            Swal.fire({
                icon: 'success',
                title: 'Added to Cart',
                text: response.data.message,
            });

        } catch (error) {
            const errorMsg = error.response ? error.response.data.message : "An error occurred while adding to cart";
            setError(errorMsg);
            setSuccessfulMessage("");

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMsg,
            });
        }
    };

    useEffect(() => calculateTotalPrice(), [quantity]);
    useEffect(() => {
        if (fragrance?.imageUrl || object?.imageUrl) {
            const getImageUrl = async () => {
                try {
                    const storageRef = ref(storage, fragrance?.imageUrl || object?.imageUrl);
                    const url = await getDownloadURL(storageRef);
                    setImageUrl(url);
                } catch (error) {
                    console.error("Error getting image URL:", error.message);
                    setError("Error getting image URL");
                }
            };
            getImageUrl();
        }
    }, [fragrance?.imageUrl, object?.imageUrl]);

    return (
        <>
            <Header />
            <main className="text-charcoal-gray bg-soft-ivory overflow-x-hidden">
                <div className="md:flex relative bg-soft-ivory border border-muted-gold rounded-lg shadow-lg sm:p-20 md:p-20 xs:py-10 xs:px-5">
                    <div>
                        <img className="rounded-lg" src={imageUrl || fragrance?.imageUrl || object?.imageUrl} alt="fragrance-img" />
                    </div>
                    <div className="sm:py-10 xs:py-10 xs:px-5 md:ml-36">
                        <form onSubmit={addToCart}>
                            <div>
                                <h2 className="text-4xl font-extrabold">{fragrance?.productName || object?.productName}
                                    <span className="text-xl ml-2">({fragrance?.category || object?.category})</span>
                                </h2>
                                <h2 className="text-2xl mt-5 font-bold">{fragrance?.brandName || object?.brandName}</h2>
                                <p className="mt-20">{fragrance?.description || object?.description}</p>
                                <div className="mt-12 flex sm:space-x-10 md:space-x-10 xs:justify-center xs:-space-x-32 text-charcoal-gray">
                                    <input className="font-bold text-2xl outline-none text-charcoal-gray bg-soft-ivory" readOnly value={`₦${totalPrice}`} />
                                    <p className="text-2xl font-extralight line-through text-charcoal-gray">₦{fragrance?.oldPrice || object?.oldPrice}</p>
                                </div>
                            </div>
                            <div className="flex items-center mt-16 sm:space-x-20 xs:space-x-5">
                                <div className="flex items-center sm:space-x-10 md:space-x-10 bg-primary-brown text-soft-ivory sm:w-48 md:w-48 py-3 px-5 justify-center rounded-lg">
                                    <i className="fa fa-minus cursor-pointer" aria-hidden="true" onClick={minus}></i>
                                    <input className="w-16 bg-primary-brown text-soft-ivory text-center outline-none" value={quantity} readOnly />
                                    <i className="fa fa-plus cursor-pointer" aria-hidden="true" onClick={plus}></i>
                                </div>
                                <button type="submit" className="bg-primary-brown text-soft-ivory text-center cursor-pointer w-36 py-3 px-5 rounded-lg">
                                    Add to Cart
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Single_Fragrance;
