import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AddFragranceForm from "../Forms/Male";

const Male_Fragrance = () => {
  const [objects, setObjects] = useState([]);
  const adminToken = sessionStorage.getItem("adminToken");
  const sessionId = sessionStorage.getItem("sessionId");

  useEffect(() => {
    const fetchFragrances = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/api/malefragrance`);
        setObjects(response.data.fragrance);
        console.log(response.data.fragrance);
      } catch (error) {
        console.error('Error fetching fragrances:', error.message);
      }
    };
    fetchFragrances();
  }, []);

  const removeFragrance = (fragranceId) => {
    const config = {
      method: 'DELETE',
      url: `${process.env.REACT_APP_SERVER}/api/delete`,
      data: { fragranceId }
    };

    axios(config)
      .then((response) => {
        setObjects(objects.filter(fragrance => fragrance._id !== fragranceId));
        console.log('Fragrance deleted successfully:', response);
      })
      .catch((error) => {
        console.log('Error deleting fragrance:', error);
      });
  };

  const clearCart = () => {
    const config = {
      method: 'DELETE',
      url: `${process.env.REACT_APP_SERVER}/api/deleteAll`,
      data: { sessionId }
    };

    axios(config)
      .then(() => {
        setObjects([]);
        console.log('Cart cleared successfully');
      })
      .catch((error) => {
        console.log('Error clearing cart:', error);
      });
  };

  if (!objects.length) {
    return <div className="text-white ml-10">Loading...</div>;
  }

  if (objects.length === 0) {
    return <div className="text-white ml-10">No fragrances available.</div>;
  }

  return (
    <>
      <div className="flex lg:pl-10 xs:justify-between md:pl-10 sm:pl-0 xs:px-2 flex-wrap sm:px-3 items-center">
        {objects.map(fragrance => (
          <article key={fragrance._id} className={`bg-red-200 xs:my-3 width vh ${adminToken ? "xsvhsp" : "xsvh"} xs:mx-1 xs:py-1 sm:p-10 lg:m-4 md:m-3 sm:my-5 sm:mx-2 xs:p-2`}>
            <Link to={`/fragrances/${fragrance._id}`} state={{ fragrance }}>
              <img className="xs:p-1 xs:w-full xs:h-full xs:justify-center" src={fragrance.imageUrl} alt="fragrance-img"/>
            </Link>
            <div className="flex lg:flex-row items-center justify-between xs:flex-col xs:space-y-3">
              <h3 className="font-semibold xs:text-sm">{fragrance.productName}</h3>
              <h3 className="font-semibold xs:text-sm">₦{fragrance.price}</h3>
            </div>
            <h3 className="text-center my-2">{fragrance.brandName}</h3>
            {adminToken && (
              <div className="flex lg:flex-row xs:flex-col xs:space-y-3 xs:items-center sm:flex-col sm:items-center sm:space-y-3 md:justify-between md:space-y-0 lg:justify-between lg:space-x-5 my-3">
                <button onClick={() => removeFragrance(fragrance._id)} className="bg-red-800 text-sm text-white rounded-lg sm:py-3 sm:px-5 xs:px-1 xs:py-2" type="button">Delete Fragrance</button>
                <Link to={`/edit/${fragrance._id}`}><button className="bg-red-800 text-sm text-white rounded-lg sm:py-3 sm:px-5 xs:px-1 xs:py-2" type="button">Edit Fragrance</button></Link>
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
      <AddFragranceForm />
    </>
  );
};

export default Male_Fragrance;
