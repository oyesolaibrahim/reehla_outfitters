import React, { useState } from 'react';
import axios from 'axios';

const SubscriptionForm = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER}/api/subscribe`, { email });
      setSuccessMessage('Subscription successful!');
      setTimeout(() => {
        setSuccessMessage("")
      }, 10000)
      setError('');
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error.message);
      setError('Error subscribing. Please try again later.!!!');
      setSuccessMessage('');
      setTimeout(() => {
        setError("")
      }, 10000)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-x-2 space-y-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 xs:w-44"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
      >
        {submitting ? 'Submitting...' : 'Subscribe'}
      </button>
      {error && <p className="text-red-600 font-extrabold bg-white px-3 py-2 rounded-lg">{error}</p>}
      {successMessage && <p className="text-green-600 font-extrabold bg-white px-3 py-2 rounded-lg">{successMessage}</p>}
    </form>
  );
};

export default SubscriptionForm;
