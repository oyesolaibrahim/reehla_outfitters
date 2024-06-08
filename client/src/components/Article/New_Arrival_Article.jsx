import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import NewArrivalsForm from "../Home/New_Arrivals_Form";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../Firebase";
import ArrivalsFragranceForm from "../Fragrances/Forms/ArrivalForm";

const New_Arrival_Article = () => {
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchBrandsWithImages = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER}/api/newarrival`);
                const brands = response.data.jalab;
                const brandsWithImages = await Promise.all(brands.map(async (brand) => {
                    try {
                        const storageRef = ref(storage, brand.imageUrl);
                        const downloadUrl = await getDownloadURL(storageRef);
                        return {
                            ...brand,
                            imageUrl: downloadUrl
                        };
                    } catch (error) {
                        console.error("Error getting image URL:", error.message);
                        return { ...brand, imageUrl: '' };
                    }
                }));
                setObjects(brandsWithImages);
                setLoading(false); // Set loading to false when data is fetched
            } catch (error) {
                console.log('Error getting brands with images:', error);
                setLoading(false); // Set loading to false in case of error
            }
        };
        fetchBrandsWithImages();
    }, []);

    const removeBrand = async (newArrivalId) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_SERVER}/api/deletenewarrival?newArrivalId=${newArrivalId}`);
            setObjects(objects.filter(object => object._id !== newArrivalId)); 
        } catch (error) {
            console.log('Error deleting brand:', error);
        }
    };

    const handleClearBrand = () => {
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
                clearBrand();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled');
            }
        });
    };

    const clearBrand = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_SERVER}/api/deletenewarrivals`);
            setObjects([]); 
        } catch (error) {
            console.log('Error clearing brands:', error);
        }
    };

    const adminToken = sessionStorage.getItem("adminToken");

    return (
        <>  
            <div className="flex lg:pl-10 xs:justify-between md:pl-10 sm:pl-0 xs:px-2 flex-wrap sm:px-3 items-center">
                {loading ? (
                    <div className="flex justify-center items-center w-full h-full">
                        <i className="fas fa-spinner fa-spin text-4xl"></i>
                    </div>
                ) : (
                    objects?.map(object => (
                        <article key={object._id} className={`bg-red-200 xs:my-3 width vh ${adminToken ? "xsvhsp" : "xsvh"} xs:mx-1 xs:py-1 sm:p-10 lg:m-4 md:m-3 sm:my-5 sm:mx-2 xs:p-2`}>
                            <Link to={`/jalabs/${object._id}`} state={{ object }}>
                                <img className="xs:flex xs:p-3 xs:justify-center" src={object.imageUrl} alt="product-img"/>
                            </Link> 
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="sm:mt-10 md:mt-10 xs:mt-5 font-semibold sm:text-3xl md:text-3xl">{object.productName}</h3>
                            </div>
                            <div className="flex items-center justify-between xs:flex-col xs:space-y-3 xs:items-center">
                                <h3 className="font-semibold xs:text-sm">₦{object.price}</h3>
                                <h3 className="font-semibold xs:text-sm">({object.category})</h3>
                            </div> 
                            {adminToken && (
                                <div className="flex lg:flex-row xs:flex-col xs:space-y-3 xs:items-center sm:flex-col sm:items-center sm:space-y-3 md:justify-between lg:justify-between lg:space-x-5 md:space-x-5 mt-3">
                                    <button onClick={() => removeBrand(object._id)} className="bg-red-800 text-sm text-white rounded-lg sm:py-3 sm:px-5 xs:px-1 xs:py-2" type="button">Delete Product</button>
                                    <Link to={`/edit/${object._id}`}><button className="bg-red-800 text-sm text-white rounded-lg sm:py-3 sm:px-5 xs:px-1 xs:py-2" type="button">Edit Product</button></Link>  
                                </div>
                            )}
                        </article>
                    ))
                )}
            </div>
            {adminToken && objects.length > 0 && (
                <div className="flex justify-between space-x-5 mt-3 pl-20">
                    <button onClick={handleClearBrand} className="bg-red-800 text-sm text-white rounded-lg py-3 px-5" type="button">Delete All Products</button>
                </div>
            )}
            {adminToken &&
            <div className="flex md:justify-between xs:flex xs:flex-col xs:space-y-5 md:mx-10">
                <NewArrivalsForm />
                <ArrivalsFragranceForm/>
            </div>
            }
        </>
    );
};

export default New_Arrival_Article;
