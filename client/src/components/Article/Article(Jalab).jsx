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

  return (
    <>
      <div className="flex flex-wrap space-y-6 xs:justify-center sm:pl-5 sm:justify-between md:justify-between sm:items-center md:items-center">
        {objects.map(jalab => (
          <article key={jalab._id} className={`bg-yellow-100 xs:my-3 width vh ${adminToken ? "xsvhsp" : "xsvh"} xs:mx-1 xs:py-1 sm:p-10 lg:m-4 md:m-3 sm:my-5 sm:mx-2 xs:p-2`}>
            <Link to={`/jalabs/${jalab._id}`} state={{ jalab }}>
              <img className="xs:flex xs:p-3 xs:justify-center" src={jalab.imageUrl} alt="jalab-img"/>
            </Link>
            <div className="flex sm:justify-between md:justify-between xs:justify-center space-x-4 xs:py-5 mt-10">
              <h3 className="flex justify-center sm:mt-10 md:mt-10 xs:mt-10 font-semibold sm:text-xl md:text-xl xs:text-xs">{jalab.name}</h3>
              <h3 className="flex justify-center sm:mt-10 md:mt-10 xs:mt-10 font-semibold sm:text-xl md:text-xl xs:text-xs">₦{jalab.price}</h3>
            </div>
            {adminToken && (
              <div className="flex lg:flex-row xs:flex-col xs:space-y-3 xs:items-center sm:flex-col sm:items-center sm:space-y-3 md:justify-between lg:justify-between lg:space-x-5 md:space-x-5 my-3">
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
