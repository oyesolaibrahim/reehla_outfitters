import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase';

const AddJalabsForm = ({ jalabData }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Male',
    imageFile: null, 
    imageUrl: '',
    description: '',
    price: '',
    oldPrice: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successfulMsg, setSuccessfulMsg] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (jalabData) {
      setFormData({
        name: jalabData.name || '',
        description: jalabData.description || '',
        price: jalabData.price || '',
        oldPrice: jalabData.oldPrice || '',
        imageUrl: jalabData.imageUrl || '',
        category: jalabData.category || 'Male'
      });
    }
  }, [jalabData]);

  const isEditPage = location.pathname === "/edit/:id";

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

    try {
      let imageUrl = '';

      if (formData.imageFile) {
        const file = formData.imageFile;
        const storageRef = ref(storage, `images/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const result = await axios.post(`${process.env.REACT_APP_SERVER}/api/jalab`, {
        ...formData,
        imageUrl
      });
      
      setFormData({
        name: '',
        imageFile: null,
        imageUrl: '',
        category: 'Male',
        description: '',
        price: '',
        oldPrice: ''
      });
      setError('');
      setSuccessfulMsg("Added Successfully");
    } catch (error) {
      console.error('Error adding Jalab:', error.message);
      setError('Error adding Jalab. Please try again later.');
      setSuccessfulMsg("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = formData.imageUrl;

      if (formData.imageFile) {
        const file = formData.imageFile;
        const storageRef = ref(storage, `images/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const result = await axios.put(`${process.env.REACT_APP_SERVER}/api/updatesinglejalab?jalabId=${jalabData._id}`, {
        ...formData,
        imageUrl
      });

      setSuccessfulMsg("Updated Successfully");
      setError('');
    } catch (error) {
      console.error('Error updating Jalab:', error.message);
      setError('Error updating Jalab. Please try again later.');
      setSuccessfulMsg("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className='bg-red-200 mt-20 md:w-1/3 lg:w-1/3 sm:w-2/3 xs:w-screen rounded-lg py-10 px-8 md:ml-10 lg:ml-10 xs:ml-0' onSubmit={isEditPage ? handleUpdate : handleSubmit}>
      <label>
        Name of Jalab:
        <input
          className='w-full mb-5 p-3 rounded-lg'
          placeholder='Name of Jalab'
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
        Description of Jalab:
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
        Price of Jalab:
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
        Old Price:
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
      
      <button className='bg-red-800 text-white px-5 py-3 rounded-lg' type="submit" disabled={submitting}>
        {submitting ? (isEditPage ? 'Updating...' : 'Submitting...') : (isEditPage ? 'Update' : 'Submit')}
      </button>
      
      {error && <p className='bg-red-600 text-white mt-5 rounded-lg py-3 px-5'>{error}</p>}
      {successfulMsg && <p className='bg-green-600 w-1/2 text-white mt-5 rounded-lg py-3 px-5'>{successfulMsg}</p>}
    </form>
  );
};

export default AddJalabsForm;
