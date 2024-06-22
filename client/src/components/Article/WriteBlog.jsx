import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../Firebase";
import { useLocation } from 'react-router-dom';

const WritingBlogMessage = ({ blogData }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const location = useLocation();
  const isEditPage = !location.pathname.includes("/writeblog");
  useEffect(() => {
    if (isEditPage && blogData) {
      setSubject(blogData.subject);
      setMessage(blogData.message);
      setImageUrl(blogData.imageUrl);
    }
  }, [isEditPage, blogData]);

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const imageName = `${Date.now()}-${imageFile.name}`;
        const storageRef = ref(storage, `images/${imageName}`);
        await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      const payload = { subject, message, imageUrl: finalImageUrl };

      if (isEditPage) {
        await axios.put(`${process.env.REACT_APP_SERVER}/api/updateblog?blogId=${blogData._id}`, payload);
        setSuccessMessage('Blog updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_SERVER}/api/blogs`, payload);
        setSuccessMessage('Blog created successfully');
      }

      setError('');
      setSubject('');
      setMessage('');
      setImageUrl('');
      setImageFile(null);
    } catch (error) {
      console.error('Error submitting blog:', error);
      setError('Error submitting blog. Please try again later.');
      setSuccessMessage('');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {isEditPage || <Header />}
      <main className='bg-gray-800 py-10'>
        <div className="max-w-md mx-auto p-6 bg-gray-200 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">{isEditPage ? 'Edit Blog Message' : 'Write Blog Message'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="subject">Subject:</label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={handleChange(setSubject)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="message">Message:</label>
              <textarea
                id="message"
                value={message}
                onChange={handleChange(setMessage)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                rows="5"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="imageUrl">Image URL:</label>
              <input
                type="text"
                id="imageUrl"
                value={imageUrl}
                onChange={handleChange(setImageUrl)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="imageFile">Upload Image:</label>
              <input
                type="file"
                id="imageFile"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-blue-600"
              disabled={sending}
            >
              {sending ? 'Submitting...' : isEditPage ? 'Update' : 'Send'}
            </button>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
        </div>
      </main>
      {isEditPage || <Footer />}
    </>
  );
};

export default WritingBlogMessage;
