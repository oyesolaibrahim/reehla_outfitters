import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './components/Home/Home';
import './App.css';
import UserSignUp from "./components/Signup/User_signup";
import Admin_signUp from "./components/Signup/Admin_signup";
import UserLogin from "./components/Login/User_login";
import AdminLogin from "./components/Login/Admin_login";
import Male from "./components/Jalabs/Male";
import Single_Jalab from "./components/Jalabs/Single_Jalab";
import AddJalabsForm from "./components/Jalabs/jalabForm";
import axios from 'axios';
import { useEffect, useState } from "react";
import Cart from "./components/Jalabs/Cart";
import Checkout from "./components/Jalabs/Checkout";
import { v4 as uuidv4 } from 'uuid';
import { CartProvider } from "./components/Header/CartContext";
import EditEachForm from "./components/Home/EditEach";
import BlogPage from "./components/Article/BlogPage";
import WritingBlogMessage from "./components/Article/WriteBlog";
import SendMessagePage from "./components/Article/SendMessagePage";
import Female from "./components/Jalabs/Female";
import Children from "./components/Jalabs/Children";
import BrandPage from "./components/Jalabs/Brand";
import About from "./components/About/About";
import MainMale from "./components/Fragrances/Main/Male";
import MainFemale from "./components/Fragrances/Main/Female";
import Unisex from "./components/Fragrances/Main/Unisex";
import Single_Fragrance from "./components/Fragrances/Home/SingleFragrance";

function App() {
  const [jalabs, setJalabs] = useState([]); 
  const [femaleJalabs, setFemaleJalabs] = useState([]); 
  const [childrenJalabs, setChildrenJalabs] = useState([]); 
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId") || ""); 
  const [myCarts, setMyCarts] = useState([]);

  // Fetching jalabs data
  useEffect(() => {
    const fetchJalabs = async () => {
      try {
        const [jalabsResponse, femaleJalabsResponse, childrenJalabsResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_SERVER}/api/jalab`),
          axios.get(`${process.env.REACT_APP_SERVER}/api/femalejalab`),
          axios.get(`${process.env.REACT_APP_SERVER}/api/childrenjalab`)
        ]);
        setJalabs(jalabsResponse.data);
        setFemaleJalabs(femaleJalabsResponse.data);
        setChildrenJalabs(childrenJalabsResponse.data);
      } catch (error) {
        console.error('Error fetching jalabs:', error.message);
      }
    };
    fetchJalabs();
  }, []);

  // Setting session ID
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = uuidv4();
      localStorage.setItem("sessionId", newSessionId);
      setSessionId(newSessionId);
    }
  }, [sessionId]);

  // Fetching cart data based on session ID
  useEffect(() => {
    if (sessionId) {
      const fetchCart = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_SERVER}/api/cart?sessionId=${sessionId}`);
          setMyCarts(response.data.jalabs);
        } catch (error) {
          console.error('Error fetching jalabs in cart:', error.message);
        }
      };
      fetchCart();
    }
  }, [sessionId]);

  return (
    <CartProvider initialCartItems={myCarts}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/signup' element={<UserSignUp />} />
          <Route path='/login' element={<UserLogin />} />
          <Route path='/admin/signup' element={<Admin_signUp />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/male/jalabs' element={<Male jalabs={jalabs} />} />
          <Route path='/female/jalabs' element={<Female femaleJalabs={femaleJalabs} />} />
          <Route path='/children/jalabs' element={<Children childrenJalabs={childrenJalabs} />} />
          <Route path='/jalabs/:id' element={<Single_Jalab sessionId={sessionId} />} />
          <Route path='/fragrances/:id' element={<Single_Fragrance sessionId={sessionId} />} />
          <Route path='/jalabs/new' element={<AddJalabsForm />} />
          <Route path='/jalabs/cart' element={<Cart sessionId={sessionId} />} />
          <Route path='/checkout' element={<Checkout sessionId={sessionId} />} />
          <Route path='/edit/:id' element={<EditEachForm />} />
          <Route path='/blog' element={<BlogPage />} />
          <Route path='/brand' element={<BrandPage />} />
          <Route path='/writeblog' element={<WritingBlogMessage />} />
          <Route path='/sendmessage' element={<SendMessagePage />} />
          <Route path='/male/fragrance' element={<MainMale />} />
          <Route path='/female/fragrance' element={<MainFemale />} />
          <Route path='/unisex/fragrance' element={<Unisex />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
