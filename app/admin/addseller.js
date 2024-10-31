"use client"
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../credit-cards/page.css"
import "./page.css"

const Addseller = () => {
  const [isLoader, setIsLoader] = useState(false);
  const [user, setUser] = useState([]);
  const [formData, setFormData] = useState({
    user: '',
    role: '',
    price: '',
  });

  useEffect(() => {
    fetch(`/api/getusers`)
      .then(response => {
        if (response.ok) {
          console.log('Response is OK'); // Log when response is OK
          return response.json();
        }
        return response.text().then(text => { throw new Error(text); });
      })
      .then(data => {
        console.log('Data received from API:', data); // Log the raw data
        const userList = data.map(item => item.username); // Assuming the property is `username`
        console.log('Processed user list:', userList); // Log the processed user list
        setUser(userList);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value !== undefined ? value : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoader(true);

    try {
      const response = await fetch("/api/add-seller", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Seller data added successfully");
        setFormData({
          user: '',
          role: '',
          price: '',
        });
      } else {
        const errorData = await response.json();
        console.log(errorData.message);
        toast.error(`Failed to add Seller data: ${errorData.message}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoader(false);
    }
  };

  return (
    <div className="admin-app">
      <div className="main-content admin-main">
        <div className='admin-form'>
          <form onSubmit={handleSubmit}>
            <div className='gap-6 flex flex-wrap'>
              <div className="form-row">
                <label>User</label>
                <select name="user" value={formData.user} onChange={handleInputChange}>
                <option value="">Select User</option>
                  {user.length > 0 ? (
                    user.map(userItem => (
                      <option key={userItem} value={userItem}>{userItem}</option>
                    ))
                  ) : (
                    <option value="">No users available</option>
                  )}
                </select>
              </div>

              <div className="form-row">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleInputChange}>
                  <option value="">All Types</option>
                      <option value="admin">Admin</option>
                      <option value="reseller">Reseller</option>
                      <option value="user">User</option>
                  </select>
              </div>
            </div>

            <div className="form-row w-32">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter Price"
              />
            </div>

            <div className="form-row">
              <button type="submit" className="submit">Add Seller Data</button>
            </div>
          </form>
          {isLoader && <h1>Loading.....</h1>}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Addseller;
