import React, { useState } from 'react';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase';

const BrandForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    category: 'male',
    description: '',
    price: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, imageUrl: file }); // Update imageUrl to the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = formData.imageUrl;

      if (formData.imageUrl) {
        const file = formData.imageUrl;
        const storageRef = ref(storage, `images/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const result = await axios.post(`${process.env.REACT_APP_SERVER}/api/jalab`, {
        name: formData.name,
        imageUrl: imageUrl,
        category: formData.category,
        description: formData.description,
        price: formData.price
      });

      alert('Jalabs added successfully');
      console.log(result.data); 
      setFormData({
        name: '',
        imageUrl: '',
        category: 'male',
        description: '',
        price: ''
      });
      setError('');
    } catch (error) {
      console.error('Error adding Jalabs:', error.message);
      setError('Error adding Jalabs. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form className='bg-red-200 mt-20 w-1/3 rounded-lg py-10 px-8 ml-10' onSubmit={handleSubmit}>
        <label>
          <input
            className='w-full mb-5 p-3 rounded-lg'
            placeholder='Brand Name'
            type="text"
            name="name"
            value={formData.name}
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
        <button className='bg-red-800 text-white px-5 py-3 rounded-lg' type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
        {error && <p>{error}</p>}
      </form>
    </>
  );
};

export default BrandForm;
