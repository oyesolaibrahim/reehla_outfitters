import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const BestForm = ({ bestSellerData }) => {
  const [formData, setFormData] = useState({
    productName: '',
    imageUrl: '',
    imageFile: null,
    category: 'Male',
    description: '',
    price: '',
    oldPrice: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successfulMsg, setSuccessfulMsg] = useState('');
  
  useEffect(() => {
    if (bestSellerData) {
      setFormData({
        productName: bestSellerData.productName || '',
        imageUrl: bestSellerData.imageUrl || '',
        description: bestSellerData.description || '',
        price: bestSellerData.price || '',
        oldPrice: bestSellerData.oldPrice || '',
        category: bestSellerData.category || 'Male'
      });
    }
  }, [bestSellerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imageFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('productName', formData.productName);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('oldPrice', formData.oldPrice);

    if (formData.imageFile) {
      formDataToSend.append('imageFile', formData.imageFile);
    } else {
      formDataToSend.append('imageUrl', formData.imageUrl);
    }
    
    try {
      const result = await axios.post(`${process.env.REACT_APP_SERVER}/api/bestseller`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData({
        productName: '',
        imageUrl: '',
        imageFile: null,
        category: 'Male',
        description: '',
        price: '',
        oldPrice: ''
      });
      setError('');
      setSuccessfulMsg("Added Successfully");
    } catch (error) {
      console.error('Error adding Jalabs:', error.message);
      setError('Error adding Jalabs. Please try again later.');
      setSuccessfulMsg("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('productName', formData.productName);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('oldPrice', formData.oldPrice);

    if (formData.imageFile) {
      formDataToSend.append('imageFile', formData.imageFile);
    } else {
      formDataToSend.append('imageUrl', formData.imageUrl);
    }
    
    try {
      const result = await axios.put(`${process.env.REACT_APP_SERVER}/api/updatebestseller?bestSellerId=${bestSellerData._id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData({
        productName: '',
        imageUrl: '',
        imageFile: null,
        category: 'Male',
        description: '',
        price: '',
        oldPrice: ''
      });
      setError('');
      setSuccessfulMsg("Updated Successfully");
    } catch (error) {
      console.error('Error Updating:', error.message);
      setSuccessfulMsg("");
      setError('Error Updating. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const location = useLocation();

  return (
    <>
      <form className='bg-yellow-100 mt-20 md:w-1/3 lg:w-1/3 sm:w-2/3 xs:w-screen rounded-lg py-10 px-8 md:ml-10 lg:ml-10 xs:ml-0' onSubmit={handleSubmit}>
        <label>
          <input
            className='w-full mb-5 p-3 rounded-lg'
            placeholder='Name of Jalab'
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Upload Image:
          <input
            className='w-full mb-5 p-3 rounded-lg'
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
        </label>
        <br />
        <label>
          or Enter Image URL:
          <input
            className='w-full mb-5 p-3 rounded-lg'
            type="text"
            name="imageUrl"
            placeholder='Image URL'
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Category:
          <select
            className='w-full mb-5 p-3 rounded-lg'
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Children">Children</option>
          </select>
        </label>
        <br />
        <label>
          <textarea
            className='w-full mb-5 p-3 rounded-lg'
            placeholder='Description of Jalab'
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          <input
            className='w-full mb-5 p-3 rounded-lg'
            placeholder='Price of Jalab'
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          <input
            className='w-full mb-5 p-3 rounded-lg'
            placeholder='Old Price'
            type="number"
            name="oldPrice"
            value={formData.oldPrice}
            onChange={handleChange}
          />
        </label>
        <br />
  
        {location.pathname === "/" ? (
          <button onClick={handleSubmit} className='bg-red-800 text-white px-5 py-3 rounded-lg' type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        ) : (
          <button onClick={handleUpdate} className='bg-red-800 text-white px-5 py-3 rounded-lg' type="submit" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update'}
          </button>
        )}
        {error && <p className='bg-red-600 text-white mt-5 rounded-lg py-3 px-5'>{error}</p>}
        {successfulMsg && <p className='bg-green-600 w-1/2 text-white mt-5 rounded-lg py-3 px-5'>{successfulMsg}</p>}
      </form>
    </>
  );
};

export default BestForm;
