import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Swal from 'sweetalert2';


const Admin_signUp = () => {

    let Navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signup, setSignup] = useState(false);
    const [error, setError] = useState(null)
    
      const handleSignup = (e) => {
      e.preventDefault();
      
      const configuration =  {
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER}/api/admin/signup`,
        data: {
          firstName,
          lastName,
          email,
          password
        }
      }
      axios(configuration)
      .then((result) => {
         console.log(result);
         setSignup(true);
         const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Signed in successfully"
          })
         Navigate('/admin/login')
        })
      . catch ((error) => {
        console.log('Error during signup', error);
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
                    <h2 className="flex sm:text-6xl justify-center">Admin Signup</h2>
                </div>
                <div>
                    <div className="bg-gray-800 border-2 border-amber-600 md:w-3/5 sm:w-screen py-10 xs:w-screen md:flex m-auto rounded-2xl pb-10 px-10">
                        <form onSubmit={(e) => {handleSignup(e)}} className="mx-auto">
                            <i class="fa flex justify-center text-8xl fa-user-circle-o text-amber-800" aria-hidden="true"></i>
                            <div className="pt-10 mb-10 flex justify-center">
                                <label htmlFor="firstname">
                                </label>
                                <input className="rounded-lg w-96 py-4 px-10 m-auto" type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                            </div>
                            <div className="mb-10 flex justify-center">
                                <label htmlFor="lastname">
                                </label>
                                <input className="rounded-lg w-96 py-4 px-10" type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                            </div>
                            <div className="mb-10 flex justify-center">
                                <label htmlFor="email">
                                </label>
                                <input className="rounded-lg w-96 py-4 px-10" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className="mb-10 flex justify-center">
                                <label htmlFor="password">
                                </label>
                                <input className="rounded-lg w-96 py-4 px-10" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                            <button type="SUBMIT" className="fcursor-pointer font-bold rounded-lg bg-amber-800 py-3 px-5 text-white" onClick={(e) => {handleSignup(e)}}>Signup</button> 
                        </form>
                    </div>
                </div>
                     
            </main>
                
        <Footer/>
        </>
    )
}

export default Admin_signUp;