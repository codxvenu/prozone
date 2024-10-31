"use client";
import React, { useEffect, useState } from 'react';
import './css/horizontal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Link from "next/link";
import { useTheme } from '../theme/ThemeContext'; // ad
import { Dropdown } from "flowbite-react";
import { HiCog, HiCurrencyDollar, HiLogout, HiViewGrid } from "react-icons/hi";

import { useNav } from './NavContext'; // Adjust the path as needed
library.add(fas);
function HorizontalNav() {
  const [balance, setBalance] = useState(0);
  const { theme, toggleTheme } = useTheme(); // Use theme context

 
    const { nav, setNav } = useNav();
  
    const handleNav = () => {
      setNav(prev => !prev);
    };  

 
  useEffect(() => {
    const fetchBalance = async () => {
      try {
       const username = localStorage.getItem("username");
        const response = await axios.get(`/api/balance`, {  params: { username }, withCredentials: true });
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
   
    <div className={`horizontal-nav justify-between gap-3 ${theme} m-auto`}>
    <div className="logo">NoCash Store</div>
    <div className='flex items-center gap-3'>
    {/* <a> <FontAwesomeIcon icon="fa-solid fa-bitcoin-sign" className='w-10' /></a> */}
    <a href="./seller"  >
     <button type='' className="become-seller flex gap-2 items-center">
        <FontAwesomeIcon icon="fa-solid fa-shop" className='w-5' /><span> Become Seller</span>
      </button></a> 
      <div className="balance flex gap-5 group">
        <FontAwesomeIcon icon="fa-solid fa-bitcoin-sign" className='w-10' /> <span>$62723.94</span>
      </div>
      <a onClick={handleNav} className="toggle-nav text-xl">
          <FontAwesomeIcon  icon={nav ? faXmark : faBars}  />
        </a>
      <div className="links">
        <a onClick={toggleTheme} className="theme-toggle-btn">
          <FontAwesomeIcon icon={theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'} />
        </a>
        <div className="seo flex g-4">
          

      
        <a className='desk'><FontAwesomeIcon icon="fa-solid fa-wallet" /><span>{balance}</span></a>
        <a className='desk' href="./billing" style={{ padding: "0.38rem 0 0.38rem 0.88rem" }}>
          <FontAwesomeIcon icon="fa-solid fa-swatchbook" /><span className='btn'>Top Up Balance</span>
        </a>
        <a className='desk' href="./cart"><FontAwesomeIcon icon="fa-solid fa-newspaper" /><span>My Orders</span></a>
       
        <Dropdown label="" dismissOnClick={true} renderTrigger={() =>  <div className="profile-pic w-4 z-50 "> <img src="https://prozone.cc/_nuxt/img/header2_user.1803c70.png" alt="" /></div>}>
      <Dropdown.Item icon={HiViewGrid} href='./profile'>Profile</Dropdown.Item>
      <Dropdown.Item icon={HiCog}  href='./rules'>Rules</Dropdown.Item>
      <Dropdown.Item icon={HiLogout}  href='./login'>Sign out</Dropdown.Item>
    </Dropdown>
      </div>  </div>    </div>
    </div>
  );
};

export default HorizontalNav;
