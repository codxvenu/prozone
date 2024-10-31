"use client"
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from "next/link";
import { faHouse, faCreditCard, faSwatchbook, faPager, faCalendarCheck, faServer, faBuildingColumns, faRobot, faDesktop } from '@fortawesome/free-solid-svg-icons';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import Dialog from './dialog';
import axios from 'axios';
import { useNav } from './NavContext'; // Adjust the path as needed
import './css/vertical.css';

const VerticalNav = () => {
  const { nav } = useNav();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [balance, setBalance] = useState(0);

  const handleDialog = () => setIsModalOpen(true);
  const closeDialog = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const username = localStorage.getItem("username");
        const response = await axios.get(`/api/balance`, { params: { username }, withCredentials: true });
        setBalance(response.data.balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className={nav ? 'vertical-nav nohide' : 'vertical-nav hide'}>
      <div className={nav ? 'btns flex flex-row gap-5 items-center mb-5 mt-5 btnshide' : 'btns flex flex-row gap-5 items-center mb-5 mt-5 hide'}>
      <a href="./seller"  > <button className="become-seller flex gap-2 items-center ">
          <FontAwesomeIcon icon="fa-solid fa-shop" className='w-5' /><span> Become Seller</span>
        </button></a>
        <a href="./cart"><FontAwesomeIcon icon="fa-solid fa-newspaper" /><span>My Orders</span></a>
        <a href="./billing" style={{ padding: "0.38rem 5px 0.38rem 0.88rem" }}>
          <FontAwesomeIcon icon="fa-solid fa-wallet" /><span>{balance}</span><span className='btn'>Top Up Balance</span>
        </a>
      </div>

      <small>Our Services</small>
      <ul className="nav-links">
        <li><a href="/home"><FontAwesomeIcon icon={faHouse} /> <span> Dashboard</span></a></li>
        <li><a href="./credit-cards"><FontAwesomeIcon icon={faCreditCard} /><span>Credit Cards</span></a></li>
        <li><a href="./bins"><FontAwesomeIcon icon={faSwatchbook} /><span>Non vbv Bins</span></a></li>
        <li><a href="./checker"><FontAwesomeIcon icon={faCalendarCheck} /><span>Checkers</span></a></li>
        <li onClick={handleDialog}><Link href=""><FontAwesomeIcon icon={faServer} /><span>Proxies</span></Link></li>
        <li onClick={handleDialog}><Link href=""><FontAwesomeIcon icon={faBuildingColumns} /><span>Banks & Accounts</span></Link></li>
        <li onClick={handleDialog}><Link href=""><FontAwesomeIcon icon={faRobot} /><span>OTP BOT</span></Link></li>
        <li onClick={handleDialog}><Link href=""><FontAwesomeIcon icon={faDesktop} /><span>RDPs</span></Link></li>
        <Dialog isOpen={isModalOpen} onClose={closeDialog} />
      </ul>
      <small className='m-0'>Contacts</small>
      <div className="contacts">
        <li className='gap-3'><Link href="https://t.me/nocash_xD"><FontAwesomeIcon icon={faTelegram} /><span>Telegram</span></Link></li>
      </div>
    </div>
  );
};

export default VerticalNav;
