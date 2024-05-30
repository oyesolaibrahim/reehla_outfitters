import { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Article_Cart from "./Article_Cart";
import axios from "axios";
import Admin_Cart from "./Admin_Cart";

const Cart = ({sessionId}) => {
    const adminToken = sessionStorage.getItem("adminToken")
    const [myCarts, setMyCarts] = useState([]);
   
    useEffect(() => {
        const fetching = {
            method: 'GET',
            url: `${process.env.SERVER}/api/orders`
        };

        axios(fetching)
            .then((result) => {
         //       console.log(result);
                setMyCarts(result.data.carts);
            })
            .catch((error) => {
                console.log('Error Fetching Carts', error);
            });
}, []);

useEffect(() => {
    const fetching =  {
      method: 'GET',
      url : `${process.env.REACT_APP_SERVER}/api/cart?sessionId=${sessionId}`
  }
  axios(fetching)
  .then((result) => {
      console.log(result.data.jalabs);
      setMyCarts(result.data.jalabs)
      })
    . catch ((error) => {
      console.log('Error Fetching Jalabs in Cart', error);
    })
  }, [sessionId, myCarts])
  
    return (
        <>  
            <Header sessionId={sessionId} myCarts={myCarts}/>
            <main className="bg-gray-700 pb-16">
                {adminToken ? <Admin_Cart myOrders={myCarts}/> : <Article_Cart sessionId={sessionId} />}
            </main>
            <Footer/>
        </>
    )
}

export default Cart;


