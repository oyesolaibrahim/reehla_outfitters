import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import SendMessageForm from './SendMessagesForm';

const SendMessagePage = () => {

  return (
    <>
    <Header/>
    <main>
        <div className='bg-blue-800 py-10'>
          <SendMessageForm />
        </div>
    </main>
    <Footer/>
    
    </>
  );
};

export default SendMessagePage;
