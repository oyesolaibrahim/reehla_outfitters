import React, { useState } from 'react';
import axios from 'axios';

const BrandForm = () => {
  const [formData, setFormData] = useState({
    name: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const result = await axios.post('http://localhost:5000/api/jalab', formData);
      alert('Jalabs added successfully');
      console.log(result.data); 
      setFormData({
        name: '',
        category: 'male',
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
        <form className='bg-yellow-100 mt-20 w-1/3 rounded-lg py-10 px-8 ml-10' onSubmit={handleSubmit}>
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
            <input
            className='w-full mb-5 p-3 rounded-lg'
            placeholder='Image URL'
              type="text"
              name="image-url"
              value={formData.imageurl}
              onChange={handleChange}
              required
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
