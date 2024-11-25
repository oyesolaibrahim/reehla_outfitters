import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Collections = () => {
  const location = useLocation();
  const [brands, setBrands] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const { brands, message } = location.state || {};
    if (brands && brands?.length > 0) {
      setBrands(brands);
      console.log(brands);
      setMessage('');
    } else {
      setMessage(message || "No products found.");
    }
  }, [location.state]);

  return (
    <>
      <Header />
      <main className='bg-soft-ivory min-h-screen overflow-x-hidden py-10'>
        <div className="md:flex justify-between xs:min-h-screen">
          <div className="flex flex-col space-y-3 justify-between">
            {message ? (
              <div className="text-center text-primary-brown flex justify-center">{message}</div>
            ) : (
              brands.map(object => (
                <div key={object._id} className="bg-soft-ivory border-2 border-muted-gold text-primary-brown max-h-62 min-h-62 sm:max-w-2/3 md:w-3/4 sm:min-w-36 md:min-w-36 p-10 m-5">
                  <Link to={`/fragrances/${object._id}`} state={{ object }}>
                    <article className="relative xs:flex xs:flex-col sm:flex md:flex xs:justify-between sm:justify-between md:justify-start md:space-x-10 sm:items-center md:items-center">
                      <img className="sm:w-1/3 mb-5 xs:w-full" src={object.imageUrl} alt="brand-img" />
                      <div>
                        <h3 className="sm:flex xs:flex xs:justify-center md:flex justify-center my-5 font-semibold text-3xl">{object.productName}</h3>
                        <h3 className="sm:flex xs:flex xs:justify-center md:flex justify-center mt-5 font-bold">{object.brandName || object.size}</h3>
                        <h3 className="sm:flex xs:flex xs:justify-center md:flex justify-center mt-2 font-bold">{object.category}</h3>
                        <h3 className="max-w-96 xs:flex xs:justify-center my-3 sm:text-center md:text-center">₦{object.price}</h3>
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

export default Collections;
