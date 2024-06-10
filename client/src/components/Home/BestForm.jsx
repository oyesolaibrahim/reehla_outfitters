import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase';

const BestSellersForm = ({ sellerData }) => {
    const [formData, setFormData] = useState({
        productName: '',
        category: 'Male',
        description: '',
        price: '',
        oldPrice: '',
        imageUrl: '',
        imageFile: null,
        size: '' // Add the size field
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successfulMsg, setSuccessfulMsg] = useState('');

    useEffect(() => {
        if (sellerData) {
            setFormData({
                productName: sellerData.productName || '',
                category: sellerData.category || 'Male',
                description: sellerData.description || '',
                price: sellerData.price || '',
                oldPrice: sellerData.oldPrice || '',
                imageUrl: sellerData.imageUrl || '',
                imageFile: null,
                size: sellerData.size || '' // Update size field from sellerData
            });
        }
    }, [sellerData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, imageFile: file, imageUrl: '' }); // Clear imageUrl when a new file is selected
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            let imageUrl = formData.imageUrl;

            if (formData.imageFile) {
                const storageRef = ref(storage, `images/${formData.imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, formData.imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            await axios.post(`${process.env.REACT_APP_SERVER}/api/sellers`, {
                ...formData,
                imageUrl
            });

            setFormData({
                productName: '',
                category: 'Male',
                description: '',
                price: '',
                oldPrice: '',
                imageUrl: '',
                imageFile: null,
                size: '' // Reset the size field
            });
            setError('');
            setSuccessfulMsg('Best Seller added successfully!');
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

        try {
            let imageUrl = formData.imageUrl;

            if (formData.imageFile) {
                const storageRef = ref(storage, `images/${formData.imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, formData.imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            await axios.put(`${process.env.REACT_APP_SERVER}/api/updatesingleseller?sellerId=${sellerData._id}`, {
                ...formData,
                imageUrl
            });

            setSuccessfulMsg('Best Seller updated successfully!');
            setError('');
        } catch (error) {
            console.error('Error updating best seller:', error.message);
            setError('Error updating best seller. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };

    const location = useLocation();
    const isEditPage = location.pathname.includes('/edit');

    return (
        <form className='bg-red-200 mt-20 md:w-1/3 lg:w-1/3 sm:w-2/3 xs:w-screen rounded-lg py-10 px-8 md:ml-10 lg:ml-10 xs:ml-0' onSubmit={isEditPage ? handleUpdate : handleSubmit}>
            <label>
                Product Name:
                <input
                    className='w-full mb-5 p-3 rounded-lg'
                    placeholder='Product Name'
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    required
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
                Description:
                <textarea
                    className='w-full mb-5 p-3 rounded-lg'
                    placeholder='Description'
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Price:
                <input
                    className='w-full mb-5 p-3 rounded-lg'
                    placeholder='Price'
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
            <label>
                Size:
                <input
                    className='w-full mb-5 p-3 rounded-lg'
                    placeholder='Size'
                    type="number"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Image URL:
                <input
                    className='w-full mb-5 p-3 rounded-lg'
                    type="text"
                    name="imageUrl"
                    placeholder='Image URL'
                    value={formData.imageUrl}
                    onChange={handleChange}
                    required={!formData.imageFile} // Only required if imageFile is not set
                />
            </label>
            <br />
            <label>
                Or Upload Image:
                <input
                    className='w-full mb-5 p-3 rounded-lg'
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!formData.imageUrl} // Only required if imageUrl is not set
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

export default BestSellersForm;
