import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddJalabsForm from "../Jalabs/jalabForm";
import Swal from 'sweetalert2';
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../Firebase";

const FemaleArticle = ({ femaleJalabs }) => {
    const [objects, setObjects] = useState([]);
    const adminToken = sessionStorage.getItem("adminToken");

    useEffect(() => {
        if (femaleJalabs) {
            const fetchImages = async () => {
                try {
                    const brandsWithImages = await Promise.all(femaleJalabs.map(async (jalab) => {
                        const imageUrl = await getDownloadURL(ref(storage, jalab.imageUrl));
                        return { ...jalab, imageUrl };
                    }));
                    setObjects(brandsWithImages);
                } catch (error) {
                    console.log('Error fetching images:', error);
                }
            };
            fetchImages();
        }
    }, [femaleJalabs]);

    const removeJalab = async (jalabId) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_SERVER}/api/deletesinglemalejalab?jalabId=${jalabId}`);
            console.log('Jalab deleted successfully:', response);
            setObjects(objects.filter(object => object._id !== jalabId));
        } catch (error) {
            console.log('Error deleting jalab:', error);
        }
    };

    const clearJalab = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_SERVER}/api/deleteallmalejalabs`);
            setObjects([]);
            console.log('All brands cleared successfully');
        } catch (error) {
            console.log('Error clearing brands:', error);
        }
    };

    if (!femaleJalabs) {
        return <div>Loading...</div>;
    }

    if (femaleJalabs.length === 0) {
        return <div className="text-white ml-10">No jalabs available.</div>;
    }

    return (
        <>
            <div className="flex flex-wrap space-y-6 xs:justify-center sm:pl-5 sm:justify-between md:justify-between sm:items-center md:items-center">
                {objects?.map(jalab => (
                    <article key={jalab._id} className={`bg-yellow-100 xs:my-3 width vh ${adminToken ? "xsvhsp" : "xsvh"} xs:mx-1 xs:py-1 sm:p-10 lg:m-4 md:m-3 sm:my-5 sm:mx-2 xs:p-2`}>
                        <Link to={`/jalabs/${jalab._id}`} state={{ jalab }}>
                            <img className="xs:flex xs:p-3 xs:justify-center" src={jalab.imageUrl} alt="jalab-img" />
                        </Link>
                        <div className="flex sm:justify-between md:justify-between xs:justify-center space-x-4 xs:py-10">
                            <h3 className="flex justify-center sm:mt-10 md:mt-10 xs:mt-10 font-semibold sm:text-xl md:text-xl xs:text-xs">{jalab.name}</h3>
                            <h3 className="flex justify-center sm:mt-10 md:mt-10 xs:mt-10 font-semibold sm:text-xl md:text-xl xs:text-xs">₦{jalab.price}</h3>
                        </div>
                        {adminToken && (
                            <div className="flex lg:flex-row xs:flex-col xs:space-y-3 xs:items-center sm:flex-col sm:items-center sm:space-y-3md:justify-between lg:justify-between lg:space-x-5 md:space-x-5 mt-3">
                                <button onClick={() => removeJalab(jalab._id)} className="bg-red-800 text-sm text-white rounded-lg sm:py-3 sm:px-5 xs:px-1 xs:py-2" type="button">Delete Jalab</button>
                                <Link to={`/edit/${jalab._id}`}><button className="bg-red-800 text-sm text-white rounded-lg sm:py-3 sm:px-5 xs:px-1 xs:py-2" type="button">Edit Jalab</button></Link>
                            </div>
                        )}
                    </article>
                ))}
            </div>
            {adminToken && objects.length > 0 && (
                <div className="flex justify-between space-x-5 mt-3 pl-20">
                    <button onClick={clearJalab} className="bg-red-800 text-sm text-white rounded-lg py-3 px-5" type="button">Delete All Products</button>
                </div>
            )}
            {adminToken && <AddJalabsForm />}
        </>
    );
};

export default FemaleArticle;
