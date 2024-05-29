import {BrowserRouter, Route, Routes} from "react-router-dom"
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


function App() {
  const [jalabs, setJalabs] = useState([]); 
  const [femaleJalabs, setFemaleJalabs] = useState([]); 
  const [childrenJalabs, setChildrenJalabs] = useState([]); 
  const [sessionId, setSessionId] = useState(""); 
  const [myCarts, setMyCarts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/jalab')
      .then(response => {
        setJalabs(response.data); 
        console.log(jalabs)
      })
      .catch(error => {
        console.error('Error fetching jalabs:', error.message);
      });

      axios.get('http://localhost:4000/api/femalejalab')
      .then(response => {
        setFemaleJalabs(response.data); 
        console.log(femaleJalabs)
      })
      .catch(error => {
        console.error('Error fetching jalabs:', error.message);
      })

      axios.get('http://localhost:4000/api/childrenjalab')
      .then(response => {
        setChildrenJalabs(response.data); 
        console.log(femaleJalabs)
      })
      .catch(error => {
        console.error('Error fetching jalabs:', error.message);
      })
  }, []);

  useEffect(() => {
    const existingSessionId = localStorage.getItem("sessionId")
    if (!existingSessionId) {
      const newSessionId = uuidv4()
      localStorage.setItem("sessionId", newSessionId)
      setSessionId(newSessionId)
    } else {
      setSessionId(existingSessionId)
    }
  }, [])
 
//  useEffect(() => {
//    const clearStorageOnExit = () => {
//        window.addEventListener('beforeunload', () => {
//            localStorage.clear();
//        });
//    };
//    clearStorageOnExit();
//    return () => {
//        window.removeEventListener('beforeunload', () => {
//            localStorage.clear();
//        });
//    };
//}, []);

useEffect(() => {
  const fetching =  {
    method: 'GET',
    url : `http://localhost:4000/api/cart?sessionId=${sessionId}`
}
axios(fetching)
.then((result) => {
    console.log(result.data.jalabs);
    setMyCarts(result.data.jalabs)
     console.log(myCarts)
    })
  . catch ((error) => {
    console.log('Error Fetching Jalabs in Cart', error);
  })
}, [sessionId, myCarts])
  
  return (
    <CartProvider initialCartItems={myCarts}>
    <BrowserRouter>
       <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/signup' element={<UserSignUp/>}/>
         <Route path='/login' element={<UserLogin/>}/>
         <Route path='/admin/signup' element={<Admin_signUp/>}/>
         <Route path='/admin/login' element={<AdminLogin/>}/>
         <Route path='/male/jalabs' element={<Male jalabs={jalabs}/>}/>
         <Route path='/female/jalabs' element={<Female femaleJalabs={femaleJalabs}/>}/>
         <Route path='/children/jalabs' element={<Children childrenJalabs={childrenJalabs}/>}/>
         <Route path='/jalabs/:id' element={<Single_Jalab sessionId={sessionId}/>}/>
         <Route path='/jalabs/new' element={<AddJalabsForm/>}/>
         <Route path='/jalabs/cart' element={<Cart sessionId={sessionId}/>}/>
         <Route path='/checkout' element={<Checkout sessionId={sessionId}/>}/>
         <Route path='/edit/:id' element={<EditEachForm/>}/>
         <Route path='/blog' element={<BlogPage/>}/>
         <Route path='/brand' element={<BrandPage/>}/>
         <Route path='/writeblog' element={<WritingBlogMessage/>}/>
         <Route path='/sendmessage' element={<SendMessagePage/>}/>
       </Routes>
    </BrowserRouter>
    </CartProvider>
  );
}


export default App;
