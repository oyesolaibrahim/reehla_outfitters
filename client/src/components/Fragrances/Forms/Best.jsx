import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../Firebase';

const BestFragranceForm = ({ bestSellerData }) => {
  const [formData, setFormData] = useState({
    productName: '',
    category: 'Male',
    description: '',
    price: '',
    oldPrice: '',
    imageUrl: '',
    imageFile: null,
    brandName: '' 
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successfulMsg, setSuccessfulMsg] = useState('');
  const location = useLocation();

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
        brandName: bestSellerData.brandName || '' 
      });
    }
  }, [bestSellerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, imageFile: file, imageUrl: '' }); 
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

      const postData = {
        productName: formData.productName,
        category: formData.category,
        description: formData.description,
        price: formData.price,
        oldPrice: formData.oldPrice,
        imageUrl: imageUrl,
        brandName: formData.brandName 
      };

      await axios.post(`${process.env.REACT_APP_SERVER}/api/bestfragrance`, postData);
      await axios.post(`${process.env.REACT_APP_SERVER}/api/fragrance`, postData);

      setFormData({
        productName: '',
        category: 'Male',
        description: '',
        price: '',
        oldPrice: '',
        imageUrl: '',
        imageFile: null,
        brandName: '' 
      });
      setSuccessfulMsg("Added Successfully");
    } catch (error) {
      console.error('Error adding best seller:', error);
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

      const postData = {
        productName: formData.productName,
        category: formData.category,
        description: formData.description,
        price: formData.price,
        oldPrice: formData.oldPrice,
        imageUrl: imageUrl,
        brandName: formData.brandName 
      };
      await axios.put(`${process.env.REACT_APP_SERVER}/api/updatebestfragrance?fragranceId=${bestSellerData._id}`, postData);
      await axios.put(`${process.env.REACT_APP_SERVER}/api/updatefragrance?fragranceId=${bestSellerData._id}`, postData);

      setSuccessfulMsg("Updated Successfully");
    } catch (error) {
      console.error('Error updating best seller:', error);
      setError('Error updating best seller. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className='bg-red-200 mt-20 md:w-1/3 lg:w-1/3 sm:w-2/3 xs:w-screen rounded-lg py-10 px-8 md:ml-10 lg:ml-10 xs:ml-0' onSubmit={location.pathname === "/best-sellers" ? handleSubmit : handleUpdate}>
      <label>
        <input
          className='w-full mb-5 p-3 rounded-lg'
          placeholder='Name of Fragrance'
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Brand Name: 
        <input
          className='w-full mb-5 p-3 rounded-lg'
          placeholder='Brand Name'
          type="text"
          name="brandName"
          value={formData.brandName}
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
          <option value="Children">Unisex</option>
        </select>
      </label>
      <br />
      <label>
        <textarea
          className='w-full mb-5 p-3 rounded-lg'
          placeholder='Description of Fragrance'
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
          placeholder='Price of Fragrance'
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
          placeholder='Old Price of Fragrance'
          type="number"
          name="oldPrice"
          value={formData.oldPrice}
          onChange={handleChange}
        />
      </label>
      <br />
      
      <button className='bg-amber-800 text-white px-5 py-3 rounded-lg' type="submit" disabled={submitting}>
        {submitting ? (location.pathname === "/best-sellers" ? 'Submitting...' : 'Updating...') : (location.pathname === "/best-sellers" ? 'Submit' : 'Update')}
      </button>
      {error && <p className='bg-red-600 text-white mt-5 rounded-lg py-3 px-5'>{error}</p>}
      {successfulMsg && <p className='bg-green-600 w-1/2 text-white mt-5 rounded-lg py-3 px-5'>{successfulMsg}</p>}
    </form>
  );
};

export default BestFragranceForm;
