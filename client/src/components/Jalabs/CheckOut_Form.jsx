import React, { useState } from 'react';
import { PaystackButton } from 'react-paystack';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const PaystackCheckoutForm = ({total}) => {
  const [email, setEmail] = useState(sessionStorage.getItem("email"));
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card'); 
  const [reference, setReference] = useState('');
  const publicKey = "pk_live_700851092aa7f6e84a05d49e6511a8c80e4ea9cf"; 

  const initializePayment = async () => {
    const response = await fetch(`${process.env.REACT_APP_SERVER}/initialize-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, amount, paymentMethod }),
    });

    const data = await response.json();
    setReference(data.reference);
    return data.reference;
  };
  const onSuccess = () => {
    fetch(`${process.env.REACT_APP_SERVER}/verify-payment?reference=${reference}`)
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Payment verified successfully') {
          Swal.fire({
            icon: 'success',
            text: 'Payment Successful!',
          })  
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Payment verification failed',
          })
        }
      });
  };

  const componentProps = {
    email,
    amount: amount * 100, // Paystack accepts amount in kobo
    metadata: {
      custom_fields: [
        {
          display_name: 'Mobile Number',
          variable_name: 'mobile_number',
          value: '+2348012345678', 
        },
      ],
    },
    publicKey,
    text: 'Pay Now',
    onSuccess,
    onClose: () => alert('Payment Cancelled'),
    reference,
    paymentMethod: paymentMethod === 'bank_transfer' ? 'bank' : undefined,
    channels: ['bank_transfer'],
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const reference = await initializePayment(); 
    const paystackUrl = `https://checkout.paystack.com/${reference}`; 
    window.location.href = paystackUrl; 
  };

  const userEmail = sessionStorage.getItem("email")
  console.log(userEmail)
  return (
    <div className="flex justify-center items-center sm:w-full md:w-1/2 mx-auto mt-10 rounded-lg py-10 bg-gray-800 border-2 border-amber-600">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Pay with Paystack</h2>
        <p className='mb-5'>* Clicking on "Pay Now" will take you to Paystack's secure checkout page to complete your order.</p>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Email:</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Amount:</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Payment Method:</label>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="card">Credit/Debit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>
        {paymentMethod === 'bank_transfer' && (
          <p className="text-sm mb-4">
          <strong>Please make a bank transfer to the following account:</strong><br /><br />
          <strong>Account Name:</strong> Oyesola Ibrahim Omobolaji<br />
          <strong>Account Number:</strong> 0234402662<br />
          <strong>Bank Name:</strong> Gt Bank<br />
          <strong>Amount:</strong> ₦{total}<br />
          Please send your evidence of payment to my <Link to="https://wa.link/hwaf21">Whatsapp</Link>.
        </p>

        )}
       {paymentMethod === 'card' && (
          <PaystackButton
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition duration-300"
            {...componentProps}
          />
        )}
        {paymentMethod === 'bank_transfer' && (
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition duration-300"
          >
            Confirm Bank Transfer
          </button>
        )}
      </form>

    </div>
  );
};

export default PaystackCheckoutForm;
