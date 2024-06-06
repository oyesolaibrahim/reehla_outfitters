import React from 'react';
import { Link } from 'react-router-dom';
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
          <div key={blog._id} className="bg-red-200 xs:py-10 sm:p-10 my-8 flex items-start xs:flex-col sm:flex-row space-x-20">
            {blog.imageUrl && (
              <img src={blog.imageUrl} alt="Blog" className="sm:w-1/3 xs:w-full xs:mb-10" />
            )}
            <div>
              <h3 className="text-xl font-semibold mb-2 xs:flex xs:justify-center xs:text-center">{blog.subject}</h3>
              <p className="text-gray-600 xs:text-center xs:flex xs:justify-center">{blog.message}</p>
            </div>
            {adminToken && blogs.length > 0 && (
        <div className="flex justify-center space-x-5 mt-3">
          <button onClick={removeBlog} className="bg-red-800 text-sm text-white rounded-lg py-3 px-5" type="button">Remove Blog</button>
          <Link to={`/edit/${blog._id}`}>
              <button className="bg-red-800 text-sm text-white rounded-lg py-3 px-5" type="button">Edit Blog</button>
          </Link>
        </div>
      )}
          </div>
        ))}
        {adminToken && blogs.length > 0 && (
        <div className="flex justify-center my-3">
          <button onClick={handleClearBlogs} className="bg-red-800 text-sm text-white rounded-lg py-3 px-5" type="button">Delete All Blogs</button>
        </div>
      )}
      </div>
      <div>
        {adminToken && (
          <div>
            <Link to="/writeblog">
              <button className='bg-red-800 mt-20 text-white py-3 px-5 rounded-lg ml-10'>Write Blog</button>
            </Link>
            <Link to="/sendmessage">
              <button className='bg-red-800 mt-20 text-white py-3 px-5 rounded-lg ml-10'>Send Message</button>
            </Link>
          </div>
        )}
      </div>
      
    </>
  );
};

export default BlogList;
