import React, { useState } from 'react';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase';

const SendMessageForm = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAttachment(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      let imageUrl = '';
      if (attachment) {
        const storageRef = ref(storage, `images/${attachment.name}`);
        const snapshot = await uploadBytes(storageRef, attachment);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const response = await axios.post(`${process.env.REACT_APP_SERVER}/api/send-messages`, {
        subject,
        message,
        imageUrl
      });

      setSuccessMessage('Message sent successfully');
      setError('');
      setSubject('');
      setMessage('');
      setAttachment(null);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Error sending message. Please try again later.');
      setSuccessMessage('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-200 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Send Message</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            rows="5"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="attachment">Attach Image:</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-blue-600"
          disabled={sending}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
    </div>
  );
};

export default SendMessageForm;
