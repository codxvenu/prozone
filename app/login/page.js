"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import copy from "copy-to-clipboard";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'; // Correct import for useRouter in Next.js

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas , faUser } from '@fortawesome/free-solid-svg-icons';

library.add(fas , faUser);

import "./page.css";

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mdsCode, setMdsCode] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaUrl, setCaptchaUrl] = useState("https://react-store-x8e5.vercel.app/captcha");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter(); // Use useRouter from next/router

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = () => {
    setCaptchaUrl(`https://react-store-x8e5.vercel.app/captcha?${Date.now()}`);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleMdsCodeChange = (event) => {
    setMdsCode(event.target.value);
  };

  const handleCaptchaChange = (event) => {
    setCaptcha(event.target.value);
  };

  const handleCopy = () => {
    copy(mdsCode);
    toast.success("Copied to Clipboard");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Set loading state

    const url = isLogin ? "https://react-store-x8e5.vercel.app/login" : "https://react-store-x8e5.vercel.app/signup";
    const data = isLogin ? { username, password, mdsCode, captcha } : { username, password, email };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (isLogin) {
        if (result.message === "Login successful") {
          toast.success(result.message);
          router.push("/home"); // Redirect to home page after login
        } else {
          toast.error(result.message);
          fetchCaptcha(); // Refresh the CAPTCHA on error
        }
      } else {
        if (result.message && result.message.includes("Signup successful")) {
          toast.success(result.message);
          setMdsCode(result.mdsCode); // Display MDS code
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="login-container">
     
      <ToastContainer />
      <div className="form-container">
        <h2>{isLogin ? "SIGN IN" : "SIGN UP"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <span className="text-white input-ico">
            <FontAwesomeIcon icon={faUser} />
            </span>
         
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter Username"
              required
            />
          </div>
          <div className="form-group">
           <span className="input-ico"><FontAwesomeIcon icon="fa-solid fa-lock" /></span>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
               placeholder="Enter Password"
              required
            />
          </div>
          {!isLogin && (
            <div className="form-group">
           <span className="input-ico"><FontAwesomeIcon icon="fa-regular fa-envelope" /></span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                 placeholder="Enter Email"
                required
              />
            </div>
          )}
          {isLogin && (
            <div className="form-group">
             <span className="input-ico"><FontAwesomeIcon icon="fa-solid fa-bars-progress" /></span>
              <input
                type="text"
                id="mds-code"
                value={mdsCode}
                onChange={handleMdsCodeChange}
                 placeholder="Enter MDS CODE"
                required
              />
            </div>
          )}
          {isLogin && (
            <div className="form-group flex flex-row .captcha-container">
              <img className="captcha-image" src={captchaUrl} alt="CAPTCHA" />
              <input
                type="text"
                id="captcha"
                value={captcha}
                onChange={handleCaptchaChange}
                required
              />
            </div>
          )}
          <button className="submit" type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : isLogin ? "SIGN IN" : "SIGN UP"}
          </button>
        </form>
        <p>{isLogin ? "Don't have an account?" : "Already have an account?"} <a href="#" onClick={() => setIsLogin(!isLogin)}>{isLogin ? "SIGN UP" : "SIGN IN"}</a></p>
      </div>
      <div className="img">
   <img src="https://prozone.cc/_nuxt/img/img-sign-in.9512930.jpg" alt="" />   
      </div>
    </div>
  );
}

export default LoginSignup;
