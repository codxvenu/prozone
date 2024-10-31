"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './page.css';
import VerticalNav from '../home/verticalnav';
import HorizontalNav from '../home/horizontal';

import { useNav } from '../home/NavContext';

const Profile = () => {

  const { nav } = useNav();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [creation, setCreation] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    // Fetch user details when component loads
    const fetchUserData = async () => {
      try {
        const user = localStorage.getItem('username');
        const response = await axios.get(`/api/profile?username=${user}`, {withCredentials: true });
        const { username, email, created_at } = response.data;
        setUsername(username);
        setEmail(email);
        setCreation(new Date(created_at).toLocaleDateString()); // Format date
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem('username');
    try {
      const response = await axios.post(
        `/api/profile/password`,
        {
          
          currentPassword,
          newPassword,
          username
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Redirect to the login page
        window.location.href = '/login';
      } else {
        console.error('Error updating password:', error);
        alert('Failed to update password. Please try again.');
      }
      
    }
  };

  return (
    <div className="app">
     
      <div className="main-content">
        <HorizontalNav />
        <div className='flex flex-row'>

       
        <VerticalNav />
        <div className={nav ? 'main-form grid grid-cols-2 g-5 hide' : 'main-form grid grid-cols-2 g-5 nohide'}>
          <div className='acc'>
            <h1 className='text-3xl mb-5'>Account Info</h1>
            <h1 className='mb-2'>UserName : {username}</h1>
            <h1 className='mb-2'>Email : {email}</h1>
            <h1 className='mb-2'>Registered : {creation}</h1>
          </div>
          <div className='acc'>
            <h1 className='text-3xl mb-5'>Account Edit</h1>
            <hr className='mb-10' />
            <form onSubmit={handlePasswordChange} className='grid grid-cols-2'>
              <div className="formbtn">
                <label htmlFor="user">UserName</label>
                <input name='user' type="text" readOnly value={username} />
              </div>
              <div className="formbtn">
                <label htmlFor="Current">Current Password</label>
                <input
                  name='Current'
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="formbtn">
                <label htmlFor="email">Email</label>
                <input name='email' type="email" readOnly value={email} />
              </div>
              <div className="formbtn">
                <label htmlFor="new">New Password</label>
                <input
                  name='new'
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div></div>
              <button type="submit">Save Changes</button>
            </form>
          </div> </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
