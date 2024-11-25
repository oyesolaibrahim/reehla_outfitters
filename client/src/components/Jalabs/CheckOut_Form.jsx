import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const PaystackCheckoutForm = ({ total }) => {
  const [email, setEmail] = useState(sessionStorage.getItem("email") || "");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/initialize-payment`,
        { email, amount: total, paymentMethod }
      );

      if (paymentMethod === "card") {
        window.location.href = response.data.authorization_url;
      } else if (paymentMethod === "bank_transfer") {
        const { bankDetails } = response.data;
        Swal.fire({
          icon: "info",
          html: `
            <p><strong>Account Name:</strong> ${bankDetails.accountName}</p>
            <p><strong>Account Number:</strong> ${bankDetails.accountNumber}</p>
            <p><strong>Bank Name:</strong> ${bankDetails.bankName}</p>
            <p><strong>Amount:</strong> ₦${total}</p>
            <p>Please send payment evidence to our <a href="https://wa.link/hwaf21" target="_blank" rel="noopener noreferrer">WhatsApp</a>.</p>
          `,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response?.data?.error || "An error occurred while processing your payment.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center sm:w-full md:w-1/2 mx-auto mt-10 rounded-lg py-10 bg-soft-ivory border-2 border-muted-gold">
      <form
        onSubmit={handleSubmit}
        className="bg-soft-ivory rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Pay with Paystack</h2>
        <p className="mb-5">
          Note: Clicking on "Pay Now" will take you to Paystack's secure checkout page to
          complete your order.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Email:</label>
          <input
            className="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Amount:</label>
          <input
            className="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            type="number"
            value={total}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Payment Method:</label>
          <select
            className="w-full px-3 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="card">Credit/Debit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition duration-300"
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default PaystackCheckoutForm;
