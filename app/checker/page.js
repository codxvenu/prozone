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

import { useNav } from '../home/NavContext';

const Cart = () => {
    const { nav } = useNav();
    const [isloader, setIsloader] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useEffect(() => {
        const username = localStorage.getItem('username');
        
        fetch(`/api/checker?username=${username}`, {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Fetched Data:', data);
            setSelectedTransaction(data);
        })
        .catch(error => {
            console.error('Error fetching transaction details:', error);
        });
    }, []);

    const handleCheckClick = (row) => {
        const emailObj = {
            id: row.id,
            bin: row.bin,
            firstName: row.firstName,
            country: row.country,
            state: row.state,
            city: row.city,
            zip: row.zip,
            info: row.info,
            address: row.address,
            binInfo: row.binInfo,
            base: row.base,
            validPercent: row.validPercent,
            refundable: row.refundable,
            price: row.price,
            username : localStorage.getItem('username'),
        };

        // Sending the email
        fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailObj),
        })
        .then(response => {
            if (response.ok) {
                toast.success('Email sent successfully!');
            } else {
                toast.error('Failed to send email.');
            }
        })
        .catch(error => {
            console.error('Error sending email:', error);
            toast.error('An error occurred while sending email.');
        });
    };

    if (!selectedTransaction) return <div>Loading...</div>;

    return (
        <div className="app">
            <div className="main-content">
                <HorizontalNav />
                <div className='flex'>
                    <VerticalNav />
                    <div className={nav ? 'main-form hide' : 'main-form nohide'}>
                        <h1 className='text-xl'>Your Cards</h1>
                        <div className='overflow-auto'>
                            <table border="1">
                                <thead>
                                    <tr>
                                        <th>BIN</th>
                                        <th>Exp Date</th>
                                        <th>First Name</th>
                                        <th>Country</th>
                                        <th>State</th>
                                        <th>City</th>
                                        <th>ZIP</th>
                                        <th>Info</th>
                                        <th>Address</th>
                                        <th>BIN Info</th>
                                        <th>Base</th>
                                        <th>Valid %</th>
                                        <th>Refundable</th>
                                        <th>Price</th>
                                        <th>Check</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{selectedTransaction.bin}</td>
                                        <td>{selectedTransaction.time}</td>
                                        <td>{selectedTransaction.firstName}</td>
                                        <td>{selectedTransaction.country}</td>
                                        <td>{selectedTransaction.state}</td>
                                        <td>{selectedTransaction.city}</td>
                                        <td>{selectedTransaction.zip}</td>
                                        <td>
                                            <div className="info-container">
                                                <span className="info-icon text-center">
                                                    <FontAwesomeIcon icon="fa-solid fa-info" className=' text-black bg-green-500 p-1 rounded-full' />
                                                </span>
                                                <div className="info-content">
                                                    {selectedTransaction.DOB ? <p>DOB: <span className='text-green-600'>Yes</span></p> : <p>DOB: <span className='text-red-600'>No</span></p>}
                                                    {selectedTransaction.cvv ? <p>SSN: <span className='text-green-600'>Yes</span></p> : <p>SSN: <span className='text-red-600'>No</span></p>}
                                                    {selectedTransaction.email ? <p>EMAIL: <span className='text-green-600'>Yes</span></p> : <p>EMAIL: <span className='text-red-600'>No</span></p>}
                                                    {selectedTransaction.phone ? <p>PHONE: <span className='text-green-600'>Yes</span></p> : <p>PHONE: <span className='text-red-600'>No</span></p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{selectedTransaction.address ? <span className='text-green-500 text-lg'>&#10004;</span> : '❌'}</td>
                                        <td>{selectedTransaction.binInfo}</td>
                                        <td>
                                            <div className="info-container">
                                                <span className="info-icon text-center">
                                                    <FontAwesomeIcon icon="fa-solid fa-info" className=' text-black bg-green-500 p-1 rounded-full' />
                                                </span>
                                                <div className="info-content">
                                                    {selectedTransaction.base ? <p>{selectedTransaction.base}</p> : <p>base: <span className='text-red-600'>No</span></p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{selectedTransaction.validPercent}</td>
                                        <td>{selectedTransaction.refundable ? <span>Yes &#128994;</span> : <span>No &#128308;</span>}</td>
                                        <td>{selectedTransaction.price}$</td>
                                        <td>
                                            <button onClick={() => handleCheckClick(selectedTransaction)} className="check-btn text-gree-500">
                                                Check
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> 
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Cart;
