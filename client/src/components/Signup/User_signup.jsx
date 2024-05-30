import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Swal from 'sweetalert2';


const UserSignUp = () => {
    let Navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signup, setSignup] = useState(false);
    const [error, setError] = useState(null)
    
      const Signup = (e) => {
      e.preventDefault();
      
      const fetching =  {
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER}/api/user/signup`,
        data: {
          firstName,
          lastName,
          email,
          password
        }
      }
      axios(fetching)
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
         Navigate('/login')
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
            <main className="bg-gray-700 py-10">
                <h3 className="error"></h3>
                <div className="text-white md:mb-24 xs:pt-10 xs:mb-10">
                </div>
                <div>
                {error && <h3 className="bg-red-600 text-white w-1/3 py-3 px-5 m-auto rounded-lg uppercase text-center mb-5">{error}</h3>}
                    <div className="bg-yellow-100 md:w-3/5 sm:w-screen xs:w-screen md:flex m-auto rounded-2xl pb-10 px-10">
                        <form onSubmit={(e) => {Signup(e)}}>
                            <div className="pt-20 mb-10 flex">
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
                            <button type="SUBMIT" className="fcursor-pointer font-bold rounded-lg bg-red-800 py-3 px-5 text-white" onClick={(e) => {Signup(e)}}>Signup</button> 
                        </form>
                    </div>
                </div>
            </main>
                
        <Footer/>
        </>
    )

}
export default UserSignUp;