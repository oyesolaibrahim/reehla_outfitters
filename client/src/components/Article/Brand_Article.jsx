import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import TopForm from "../Home/Top_Form";
import Swal from 'sweetalert2';

const Brand_Article = () => {
    const [brandName, setBrandName] = useState("");
    const [objects, setObjects] = useState([]);
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");
    const [id, setId] = useState("");
    const [noDisplay, setNoDisplay] = useState(false);

    const removeBrand = async (brandId) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_SERVER}/api/deletetopbrand?brandId=${brandId}`);
            console.log('Brand deleted successfully:', response);
            setObjects(objects.filter(object => object._id !== brandId)); 
            setId(brandId); 
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
            await axios.delete(`${process.env.REACT_APP_SERVER}/api/deletetopbrands`);
            setObjects([]); 
            alert('Are you sure you want to delete all?');
        } catch (error) {
            console.log('Error clearing brands:', error);
        }
    };

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER}/api/topbrand`);
                const brandsWithFullImageUrl = response.data.brands.map(brand => ({
                    ...brand,
                    imageUrl: `${process.env.REACT_APP_SERVER}/${brand.imageUrl}`
                }));
                setObjects(brandsWithFullImageUrl);
            } catch (error) {
                console.log('Error getting brands:', error);
            }
        };
        fetchBrands();
    }, []);

    const adminToken = sessionStorage.getItem("adminToken");
    return (
        <>  
            <div className="flex lg:pl-10 xs:justify-between md:pl-10 sm:pl-0 xs:px-2 flex-wrap sm:px-3 items-center">
                {objects?.map(object => (
                    <article key={object._id} className={`bg-yellow-100 xs:my-3 width vh ${adminToken ? "xsvhs" : "xsvh"} xs:mx-1 xs:py-1 sm:p-10 lg:m-4 md:m-3 sm:my-5 sm:mx-2 xs:p-2`}>
                        <Link to="/brand">
                            <img className="xs:p-1 xs:w-full xs:h-full xs:justify-center" src={object.imageUrl} alt="brand-img"/>
                        </Link>    
                        <h3 className="flex justify-center sm:mt-10 md:mt-10 xs:mt-5 font-semibold sm:text-3xl md:text-3xl">{object.brandName}</h3>
                        {/* <h3 className="flex justify-center sm:mt-10 md:mt-10 xs:mt-5 font-semibold text-center p-width">{object.description}</h3> */}
                        {adminToken && (
                            <div className="flex xs:flex-col xs:space-y-3 xs:items-center sm:flex-col sm:items-center sm:space-y-3 md:justify-between lg:flex-row lg:justify-between lg:space-x-5 md:space-x-5 my-3">
                                <button onClick={() => removeBrand(object._id)} className="bg-red-800 text-sm text-white rounded-lg sm:py-3 sm:px-5 xs:px-1 xs:py-2" type="button">Delete Brand</button>
                                <Link to={`/edit/${object._id}`}><button className="bg-red-800 text-sm text-white rounded-lg sm:py-3 sm:px-5 xs:px-1 xs:py-2" type="button">Edit Brand</button></Link>
                            </div>
                        )}     
                    </article>
                ))}
            </div> 
            {adminToken && objects.length > 0 && (
                <div className="flex justify-between space-x-5 mt-3 pl-20">
                    <button onClick={handleClearBrand} className="bg-red-800 text-sm text-white rounded-lg py-3 px-5" type="button">Delete All Brands</button>
                </div> 
                )} {adminToken &&  (
            <TopForm/>
            )}
            
        </>
    );
}

export default Brand_Article;
