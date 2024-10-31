"use client";
import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import axios from 'axios';
import VerticalNav from '../home/verticalnav';
import HorizontalNav from '../home/horizontal';
import './page.css';



const reseller = () => {
  const [transactionId, setTransactionId] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const inputRef = useRef(null);
  const walletAddress = 'TADdR7DWGDtFziQ18iRhwQoahNqPk2gwVt'; // Replace with your actual wallet address
  const [isloader, setIsloader] = useState(false);
  const handleInputChange = (e) => {
    setTransactionId(e.target.value);
  };

  const handleCopy = async () => {
    if (inputRef.current) {
      try {
        if (navigator.clipboard) {
          // Modern Clipboard API
          await navigator.clipboard.writeText(inputRef.current.value);
          setCopySuccess('Copied to clipboard!');
        } else {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = inputRef.current.value;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          setCopySuccess('Copied to clipboard!');
        }
        setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
      } catch (err) {
        setCopySuccess('Failed to copy!');
        console.error('Failed to copy: ', err);
      }
    }
  };
  

  const handleSubmit = async () => {
    const username = localStorage.getItem('username');
   setIsloader(true)
    try {
      await axios.post(`/api/submit-transaction`, {
        transactionId    ,
        username
      }, { withCredentials: true });
      alert('Seller ID sent successfully!');
     setIsloader(false)
      setTransactionId('');   
    } catch (error) {
      console.error('Error submitting transaction:', error);
      alert('Failed to send transaction ID.');
     setIsloader(false)
    }
  };

  return (
    <div className="app">
    
    <div className="main-content">
      <HorizontalNav />   
      <div className='flex'>

      

      <VerticalNav />
     <div className="main-form flex gap-20 h-min trans">   
      <div className='flex flex-col'>

      <div className='flex gap-20 '>
     <div className="text flex flex-col gap-5 h-min ml-52 mt-20">
      <p>Please send BTC to this wallet:
      </p>
      <p>Note : If u already Have 150$ In wallet Just enter <b>balance available</b></p>
      <input
          id="address"
          type="text"
          ref={inputRef}
          readOnly
          value={walletAddress}
          style={{ cursor: 'pointer', userSelect: 'text' }} // Ensure text can be selected
          onClick={handleCopy} // Trigger copy action on click
        />
        <p>Required Amount :
        150$ To Become Seller</p>
        <p>Required Confirmations :
        1</p>
        <p>Fees Commission :
        5% <small>
        (commission included on course)</small></p>

     </div>
     <div className="qr bg">
     <QRCode className='bg-white p-5 mt-20' value={walletAddress} />
        {copySuccess && <p>{copySuccess}</p>} {/* Show copy status message */}

    
    </div>
  

    </div>
    <div className="farm flex flex-col g-5 ml-80 mt-10">
    <p>Once you have deposited funds, please provide the sender ID below:</p>
      <div className="transaction-id">
        <input
          type="text"
          value={transactionId}
          onChange={handleInputChange}
          placeholder="Enter sender address"
        />
        <button onClick={handleSubmit}>Submit</button>
        {isloader && ( 
        <h1>Sending.....</h1>
      )}
      </div>
    </div>  </div>  </div>
     </div>
     </div>
    </div>
  );
};

export default reseller;
