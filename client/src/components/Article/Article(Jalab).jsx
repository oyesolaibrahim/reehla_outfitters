import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AddJalabsForm from "../Jalabs/jalabForm";

const Article_Jalab = ({ jalabs }) => {
  const [objects, setObjects] = useState([]);

  const adminToken = sessionStorage.getItem("adminToken");
  const sessionId = sessionStorage.getItem("sessionId");
  useEffect(() => {
    const fetchJalabs = async () => {
      try {
        const [jalabsResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_SERVER}/api/jalab`),
        ]);
        setObjects(jalabsResponse.data.jalabs);
        console.log(objects)
      } catch (error) {
        console.error('Error fetching jalabs:', error.message);
      }
    };
    fetchJalabs();
  }, []);
  const removeJalab = (jalabId) => {
    const fetching = {
      method: 'DELETE',
      url: `${process.env.REACT_APP_SERVER}/api/delete`,
      data: { jalabId }
    };

    axios(fetching)
      .then((response) => {
        setObjects(objects.filter(jalab => jalab._id !== jalabId));
        console.log('Jalab deleted successfully:', response);
      })
      .catch((error) => {
        console.log('Error deleting jalab:', error);
      });
  };

  const clearCart = () => {
    const fetching = {
      method: 'DELETE',
      url: `${process.env.REACT_APP_SERVER}/api/deleteAll`,
      data: { sessionId }
    };

    axios(fetching)
      .then(() => {
        setObjects([]); 
        console.log('Cart cleared successfully');
      })
      .catch((error) => {
        console.log('Error clearing cart:', error);
      });
  };

  if (!jalabs) {
    return <div>Loading...</div>;
  }

  if (jalabs.length === 0) {
    return <div className="text-white ml-10">No jalabs available.</div>;
  }
console.log(jalabs)
  return (
    <>
      <div className="flex lg:pl-10 xs:justify-between md:pl-10 sm:pl-0 xs:px-2 flex-wrap sm:px-3 items-center">
        {objects.map(jalab => (
          <article key={jalab._id} className={`bg-red-200 xs:my-3 width vh ${adminToken ? "xsvhsp" : "xsvh"} xs:mx-1 xs:py-1 sm:p-10 lg:m-4 md:m-3 sm:my-5 sm:mx-2 xs:p-2`}>
            <Link to={`/jalabs/${jalab._id}`} state={{ jalab }}>
              <img className="xs:p-1 xs:w-full xs:h-full xs:justify-center" src={jalab.imageUrl} alt="jalab-img"/>
            </Link>
            <div className="flex lg:flex-row items-center justify-between xs:flex-col xs:space-y-3">
              <h3 className="font-semibold xs:text-sm">{jalab.name}</h3>
              <h3 className="text-xl font-normal mt-1">size: {jalab?.size || 52}</h3><h3 className="font-semibold xs:text-sm">₦{jalab.price}</h3>
            </div>
            {adminToken && (
              <div className="flex lg:flex-row xs:flex-col xs:space-y-3 xs:items-center sm:flex-col sm:items-center sm:space-y-3 md:justify-between lg:justify-between lg:space-x-5 my-3">
                <button onClick={() => removeJalab(jalab._id)} className="bg-red-800 text-sm text-white rounded-lg sm:py-3 sm:px-5 xs:px-1 xs:py-2" type="button">Delete Jalab</button>
                <Link to={`/edit/${jalab._id}`}><button className="bg-red-800 text-sm text-white rounded-lg sm:py-3 sm:px-5 xs:px-1 xs:py-2" type="button">Edit Jalab</button></Link>
              </div>
            )}
          </article>
        ))}
      </div>
      {adminToken && objects.length > 0 && (
        <div className="flex justify-between space-x-5 mt-3 pl-20">
          <button onClick={clearCart} className="bg-red-800 text-sm text-white rounded-lg py-3 px-5" type="button">Delete All Products</button>
        </div>
      )}
      {adminToken && <AddJalabsForm />}
    </>
  );
};

export default Article_Jalab;
