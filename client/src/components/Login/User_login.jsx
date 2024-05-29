import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Swal from 'sweetalert2';


const UserLogin = () => {
    let Navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(false);
    const [error, setError] = useState(null)
    
      const Login = (e) => {
      e.preventDefault();
      
      const fetching =  {
        method: 'POST',
        url: 'http://localhost:4000/api/user/login',
        data: {
          email,
          password
        }
      }
      axios(fetching)
      .then((result) => {
        const userToken = result.data.token;
        const user = result.data.user.firstName;
        const lastname = result.data.user.lastName;
        const email = result.data.user.email;
        console.log(result.data.user.firstName);
         console.log(result);
         sessionStorage.setItem('User', user);
         sessionStorage.setItem('lastname', lastname);
         sessionStorage.setItem('userToken', userToken);
         sessionStorage.setItem('email', email);
         setLogin(true);
         sessionStorage.removeItem("adminToken")
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
          title: `Welcome, ${user}. You are Logged in successfully`
        })
         Navigate("/");
       })
      . catch ((error) => {
        console.log('Error during signup', error);
       // setError(error.response.data.message)
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
            <main className="bg-gray-700 py-10 xs:h-full">
                <h3 className="error"></h3>
                <div className="text-white md:mb-24 xs:pt-10 xs:mb-10 sm:mb-10">
                </div>
                <div>
                {error && <h3 className="bg-red-600 text-white w-1/3 py-3 px-5 m-auto rounded-lg uppercase text-center mb-5">{error}</h3>}
                    <div className="bg-yellow-100 md:w-3/5 xs:w-screen sm:w-screen md:flex m-auto rounded-2xl py-10 px-10">
                        <form onSubmit={(e)=>Login(e)}>
                            <div className="mb-10 flex justify-center pt-10">
                                <label htmlFor="email">
                                </label>
                                <input className="rounded-lg w-96 py-4 px-10" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className="mb-10 flex justify-center">
                                <label htmlFor="password">
                                </label>
                                <input className="rounded-lg w-96 py-4 px-10" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                            <button type="SUBMIT" className="cursor-pointer font-bold rounded-lg bg-red-800 py-3 px-5 text-white" onClick={(e) => {Login(e)}}>Login</button> 
                        </form>
                    </div>
                </div>
            </main>
                
        <Footer/>
        </>
    )

}
export default UserLogin;