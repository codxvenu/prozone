"use client"
import React, { useState  , useEffect , useRef} from 'react';

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./page.css"
import VerticalNav from '../home/verticalnav';
import HorizontalNav from '../home/horizontal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome , faTelegram} from '@fortawesome/free-brands-svg-icons'
library.add(fas,faTwitter, faFontAwesome)
import axios from 'axios';
const CreditCardForm =  () => {

  const [isfilter, setIsfilter] = useState(false);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const [cities, setCities] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [continents, setContinent] = useState([]);
 
  const [states, setStates] = useState([]);
 
 
  const [tdata, settData] = useState([]);
  const [tableData, setTableData] = useState([]); // State to hold the table data
  
  const priceGap = 1;

  useEffect(() => {
    if (minValue > maxValue - priceGap) {
      if(minValue < 0)
      setMinValue(maxValue - priceGap);
    }
  }, [minValue, maxValue]);

  const handleMinRangeChange = (e) => {
    const value = Number(e.target.value);
    if (value < 0) {
      setMinValue(0);
    } else if (value > maxValue - priceGap) {
      setMinValue(maxValue - priceGap);
    } else {
      setMinValue(value);
    }
  };

  const handleMaxRangeChange = (e) => {
    const value = Number(e.target.value);
    if (value > 100) {
      setMaxValue(100);
    } else if (value < minValue + priceGap) {
      setMaxValue(minValue + priceGap);
    } else {
      setMaxValue(value);
    }
  };  


  const [data, setData] = useState([]);
  useEffect(() => {
       
    fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/country`)
    .then(response => {
      if (response.ok) return response.json();
      return response.text().then(text => { throw new Error(text); });
    })
    .then(data => setCountrys(data.map(item => item.country)))
    .catch(error => console.error('Error fetching country:', error));

    fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/state`)
    .then(response => {
      if (response.ok) return response.json();
      return response.text().then(text => { throw new Error(text); });
    })
    .then(data => setStates(data.map(item => item.state)))
    .catch(error => console.error('Error fetching state:', error));

        
      }, []);
      
  // State to track selected rows
  

  // Handler for "Select All" checkbox

  const [formData, setFormData] = useState({
   
    continent : "",
    state : "",
    city : "",
    zip : ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value !== undefined ? value : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/Proxies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          continent : formData.continent,
          state : formData.state,
          city : formData.city,
          zip : formData.zip,
          minprice : minValue,
          maxprice : maxValue
        }),
      });


     settData(await response.json());
      if (Array.isArray(tdata)) {
        setTableData(tdata); // Set the tableData state to the array response
      } else {
        console.error('Expected an array response');
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
 



  const handleClear = () => {
    setFormData({
      continent : "",
      state : "",
      city : "",
      zip : ""
    });
    settData([]);
    setTableData([]);
    setSelectedRows(new Set());
  };
 // Handler for "Select All" checkbox
 const handleSelectAll = (e) => {
  if (e.target.checked) {
    setSelectedRows(new Set(tableData.map(item => item.id)));
  } else {
    setSelectedRows(new Set());
  }
};

// Handler for individual row selection
const handleRowSelect = (id) => {
  setSelectedRows(prev => {
    const newSelection = new Set(prev);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    return newSelection;
  });
};

  const handleorder = async () => {
    // Extract the selected rows data based on the IDs in selectedRows
    const selectedData = Array.from(selectedRows).map(id => tableData.find(row => row.id === id));
  
    // Prepare the request payload
    const requestBody = JSON.stringify({ items: selectedData });
  
    console.log('Request payload:', requestBody); // Debugging: Log the request payload
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/purchase_proxies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
        credentials: 'include' // This includes credentials (cookies, HTTP auth) with the request
      })
  
      const result = await response.json();
  
      if (response.ok) {
        toast.success(result.message);
        // Optionally reload the page or update state
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };
  
  

  return (
    <div className="app">
      <VerticalNav />
      <div className="main-content">
        <HorizontalNav />   
       <div className="main-form">    
    { !isfilter && (
       <form onSubmit={handleSubmit}>
        <div className='gap-6 break'>

        <div className="form-row">
          <label>Continent</label>
          <select name="continent" value={formData.continent} onChange={handleInputChange}>
            <option value="">All Continent</option>
            {continents.map(continent => (
                      <option key={continent} value={continent}>{continent}</option>
                    ))}
          </select>
        </div>
        <div className="form-row">
          <label>State</label>
          <select name="state" value={formData.state} onChange={handleInputChange}>
            <option value="">All States</option>
            {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
          </select>
        </div>
       
        <div className="form-row">
          <label>City</label>
          <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" />
         
                     
        </div>
       
        <div className="form-row break-sub">
          <label>ZIP</label>
          <input name="zip" value={formData.zip} onChange={handleInputChange} placeholder="10001,90001,95912,..." />
        </div>
       
     
        </div>
        <div className='flex gap-5 items-center'>

        
   <div className="bin">
    <div className="form-row">
          <label>IP Price Range</label>
         
         
        </div>
        <div className='slider-div'>
          <span className='flex gap-4'>
            <h1>${minValue}</h1>-<h1>${maxValue}</h1>
          </span>
       
        <input
        type="range"
        min="0"
        max="100"
        value={minValue}
        onChange={handleMinRangeChange}
        className="thumb thumb--zindex-3"
      />
      <input
        type="range"
        min="0"
        max="100"
        value={maxValue}
        onChange={handleMaxRangeChange}
        className="thumb thumb--zindex-4"
      />
      <div className="slider">
   <div className="slider__track" />
   <div className="slider__range" style={{ left: `${(minValue / 100) * 100}%`, right: `${100 - (maxValue / 100) * 100}%` }} />
</div> </div> </div>
  
        <div className="form-row ml-auto btns">
          <button type="submit" className='sumbit'>Search</button>
          <button type="button" className='clear' onClick={handleClear}>Clear</button>
        </div></div>
      </form>
    )}
    <div className="datasets mt-5">
      <div className="flex justify-end">
      <button type="button" className='b-selected bg-black w-52 p-2 rounded-md' onClick={handleorder}>Buy Selected</button>
      </div>
      <table border="1">
        <thead>
          <tr>
          <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedRows.size === tableData.length}
              /> </th>
            <th>IP</th>
            <th>Domain</th>
            <th>Dns</th>
            <th>Type</th>
            <th>Speed</th>
            <th>Ping</th>
            <th>Continent</th>
            <th>State</th>
            <th>City</th>
            <th>ZIP</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id}>
               <td>
            <input
              type="checkbox"
              checked={selectedRows.has(row.id)}
              onChange={() => handleRowSelect(row.id)}
            />
          </td>
              <td>{row.ip}</td>
              <td>{row.domain}</td>
              <td>{row.dns}</td>
              <td>{row.type}</td>
              <td>{row.speed}</td>
              <td>{row.ping}</td>
              <td>{row.country}</td>
              <td>{row.state}</td>
              <td>{row.city}</td>
              <td>{row.zip}</td>  
              <td>{row.price}$</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>   
    </div>
     </div>
    </div>   
  );
};

export default CreditCardForm;
