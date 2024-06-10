import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import BrandList from './BrandList';
import { Link, useLocation } from 'react-router-dom';

const BrandPage = () => {
  const location = useLocation();
  const [brands, setBrands] = useState([]);
  const [message, setMessage] = useState(''); // State to hold the message
  const object = location.state?.object; // Access the object from the state

  useEffect(() => {
    const fetchBrands = async () => {
      if (!object || object.length === 0) {
        setMessage("This Brand is not Available");
        return;
      }

      if (object && object.brandName) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_SERVER}/api/brands?brandName=${object.brandName}`);
          if (response.data.brands && response.data.brands.length > 0) {
            setBrands(response.data.brands); // Ensure the response data is an array
          } else {
            setMessage("This Brand is not Available");
          }
        } catch (error) {
          console.error('Error fetching brands:', error);
          setMessage("Error fetching brands. Please try again later.");
        }
      }
    };

    fetchBrands();
  }, [object]); 
  return (
    <>
      <Header />
      <main className='bg-gray-800 min-h-screen overflow-x-hidden py-10'>
        <div className="md:flex justify-between xs:min-h-screen">
          <div className="flex flex-col space-y-3 justify-between">
            {message ? (
              <div className="text-center text-white ml-10">{message}</div>
            ) : (
              brands.map(object => (
                <div key={object._id} className="bg-red-200 max-h-62 min-h-62 sm:max-w-2/3 md:w-3/4 sm:min-w-36 md:min-w-36 p-10 m-5">
                  <Link to={`/fragrances/${object._id}`} state={{ object }}>
                  <article className="relative xs:flex xs:flex-col sm:flex md:flex xs:justify-between sm:justify-between md:justify-start md:space-x-10 sm:items-center md:items-center">
                    <img className="sm:w-1/3 mb-5 xs:w-full" src={object.imageUrl} alt="brand-img" />
                    <div className=''>
                      <h3 className="sm:flex xs:flex xs:justify-center md:flex justify-center mt-10 font-semibold text-3xl">{object.productName}</h3>
                      <h3 className="sm:flex xs:flex xs:justify-center md:flex justify-center mt-10 font-bold">{object.brandName}</h3>
                      <h3 className="max-w-96 xs:flex xs:justify-center my-5 sm:text-center md:text-center">{object.description}</h3>
                    </div>
                  </article>
                    </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BrandPage;
