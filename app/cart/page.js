"use client";
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./page.css";
import VerticalNav from '../home/verticalnav';
import HorizontalNav from '../home/horizontal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFontAwesome } from '@fortawesome/free-brands-svg-icons';
library.add(fas, faTwitter, faFontAwesome);
import Modal from "./modal";

const Cart = () => {
  const [transactions, setTransactions] = useState([]);
  
  const [isloader, setIsloader] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isCard, setCard] = useState();
  const [isBin, setBin] = useState();

  const handleClose = () => {
    setOpen(false);
  };
  

  useEffect(() => {
    fetch('https://react-store-x8e5.vercel.app/api/transactions')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          console.error('Expected an array but received:', data);
        }
      })
      .catch(error => console.error('Error fetching transactions:', error));
  }, []);

  const handleItems = (transactionId , purchase_type) => {
    setIsloader(true);
    fetch(`https://react-store-x8e5.vercel.app/api/transaction/${transactionId}`, {
      method: 'GET',
      credentials: 'include' // Include credentials in the request
    })
      .then(response => response.json())
      .then(data => {
        console.log('Fetched Data:', data); // Debugging line
        setSelectedTransaction(data);
        setIsloader(false);
        setOpen(true);
      if(purchase_type == "credit card"){
        setCard(true)
        setBin(false)
      }else{
        setCard(false)
        setBin(true)
      }
        
      })
      .catch(error => {
        console.error('Error fetching transaction details:', error);
        setLoading(false);
        setOpen(true);
        setCard(selectedTransaction && selectedTransaction.creditCardInfo && selectedTransaction.creditCardInfo.bins == 0);
        setBin(selectedTransaction && selectedTransaction.creditCardInfo && selectedTransaction.creditCardInfo.bins == 1);
      });
  };




  return (
    <div className="app">
      <VerticalNav />
      <div className="main-content">
        <HorizontalNav />
        <div className="main-form">
          <h1 className='text-xl'>Your Orders</h1>
          {isloader && ( 
        <h1>Loading.....</h1>
      )}
          <table border="1">
            <thead>
              <tr>
                <th>Transaction Id</th>
                <th>Purchase Type</th>
                <th>Price</th>
                <th>Date</th>
                <th>Information</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.purchase_type}</td>
                  <td>${transaction.price.toFixed(2)}</td>
                  <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleItems(transaction.id , transaction.purchase_type)} className='font-extrabold text-green-500'>Click Here</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <Modal isOpen={open} onClose={handleClose}>
          <div className="main">
              <span className='text-black mb-4 flex justify-end' ><h1>  </h1> <h2 className='text-2xl cursor-pointer text-white' onClick={handleClose}>x</h2> </span>
                  
            
          {isCard ? (
               <div className='text-black grid grid-cols-3 gap-5'>
            <form className=" rounded-lg shadow-md p-4 space-y-4 h-min">
              <div className="flex flex-col space-y-4">
                <h1 className='text-black font-bold text-xl'>Card Info:</h1>
                <div className="flex flex-row items-center">
                  <label htmlFor="ccnum" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">CCNUM</label>
                  <input 
                    name='ccnum' 
                    type="text" 
                     readOnly 
                    disabled 
                   value={selectedTransaction.creditCardInfo.ccnum} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none" 
                    aria-label="disabled input" 
                  />
                </div>
          
                <div className="flex flex-row items-center">
                  <label htmlFor="exp" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">EXP</label>
                  <input 
                    name='exp' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.creditCardInfo.exp} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
          
                <div className="flex flex-row items-center">
                  <label htmlFor="name" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">NAME</label>
                  <input 
                    name='name' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.creditCardInfo.firstName} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
          
                <div className="flex flex-row items-center">
                  <label htmlFor="cvv" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">CVV</label>
                  <input 
                    name='cvv' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.creditCardInfo.cvv} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
          
              
              </div>
            </form>
          
            <form className=" rounded-lg shadow-md p-4 space-y-4 h-min">
              <div className="flex flex-col space-y-4">
              <h1 className='text-black font-bold text-xl'>Bin Info:</h1>
                <div className="flex flex-row items-center">
                  <label htmlFor="bin" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">BIN</label>
                  <input 
                    name='bin' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.creditCardInfo.bin} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
          
                <div className="flex flex-row items-center">
                  <label htmlFor="country" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">COUNTRY</label>
                  <input 
                    name='country' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.creditCardInfo.country} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
          
                <div className="flex flex-row items-center">
                  <label htmlFor="bank" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">BANK</label>
                  <input 
                    name='bank' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.creditCardInfo.bankname} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
          
                <div className="flex flex-row items-center">
                  <label htmlFor="level" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">LEVEL</label>
                  <input 
                    name='level' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.creditCardInfo.level} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
          
                <div className="flex flex-row items-center">
                  <label htmlFor="type" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">TYPE</label>
                  <input 
                    name='type' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.creditCardInfo.type} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
          
                <div className="flex flex-row items-center">
                  <label htmlFor="zip" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">ZIP</label>
                  <input 
                    name='zip' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.creditCardInfo.zip} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
          
                <div className="flex flex-row items-center">
                  <label htmlFor="state" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">STATE</label>
                  <input 
                    name='state' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.creditCardInfo.state} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
              </div>
            </form>
          
            <form className=" rounded-lg shadow-md p-4 space-y-4 h-min">
              <div className="flex flex-col space-y-4">
              <h1 className='text-black font-bold text-xl'>Additional Info:</h1>
                <div className="flex flex-row items-center">
                  <label htmlFor="address" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">Address</label>
                  <input 
                    name='address' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.creditCardInfo.address} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
          
                <div className="flex flex-row items-center">
                  <label htmlFor="email" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">Email</label>
                  <input 
                    name='email' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.creditCardInfo.email} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
          
                <div className="flex flex-row items-center">
                  <label htmlFor="phone" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">PHONE</label>
                  <input 
                    name='phone' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.creditCardInfo.phone} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
          
                <div className="flex flex-row items-center">
                  <label htmlFor="dob" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">DOB</label>
                  <input 
                    name='dob' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.creditCardInfo.DOB} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
          
                <div className="flex flex-row items-center">
                  <label htmlFor="BASE" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">BASE</label>
                  <input 
                    name='BASE' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.creditCardInfo.base} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
              </div>
            </form>
            </div>
        ) : isBin ? (

          <div className='text-black gap-5'>
  <form className=" rounded-lg shadow-md p-4 space-y-4 h-min">
              <div className="flex flex-col space-y-4">
              <h1 className='text-black font-bold text-xl'>Bin Info:</h1>
                <div className="flex flex-row items-center">
                  <label htmlFor="bin" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">BIN</label>
                  <input 
                    name='bin' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.additionalInfo.bin} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
          
                <div className="flex flex-row items-center">
                  <label htmlFor="country" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">COUNTRY</label>
                  <input 
                    name='country' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.additionalInfo.country} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
          
              
          
                <div className="flex flex-row items-center">
                  <label htmlFor="level" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">LEVEL</label>
                  <input 
                    name='level' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.additionalInfo.level} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
          
                <div className="flex flex-row items-center">
                  <label htmlFor="type" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">TYPE</label>
                  <input 
                    name='type' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.additionalInfo.type} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
          
                <div className="flex flex-row items-center">
                  <label htmlFor="zip" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">ZIP</label>
                  <input 
                    name='zip' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.additionalInfo.zip} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
                <div className="flex flex-row items-center">
                  <label htmlFor="info" className="font-semibold p-2 text-gray-700 border-r-0 border  border-gray-300 rounded-r-none rounded-md w-28 text-center">INFO</label>
                  <input 
                    name='info' 
                    type="text" 
                     readOnly 
                    disabled 
                    value={selectedTransaction.additionalInfo.zip} 
                    className="p-2 border border-gray-300 rounded-md w-4/5 rounded-l-none"
                  />
                </div>
          
              
              </div>
            </form>
             </div>
           
              ) : (
                <div className="text-gray-500 text-3xl text-center m-auto">No data available</div>
              )
              }
                </div>
                
          </Modal>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Cart;
