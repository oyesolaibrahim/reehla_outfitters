import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import BrandList from './BrandList';
import BlogList from './BrandList';

const BrandPage = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${process.env.SERVER}/api/blogs`);
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
    <Header/>
    <main>
        <div className='bg-blue-800 py-10'>
          <BlogList blogs={blogs} />
        </div>
    </main>
    <Footer/>
    
    </>
  );
};

export default BrandPage;
