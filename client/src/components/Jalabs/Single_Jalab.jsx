import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useCart } from "../Header/CartContext";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../Firebase";
import Swal from 'sweetalert2';

const Single_Jalab = ({ sessionId }) => {
    const { cartValue, changeCartValue } = useCart();
    const { addItemToCart } = useCart();
    const [error, setError] = useState("");
    const [successfulMessage, setSuccesfulMessage] = useState("");
    const [quantity, setQuantity] = useState(0);
    const location = useLocation();
    let { jalab, object } = location.state || {};
    console.log(location.state);
    if (!object) object = jalab;
    const [totalPrice, setTotalPrice] = useState(object?.price || 0);
    const [pricePerQuantity, setPricePerQuantity] = useState(object?.price || 0);
    const [imageUrl, setImageUrl] = useState("");

    const plus = () => setQuantity(prevState => parseInt(prevState, 10) + 1);
    const minus = () => setQuantity(prevState => (prevState > 0 ? prevState - 1 : prevState));

    const calculateTotalPrice = () => setTotalPrice(quantity * pricePerQuantity);

    const addToCart = (e) => {
        e.preventDefault();
        if (!object) return; 
        const fetching = {
            method: 'POST',
            url: `${process.env.REACT_APP_SERVER}/api/cart?sessionId=${sessionId}`,
            data: {
                pricePerQuantity: pricePerQuantity,
                totalPrice: totalPrice,
                quantity: quantity,
                itemDetails: {
                    name: object.name || object.productName,
                    category: object.category,
                    price: object.price,
                    oldPrice: object.oldPrice,
                    description: object.description,
                    imageUrl: object.imageUrl
                }
            }
        };

        axios(fetching)
            .then((result) => {
                setSuccesfulMessage(result.data.message);
                setError("");
                setTimeout(() => setSuccesfulMessage(""), 10000);

                const item = { ...object, quantity, totalPrice };
                addItemToCart(item);
                Swal.fire({
                    icon: 'success',
                    title: successfulMessage,
                    text: result.data.message,
                });

            })
            .catch((error) => {
                setError(error.response ? error.response.data.message : "An error occurred while adding to cart");
                setSuccesfulMessage("");
                Swal.fire({
                    icon: 'error',
                    text: error.response.data.message,
                });
            });
    };

    useEffect(() => calculateTotalPrice(), [quantity]);
    useEffect(() => setTotalPrice(object?.price || 0), [sessionId]);

    useEffect(() => {
        if (!object) return; 
        const getImageUrl = async () => {
            try {
                const storageRef = ref(storage, object.imageUrl);
                const url = await getDownloadURL(storageRef);
                setImageUrl(url);
            } catch (error) {
                console.error("Error getting image URL:", error.message);
                setError("Error getting image URL");
            }
        };
        getImageUrl();
    }, [object?.imageUrl]);

    return (
        <>
            <Header />
            <main className="bg-soft-ivory text-charcoal-gray  overflow-x-hidden">
                <div className="md:flex relative bg-soft-ivory text-charcoal-gray sm:p-20 md:p-20 xs:py-10 xs:px-5">
                    <div>
                        <img className="rounded-lg" src={imageUrl} alt="jalab-img" />
                    </div>
                    <div className="sm:py-10 xs:py-10 xs:px-5 md:ml-36">
                        <form onSubmit={addToCart}>
                            <div>
                                <h2 className="text-4xl font-extrabold">{object?.name || object?.productName}<span className="text-xl ml-2">({object?.category})</span></h2>
                                <p className="mt-20">{object?.description}</p>
                                <div className="mt-12 flex sm:space-x-10 md:space-x-10 xs:justify-center xs:-space-x-32">
                                    <input className="font-bold text-2xl outline-none bg-soft-ivory" readOnly value={`₦${totalPrice}`} />
                                    <p className="text-2xl font-extralight line-through">₦{object?.oldPrice}</p>
                                </div>
                            </div>
                            <div className="flex items-center mt-16 sm:space-x-20 xs:space-x-5">
                                <div className="flex items-center sm:space-x-10 md:space-x-10 bg-primary-brown sm:w-48 md:w-48 py-3 px-5 text-white justify-center rounded-lg">
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

export default Single_Jalab;
