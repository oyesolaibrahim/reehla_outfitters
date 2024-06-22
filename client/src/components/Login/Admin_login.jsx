import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Swal from 'sweetalert2';


const AdminLogin = () => {
    let Navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(false);
    const [error, setError] = useState(null);
        
    
      const Login = (e) => {
        e.preventDefault();
      
      const fetching =  {
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER}/api/admin/login`,
        data: {
          email,
          password
        }
      }
      axios(fetching)
      .then((result) => {
        const adminToken = result.data.token;
        const admin = result.data.admin.firstName;
        const deliveryFee = result.data.admin.deliveryFee;
        console.log(result.data.admin.firstName);
         console.log(result);
         sessionStorage.setItem('adminToken', adminToken);
         sessionStorage.setItem('Delivery Fee', deliveryFee);
         sessionStorage.setItem('admin', admin);
         setLogin(true);
         sessionStorage.removeItem("token")
         const Toast = Swal.mixin({
          toast: true,
          position: "center",
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: `Welcome, ${admin}. You are Logged in successfully`
        })
         Navigate("/");
        })
      . catch ((error) => {
        console.log('Error logging in', error);
        //setError(error.response.data.message)
        Swal.fire({
          icon: 'error',
          //title: successfulMsg,
          text: error.response.data.message,
      });
  
      }) 
      }
        
        
    
    return (
        <>
            <Header/>
            <main className="bg-gray-800 min-h-screen pb-16">
                <div className="py-10 text-white">
                    <h2 className="flex sm:text-6xl justify-center">Admin Login</h2>
                </div>
                <div>
                           <div className="bg-gray-800 border-2 border-amber-600 md:w-3/5 xs:w-screen sm:w-screen md:flex m-auto rounded-2xl py-10 px-10">
                        <form onSubmit={(e)=>Login(e)} className="mx-auto">
                          <i class="fa flex justify-center text-8xl fa-user-circle-o text-amber-800" aria-hidden="true"></i>
                            <div className="mb-10 pt-10 flex justify-center">
                                <label htmlFor="email">
                                </label>
                                <input className="rounded-lg w-96 py-4 px-10" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className="mb-10 flex justify-center">
                                <label htmlFor="password">
                                </label>
                                <input className="rounded-lg w-96 py-4 px-10" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                            <button type="SUBMIT" className="fcursor-pointer font-bold rounded-lg bg-amber-800 py-3 px-5 text-white" onClick={(e) => {Login(e)}}>Login</button> 
                        </form>
                    </div>
                </div>
            </main>
                
        <Footer/>
        </>
    )

}
export default AdminLogin;