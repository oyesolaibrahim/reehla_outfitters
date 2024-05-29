import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogList from './BlogList';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/blogs');
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
        <div className='bg-gray-700 py-10'>
          <BlogList blogs={blogs} />
        </div>
    </main>
    <Footer/>
    
    </>
  );
};

export default BlogPage;
