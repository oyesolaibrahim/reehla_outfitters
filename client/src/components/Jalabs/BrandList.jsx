import React from 'react';
import { Link } from 'react-router-dom';

const BlogList = ({ blogs }) => {
  const adminToken = sessionStorage.getItem("adminToken")
  
  return (
    <>
        <div className='bg-red-200 p-10'>
          {blogs?.map(blog => (
            <div key={blog.id} className="mb-8 flex items-start space-x-20">
              {blog.imageUrl && <img src={blog.imageUrl} alt="Blog" className="w-1/3" />}
              <div>
                  <h3 className="text-xl font-semibold mb-2">{blog.subject}</h3>
                  <p className="text-gray-600">{blog.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div>
          {adminToken && (<Link to="/writeblog"><button className='bg-red-800 mt-20 text-white py-3 px-5 rounded-lg ml-10'>Write Blog</button></Link>)}  
        </div>
    </>
  );
};

export default BlogList;
