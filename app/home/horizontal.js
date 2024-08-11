"use client";
import React, { useEffect, useState } from 'react';
import './css/horizontal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFontAwesome, faTelegram } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import Link from "next/link";
import { useTheme } from '../theme/ThemeContext'; // ad
import { Dropdown } from "flowbite-react";
import { HiCog, HiCurrencyDollar, HiLogout, HiViewGrid } from "react-icons/hi";

library.add(fas, faTwitter, faFontAwesome);

const HorizontalNav = () => {
  const [balance, setBalance] = useState(0);
  const { theme, toggleTheme } = useTheme(); // Use theme context

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/balance`, { withCredentials: true });
        setBalance(response.data.balance);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Redirect to the login page
          window.location.href = '/login';
        } else {
          console.error('Error fetching balance:', error);
        }
      }
    };
    
    fetchBalance();
  }, []);

  return (
    <div className={`horizontal-nav justify-end gap-3 ${theme}`}>
      <button className="become-seller flex gap-2 items-center">
        <FontAwesomeIcon icon="fa-solid fa-shop" className='w-5' /><span> Become Seller</span>
      </button>
      <div className="balance flex gap-5 group">
        <FontAwesomeIcon icon="fa-solid fa-bitcoin-sign" className='w-10' /> <span>$62723.94</span>
      </div>
      <div className="links">
        <a onClick={toggleTheme} className="theme-toggle-btn">
          <FontAwesomeIcon icon={theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'} />
        </a>
        <div className="seo flex g-4">
          

      
        <a ><FontAwesomeIcon icon="fa-solid fa-wallet" /><span>{balance}</span></a>
        <Link href="./billing" style={{ padding: "0.38rem 0 0.38rem 0.88rem" }}>
          <FontAwesomeIcon icon="fa-solid fa-swatchbook" /><span className='btn'>Top Up Balance</span>
        </Link>
        <Link href="./cart"><FontAwesomeIcon icon="fa-solid fa-newspaper" /><span>My Orders</span></Link>
        <Dropdown label="" dismissOnClick={true} renderTrigger={() =>  <div className="profile-pic w-4"> <img src="https://prozone.cc/_nuxt/img/header2_user.1803c70.png" alt="" /></div>}>
      <Dropdown.Item icon={HiViewGrid} href='./profile'>Profile</Dropdown.Item>
      <Dropdown.Item icon={HiCog}  href='./rules'>Rules</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item icon={HiLogout}  href='./login'>Sign out</Dropdown.Item>
    </Dropdown>
      </div>  </div>
    </div>
  );
};

export default HorizontalNav;
