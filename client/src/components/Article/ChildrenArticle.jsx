import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddJalabsForm from "../Jalabs/jalabForm";
import Swal from 'sweetalert2';
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../Firebase";

const ChildrenArticle = ({ childrenJalabs }) => {
    const [objects, setObjects] = useState([]);
    const adminToken = sessionStorage.getItem("adminToken");
    useEffect(() => {
        const fetchJalabs = async () => {
          try {
            const [jalabsResponse] = await Promise.all([
              axios.get(`${process.env.REACT_APP_SERVER}/api/childrenjalab`),
            ]);
            setObjects(jalabsResponse.data.jalabs);
            console.log(objects)
          } catch (error) {
            console.error('Error fetching jalabs:', error.message);
          }
        };
        fetchJalabs();
      }, []);
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

    if (!childrenJalabs) {
        return <div>Loading...</div>;
    }

    if (childrenJalabs.length === 0) {
        return <div className="text-white ml-10">No jalabs available.</div>;
    }

    return (
        <>
            <div className="flex lg:pl-10 xs:justify-between md:pl-10 sm:pl-0 xs:px-2 flex-wrap sm:px-3 items-center">
                {objects?.map(jalab => (
                    <article key={jalab._id} className={`bg-red-200 xs:my-3 width vh ${adminToken ? "xsvhsp" : "xsvh"} xs:mx-1 xs:py-1 sm:p-10 lg:m-4 md:m-3 sm:my-5 sm:mx-2 xs:p-2`}>
                        <Link to={`/jalabs/${jalab._id}`} state={{ jalab }}>
                            <img className="xs:p-1 xs:w-full xs:h-full xs:justify-center" src={jalab.imageUrl} alt="jalab-img" />
                        </Link>
                        <div className="flex lg:flex-row items-center justify-between xs:flex-col xs:space-y-3">
                            <h3 className="font-semibold xs:text-sm">{jalab.name}</h3>
                            <h3 className="font-semibold xs:text-sm">₦{jalab.price}</h3>
                        </div>
                        {adminToken && (
                            <div className="flex lg:flex-row xs:flex-col xs:space-y-3 xs:items-center sm:flex-col sm:items-center sm:space-y-3 md:justify-between lg:justify-between lg:space-x-5 md:space-x-5 mt-3">
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

export default ChildrenArticle;
