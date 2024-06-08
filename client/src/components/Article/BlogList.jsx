import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../Firebase";
import axios from "axios";
import Swal from 'sweetalert2';

const BlogList = ({ blogs }) => {
  const adminToken = sessionStorage.getItem("adminToken");

  const removeBlog = async (blogId) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_SERVER}/api/deleteblog?blogId=${blogId}`);
      console.log('Blog deleted successfully:', response);
    } catch (error) {
      console.log('Error deleting blog:', error);
    }
  };

  const handleClearBlogs = () => {
    Swal.fire({
      title: 'Are you sure you want to clear All Blogs?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete all!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        clearBlogs();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled');
      }
    });
  };

  const clearBlogs = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_SERVER}/api/deleteallblogs`);
      alert('All blogs have been deleted!');
    } catch (error) {
      console.log('Error clearing blogs:', error);
    }
  };
  return (
    <>
      <div className='sm:p-10'>
        {blogs?.map(blog => (
          <div key={blog.id} className="bg-red-200 py-10 my-8 flex items-start xs:flex-col sm:flex-row sm:space-x-20">
              <img src={blog.imageUrl} alt="Blog" className="sm:w-1/3 xs:w-full px-3 xs:mb-10" />
            <div>
            <div>
              <h3 className="text-xl font-semibold xs:flex xs:justify-center mb-2 xs:mx-auto xs:text-center">{blog.subject}</h3>
              <p className="text-gray-600 xs:px-3 xs:text-center">{blog.message}</p>
            </div>
            {adminToken && (
              <div className='flex justify-center space-x-5 py-3 mx-auto'>
                <button onClick={() => removeBlog(blog._id)} className="bg-red-800 text-sm text-white rounded-lg sm:py-3 sm:px-5 xs:px-5 xs:py-2" type="button">Remove Blog</button>
                <Link to={`/edit/${blog._id}`}><button className="bg-red-800 text-sm text-white rounded-lg sm:py-3 sm:px-5 xs:px-5 xs:py-2" type="button">Edit Blog</button></Link>
              </div>
            )
          }
            </div>
            
          </div>
        ))}
      </div>
      {adminToken && blogs.length > 0 && (
        <div className="flex sm:justify-between sm:pl-20 xs:justify-center space-x-5 mt-3">
          <button onClick={handleClearBlogs} className="bg-red-800 text-sm text-white rounded-lg py-3 px-5" type="button">Delete All Blogs</button>
        </div>
      )}
      <div>
        {adminToken && (
          <div className='flex justify-center space-x-5'>
            <Link to="/writeblog">
              <button className='bg-red-800 mt-20 text-white py-3 px-5 rounded-lg'>Write Blog</button>
            </Link>
            <Link to="/sendmessage">
              <button className='bg-red-800 mt-20 text-white py-3 px-5 rounded-lg'>Send Message</button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogList;