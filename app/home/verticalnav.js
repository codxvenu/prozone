"use client";
import React, { useState } from 'react';
import './css/vertical.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from "next/link";
import { faHouse, faCreditCard, faSwatchbook, faPager, faCalendarCheck, faServer, faBuildingColumns, faRobot, faDesktop } from '@fortawesome/free-solid-svg-icons';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import Dialog from './dialog';

const VerticalNav = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handledialog = () => setIsModalOpen(true);
  const closeDialog = () => setIsModalOpen(false);

  return (
    <div className="vertical-nav">
      <div className="logo">PROZONE</div>
      <small>Our Services</small>
      <ul className="nav-links">
        <li><Link href="/home"><FontAwesomeIcon icon={faHouse} /> <span> Dashboard</span></Link></li>
        <li><Link href="./credit-cards"><FontAwesomeIcon icon={faCreditCard} /><span>Credit Cards</span></Link></li>
        <li><Link href="./bins"><FontAwesomeIcon icon={faSwatchbook} /><span>Non vbv Bins</span></Link></li>
        <li><Link href="#ssn"><FontAwesomeIcon icon={faPager} /><span>SSN</span></Link></li>
        <li><Link href="#checkers"><FontAwesomeIcon icon={faCalendarCheck} /><span>Checkers</span></Link></li>
        <li onClick={handledialog}><Link href="#proxies"><FontAwesomeIcon icon={faServer} /><span>Proxies</span></Link></li>
        <li><Link href="#banks-accounts"><FontAwesomeIcon icon={faBuildingColumns} /><span>Banks & Accounts</span></Link></li>
        <li onClick={handledialog}><Link href="#otp-bot"><FontAwesomeIcon icon={faRobot} /><span>OTP BOT</span></Link></li>
        <li onClick={handledialog}><Link href="#rdps"><FontAwesomeIcon icon={faDesktop} /><span>RDPs</span></Link></li>
        <Dialog isOpen={isModalOpen} onClose={closeDialog} />
      </ul>
      <small className='m-0'>Contacts</small>
      <div className="contacts">
        <li className='g-5'><Link href="#telegram"><FontAwesomeIcon icon={faTelegram} /><span>Telegram</span></Link></li>
      </div>
    </div>
  );
}

export default VerticalNav;
