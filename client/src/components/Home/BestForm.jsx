import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase';

const BestForm = ({ bestSellerData }) => {
  const [formData, setFormData] = useState({
    productName: '',
    category: 'Male',
    description: '',
    price: '',
    oldPrice: '',
    imageUrl: '',
    imageFile: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successfulMsg, setSuccessfulMsg] = useState('');

  useEffect(() => {
    if (bestSellerData) {
      setFormData({
        productName: bestSellerData.productName || '',
        category: bestSellerData.category || 'Male',
        description: bestSellerData.description || '',
        price: bestSellerData.price || '',
        oldPrice: bestSellerData.oldPrice || '',
        imageUrl: bestSellerData.imageUrl || '',
        imageFile: null,
      });
    }
  }, [bestSellerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, imageFile: file, imageUrl: '' }); // Clear imageUrl when a file is selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessfulMsg('');

    try {
      let imageUrl = formData.imageUrl;

      if (formData.imageFile) {
        const file = formData.imageFile;
        const storageRef = ref(storage, `images/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const response = await axios.post(`${process.env.REACT_APP_SERVER}/api/bestseller`, {
        productName: formData.productName,
        category: formData.category,
        description: formData.description,
        price: formData.price,
        oldPrice: formData.oldPrice,
        imageUrl: imageUrl,
      });

      console.log(response.data);
      setFormData({
        productName: '',
        category: 'Male',
        description: '',
        price: '',
        oldPrice: '',
        imageUrl: '',
        imageFile: null,
      });
      setSuccessfulMsg("Added Successfully");
    } catch (error) {
      console.error('Error adding best seller:', error.message);
      setError('Error adding best seller. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessfulMsg('');

    try {
      let imageUrl = formData.imageUrl;

      if (formData.imageFile) {
        const file = formData.imageFile;
        const storageRef = ref(storage, `images/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const response = await axios.put(`${process.env.REACT_APP_SERVER}/api/updatebestseller?bestSellerId=${bestSellerData._id}`, {
        productName: formData.productName,
        category: formData.category,
        description: formData.description,
        price: formData.price,
        oldPrice: formData.oldPrice,
        imageUrl: imageUrl,
      });

      console.log(response.data);
      setSuccessfulMsg("Updated Successfully");
    } catch (error) {
      console.error('Error updating best seller:', error.message);
      setError('Error updating best seller. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const location = useLocation();

  return (
    <form className='bg-red-200 mt-20 md:w-1/3 lg:w-1/3 sm:w-2/3 xs:w-screen rounded-lg py-10 px-8 md:ml-10 lg:ml-10 xs:ml-0' onSubmit={location.pathname === "/" ? handleSubmit : handleUpdate}>
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
        Image URL or Upload Image:
        <input
          className='w-full mb-5 p-3 rounded-lg'
          placeholder='Image URL'
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        <input
          className='w-full mb-5 p-3 rounded-lg'
          type="file"
          onChange={handleFileChange}
          accept="image/*"
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
          placeholder='Old Price of Jalab'
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
  );
};

export default BestForm;
