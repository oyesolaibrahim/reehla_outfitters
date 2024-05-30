import React from 'react';
import { Link } from 'react-router-dom';

const BlogList = ({ blogs }) => {
  const adminToken = sessionStorage.getItem("adminToken")
  
  return (
    <>
        <div className='sm:p-10'>
            {blogs.map(blog => (
              <div key={blog.id} className="bg-yellow-100 p-10 my-8 flex items-start xs:flex-col sm:flex-row space-x-20">
                {blog.imageUrl && <img src={blog.imageUrl} alt="Blog" className="sm:w-1/3 xs:w-full xs:mb-10" />}
                <div>
                    <h3 className="text-xl font-semibold mb-2 xs:text-center">{blog.subject}</h3>
                    <p className="text-gray-600 xs:text-center">{blog.message}</p>
                </div>
              </div>
            ))}
        </div>
        <div>
          {adminToken && (
            <div>
              <Link to="/writeblog"><button className='bg-red-800 mt-20 text-white py-3 px-5 rounded-lg ml-10'>Write Blog</button></Link>
              <Link to="/sendmessage"><button className='bg-red-800 mt-20 text-white py-3 px-5 rounded-lg ml-10'>Send Message</button></Link>
            </div>
          ) }  
        </div>
    </>
  );
};

export default BlogList;
