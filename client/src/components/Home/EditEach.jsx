import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import TopForm from './Top_Form';
import BestForm from './BestForm';
import { useParams } from 'react-router-dom';
import NewArrivalsForm from './New_Arrivals_Form';
import AddJalabsForm from '../Jalabs/jalabForm';
import WritingBlogMessage from '../Article/WriteBlog';

const EditForm = () => {
  const { id } = useParams();
  const [brandData, setBrandData] = useState(null);
  const [arrivalData, setArrivalData] = useState(null);
  const [bestSellerData, setBestSellerData] = useState(null);
  const [jalabData, setJalabData] = useState(null);
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(id); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [brandResponse, arrivalResponse, bestSellerResponse, jalabResponse, blogResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_SERVER}/api/toponebrand?brandId=${id}`),
          axios.get(`${process.env.REACT_APP_SERVER}/api/toponearrival?arrivalId=${id}`),
          axios.get(`${process.env.REACT_APP_SERVER}/api/toponebestseller?bestSellerId=${id}`),
          axios.get(`${process.env.REACT_APP_SERVER}/api/editsinglejalab?jalabId=${id}`),
          axios.get(`${process.env.REACT_APP_SERVER}/api/editblog?blogId=${id}`)
        ]);

        setBrandData(brandResponse.data.brand);
        setArrivalData(arrivalResponse.data.arrival);
        setBestSellerData(bestSellerResponse.data.bestSeller);
        setJalabData(jalabResponse.data.jalab);
        setBlogData(blogResponse.data.blog);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
console.log(blogData)
  return (
    <>
      <Header />
      <main className="bg-blue-800 py-20">
        {brandData && <TopForm brandData={brandData} />}
        {arrivalData && <NewArrivalsForm arrivalData={arrivalData} />}
        {bestSellerData && <BestForm bestSellerData={bestSellerData} />}
        {jalabData && <AddJalabsForm jalabData={jalabData} />}
        {blogData && <WritingBlogMessage blogData={blogData} />}
      </main>
      <Footer />
    </>
  );
};

export default EditForm;
