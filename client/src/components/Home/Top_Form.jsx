import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase';

const TopForm = ({ brandData }) => {
    const [formData, setFormData] = useState({
        brandName: '',
        imageUrl: '',
        description: '',
        imageFile: null
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successfulMsg, setSuccessfulMsg] = useState('');
    
    useEffect(() => {
        if (brandData) {
            setFormData({
                brandName: brandData.brandName || '',
                imageUrl: brandData.imageUrl || '',
                description: brandData.description || '',
                imageFile: null
            });
        }
    }, [brandData]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'imageFile') {
            setFormData({
                ...formData,
                imageFile: files[0],
                imageUrl: '' 
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const uploadImageToFirebase = async (file) => {
        const storageRef = ref(storage, `images/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            let imageUrl = formData.imageUrl;
            if (formData.imageFile) {
                imageUrl = await uploadImageToFirebase(formData.imageFile);
            }

            const result = await axios.post(`${process.env.REACT_APP_SERVER}/api/topbrand`, {
                brandName: formData.brandName,
                description: formData.description,
                imageUrl: imageUrl,
            });

            setFormData({
                brandName: '',
                imageUrl: '',
                description: '',
                imageFile: null
            });
            setError('');
            setSuccessfulMsg('Added Successfully');
        } catch (error) {
            console.error('Error adding brand:', error.message);
            setSuccessfulMsg('');
            setError('Error adding brand. Please try again later.');
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
                imageUrl = await uploadImageToFirebase(formData.imageFile);
            }

            const result = await axios.put(`${process.env.REACT_APP_SERVER}/api/updatebrand?brandId=${brandData._id}`, {
                brandName: formData.brandName,
                description: formData.description,
                imageUrl: imageUrl,
            });

            console.log(result.data);
            setSuccessfulMsg('Updated Successfully');
            setError('');
        } catch (error) {
            console.error('Error updating brand:', error.message);
            setSuccessfulMsg('');
            setError('Error updating brand. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };

    const location = useLocation();

    return (
        <>
            <form className='bg-red-200 mt-20 md:w-1/3 lg:w-1/3 sm:w-2/3 xs:w-screen rounded-lg py-10 px-8 md:ml-10 lg:ml-10 xs:ml-0' onSubmit={location.pathname === "/" ? handleSubmit : handleUpdate}>
                <label>
                    <input
                        className='w-full mb-5 p-3 rounded-lg'
                        placeholder='Brand Name'
                        type='text'
                        name='brandName'
                        value={formData.brandName}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    <input
                        className='w-full mb-5 p-3 rounded-lg'
                        placeholder='Description'
                        type='text'
                        name='description'
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    <input
                        className='w-full mb-5 p-3 rounded-lg'
                        placeholder='Image URL'
                        type='text'
                        name='imageUrl'
                        value={formData.imageUrl}
                        onChange={handleChange}
                        disabled={formData.imageFile !== null}  // Disable this field if an image file is selected
                    />
                </label>
                <br />
                <label>
                    <input
                        className='w-full mb-5 p-3 rounded-lg'
                        type='file'
                        name='imageFile'
                        onChange={handleChange}
                        disabled={formData.imageUrl !== ''}  // Disable this field if an image URL is provided
                    />
                </label>
                <br />
                <button className='bg-amber-800 text-white px-5 py-3 rounded-lg' type='submit' disabled={submitting}>
                    {submitting ? (location.pathname === "/" ? 'Submitting...' : 'Updating...') : (location.pathname === "/" ? 'Submit' : 'Update')}
                </button>

                {error && <p className='bg-red-600 text-white mt-5 rounded-lg py-3 px-5'>{error}</p>}
                {successfulMsg && <p className='bg-green-600 w-1/2 text-white mt-5 rounded-lg py-3 px-5'>{successfulMsg}</p>}
            </form>
        </>
    );
};

export default TopForm;
