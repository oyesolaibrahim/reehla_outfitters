import { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import BestFragranceForm from "../../Forms/Best";

const Best_Article = () => {
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchBestFragrance = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER}/api/getbestfragrance`);
                console.log('Best fragrances fetched successfully:', response);
    
                setObjects(response.data.fragrance);
                setLoading(false); 
            } catch (error) {
                console.log('Error fetching best fragrances:', error);
                setLoading(false); 
            }
        };
    
        fetchBestFragrance();
    }, []);

    const removeBestSeller = async (bestId) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_SERVER}/api/deletebestseller?bestId=${bestId}`);
            console.log('Best seller deleted successfully:', response);
            setObjects(objects.filter(object => object._id !== bestId)); 
        } catch (error) {
            console.log('Error deleting best seller:', error);
        }
    };

    const handleClearBestSellers = () => {
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
                clearBestSellers();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled');
            }
        });
    };

    const clearBestSellers = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_SERVER}/api/deletebestsellers`);
            setObjects([]);
            alert('All best sellers deleted successfully');
        } catch (error) {
            console.log('Error clearing best sellers:', error);
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
                            <Link to={`/fragrances/${object._id}`} state={{ object }}>
                                <img className="xs:p-1 xs:w-full xs:h-full xs:justify-center" src={object.imageUrl} alt="fragrance-img"/>
                            </Link>    
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="sm:mt-10 md:mt-10 xs:mt-5 font-semibold sm:text-3xl md:text-3xl">{object.productName}</h3>
                            </div>
                            <div className="flex lg:flex-row items-center justify-between xs:flex-col xs:space-y-3">
                                <h3 className="font-semibold xs:text-sm">₦{object.price}</h3>
                                <h3 className="font-semibold xs:text-sm">({object.category})</h3>
                            </div> 
                            {adminToken && (
                                <div className="flex lg:flex-row items-center md:justify-between lg:justify-between lg:space-x-5 md:space-x-5 my-3 xs:flex-col xs:space-y-3 xs:items-center sm:flex-col sm:items-center sm:space-y-3">
                                    <button onClick={() => removeBestSeller(object._id)} className="bg-red-800 text-sm text-white rounded-lg sm:py-3 sm:px-5 xs:px-1 xs:py-2" type="button">Delete Product</button>
                                    <Link to={`/edit/${object._id}`}><button className="bg-red-800 text-sm text-white rounded-lg sm:py-3 sm:px-5 xs:px-1 xs:py-2" type="button">Edit Product</button></Link>  
                                </div>
                            )}
                        </article>
                    ))
                )}
            </div>
            {adminToken && objects.length > 0 && (
                <div className="flex justify-between space-x-5 mt-3 pl-20">
                    <button onClick={handleClearBestSellers} className="bg-red-800 text-sm text-white rounded-lg py-3 px-5" type="button">Delete All Fragrance Products</button>
                </div>
            )} 
            {/* {adminToken && <BestFragranceForm />} */}
        </>
    );
};

export default Best_Article;
