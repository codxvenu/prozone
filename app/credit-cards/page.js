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
  const [isloader, setIsloader] = useState(false);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const [cities, setCities] = useState([]);
  const [banks, setBanks] = useState([]);
  const [country, setCountrys] = useState([]);
  const [levels, setLevels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [states, setStates] = useState([]);
  const [bases, setBases] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [tdata, settData] = useState([]);
  const [tableData, setTableData] = useState([]); // State to hold the table data

  
  const priceGap = 1;

  useEffect(() => {
    if (minValue > maxValue - priceGap) {
      if(minValue < 0)
      setMinValue(maxValue - priceGap);
    }
  }, [minValue, maxValue]);

  const handlefilterChange = (e) => {
    setIsfilter(e.target.checked);
  };

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
        fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}api/cities`)
          .then(response => {
            if (response.ok) return response.json();
            return response.text().then(text => { throw new Error(text); });
          })
          .then(data => setCities(data.map(item => item.city)))
          .catch(error => console.error('Error fetching cities:', error));
      
        fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}api/banks`)
          .then(response => {
            if (response.ok) return response.json();
            return response.text().then(text => { throw new Error(text); });
          })
          .then(data => setBanks(data.map(item => item.bankname)))
          .catch(error => console.error('Error fetching banks:', error));
        fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}api/country`)
          .then(response => {
            if (response.ok) return response.json();
            return response.text().then(text => { throw new Error(text); });
          })
          .then(data => setCountrys(data.map(item => item.country)))
          .catch(error => console.error('Error fetching country:', error));

        fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}api/level`)
          .then(response => {
            if (response.ok) return response.json();
            return response.text().then(text => { throw new Error(text); });
          })
          .then(data => setLevels(data.map(item => item.level)))
          .catch(error => console.error('Error fetching level:', error));

        fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}api/brand`)
          .then(response => {
            if (response.ok) return response.json();
            return response.text().then(text => { throw new Error(text); });
          })
          .then(data => setBrands(data.map(item => item.brand)))
          .catch(error => console.error('Error fetching brand:', error));

        fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}api/state`)
          .then(response => {
            if (response.ok) return response.json();
            return response.text().then(text => { throw new Error(text); });
          })
          .then(data => setStates(data.map(item => item.state)))
          .catch(error => console.error('Error fetching state:', error));

        fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}api/base`)
          .then(response => {
            if (response.ok) return response.json();
            return response.text().then(text => { throw new Error(text); });
          })
          .then(data => setBases(data.map(item => item.base)))
          .catch(error => console.error('Error fetching state:', error));
      }, []);
      
  // State to track selected rows
  

  // Handler for "Select All" checkbox

  const [formData, setFormData] = useState({
    shop: '',
    seller: '',
    city: '',
    expirationDate: '',
    zip: '',
    level: '',
    country: '',
    brand: '',
    bins: '',
    bankName: '',
    state: '',
    types: '',
    bases: '',
    binPriceRange: [0, 100],
    extendedOptions: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value !== undefined ? value : '',
    });
  };

  const handleSubmit = async (e) => {
    setIsloader(true)
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}api/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop: formData.shop,
          seller: formData.seller,
          city: formData.city,
          expirationDate: formData.expirationDate,
          zip: formData.zip,
          level: formData.level,
          country: formData.country,
          brand: formData.brand,
          bin: formData.bin,
          bankName: formData.bankName,
          state: formData.state,
          bases: formData.bases,
          types : formData.types,
          minprice : minValue,
          maxprice : maxValue
        }),
      });


     settData(await response.json());
      if (Array.isArray(tdata)) {
        setTableData(tdata); // Set the tableData state to the array response
        setIsloader(false)
      } else {
        console.error('Expected an array response');
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handlePreorder = async () => {
    const body = {
      email: formData.email,
      city: formData.city,
      state: formData.state,
      level: formData.level,
      country: formData.country,
      brand: formData.brand,
      bin: formData.bin,
      bases: formData.bases,
      bankName: formData.bankName,
      zip: formData.zip,
      minValue : minValue,
      maxValue: maxValue
    };

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}api/preorder', body);
      toast.success('Preorder request sent successfully`);
    } catch (error) {
      console.error('Error sending preorder request', error);
      toast.error('Failed to send preorder request');
    }
  };



  const handleClear = () => {
    setFormData({
      shop: '',
      seller: '',
      city: '',
      expirationDate: '',
      zip: '',
      level: '',
      country: '',
      brand: '',
      bins: '',
      bankName: '',
      state: '',
      type: '',
      bases: '',
      binPriceRange: [0, 100],
      cvrRange: [0, 100],
      extendedOptions: '',
    });
    setData([]);
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
    setIsloader(true)
    // Extract the selected rows data based on the IDs in selectedRows
    const selectedData = Array.from(selectedRows).map(id => tableData.find(row => row.id === id));
  
    // Prepare the request payload
    const requestBody = JSON.stringify({ items: selectedData });
  
    console.log('Request payload:', requestBody); // Debugging: Log the request payload
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}api/purchase`, {
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
        isloader(false)
      } else {
        toast.error(result.message);
        isloader(false)
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
          <label>Bins</label>
          <input type="text" name="bin" value={formData.bin} onChange={handleInputChange} placeholder="601100,492181,..." />
        </div>
        <div className="form-row">
          <label>Country</label>
          <select name="country" value={formData.country} onChange={handleInputChange}>
            <option value="">All Countries</option>
            {country.map(country => (
                      <option key={country} value={country}>{country}</option>
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
          <select type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" >
          <option value="">Select City </option>
          {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                     </select>
        </div>
       
        <div className="form-row break-sub">
          <label>ZIP</label>
          <input name="zip" value={formData.zip} onChange={handleInputChange} placeholder="10001,90001,95912,..." />
        </div>
    


        <div className="form-row">
          <label>Bank Name</label>
          <select type="text" name="bankName" className='bankname' value={formData.bankName} onChange={handleInputChange} placeholder="Please select" >
          <option value="">Select Bank</option>
          {banks.map(bankname => (
                      <option key={bankname} value={bankname}>{bankname}</option>
                    ))}
          </select>
        
        </div>
        <div className="form-row">
          <label>Level</label>
          <select name="level" value={formData.level} onChange={handleInputChange}>
            <option value="">All Levels</option>
            {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
          </select>
        </div>
       
        <div className="form-row">
          <label>Brand</label>
          <select name="brand" value={formData.brand} onChange={handleInputChange}>
            <option value="">All Brands</option>
            {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
          </select>
        </div>
       
      
       
        <div className="form-row">
          <label>Types</label>
          <select name="Types" value={formData.types} onChange={handleInputChange}>
            <option value="">All Types</option>
           <option value="debit">Debit</option>
           <option value="ctedit">Credit</option>
           <option value="standard">Standard</option>
           <option value="ltd">LTD</option>

          </select>
        </div>
        <div className="form-row">
          <label>Bases</label>
          <select name="bases" value={formData.bases} onChange={handleInputChange}>
            <option value="">All Bases</option>
            {bases.map(base => (
                      <option key={base} value={base}>{base}</option>
                    ))}
          </select>
        </div>
        </div>
        <div className='flex gap-5 items-center'>

        
   <div className="bin">
    <div className="form-row">
          <label>CC Price Range</label>
         
         
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
   
    <div className="data flex text-white items-center gap-3">
      <hr className='w-6/12 border-black' /><label htmlFor="hide" className='w-24'>Hide Filter</label><input type="checkbox" name="hide" checked={isfilter}
          onChange={handlefilterChange} /><hr className='w-6/12  border-black'  />
    </div>
    <div className="datasets">
      <div className="flex justify-between">
      <button type="button" className='pre-order bg-black w-52 rounded-md ' onClick={handlePreorder}>Pre-Order</button>
      <button type="button" className='b-selected bg-black w-52 p-2 rounded-md' onClick={handleorder}>Buy Selected</button>
      </div>
      {isloader && ( 
        <h1>Loading.....</h1>
      )}
      <table border="1">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedRows.size === tableData.length}
              />
            </th>
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
              <td>{row.bin}</td>
              <td>{row.time}</td>
              <td>{row.firstName}</td>
              <td>{row.country}</td>
              <td>{row.state}</td>
              <td>{row.city}</td>
              <td>{row.zip}</td>
              <td>
              <div className="info-container">
                <span className="info-icon text-center"><FontAwesomeIcon icon="fa-solid fa-info" className=' text-black bg-green-500 p-1 rounded-full' /></span>
                <div className="info-content">
                  {row.ssn ? <p>DOB: <span className='text-green-600'>Yes</span></p> : <p>DOB: <span className='text-red-600'>No</span></p> }
                  {row.cvv ?<p>SSN: <span className='text-green-600'>Yes</span></p> : <p>SSN: <span className='text-red-600'>No</span></p>}
                  
                  {row.ssn ? <p>EMAIL: <span className='text-green-600'>Yes</span></p> : <p>EMAIL: <span className='text-red-600'>No</span></p> }
                  {row.cvv ?<p>PHONE: <span className='text-green-600'>Yes</span></p> : <p>PHONE: <span className='text-red-600'>No</span></p>}
                  
                </div>
              </div>
            </td>
              <td>{row.address ? <span className='text-green-500 text-lg'>&#10004;</span> : '❌'}</td>
              <td>{row.binInfo}</td>
              <td>
              <div className="info-container">
                <span className="info-icon text-center"><FontAwesomeIcon icon="fa-solid fa-info" className=' text-black bg-green-500 p-1 rounded-full' /></span>
                <div className="info-content">
                 
                  {row.base ?<p>{row.base}</p> : <p>base: <span className='text-red-600'>No</span></p>}
                  
                </div>
              </div>
            </td>
              <td>{row.validPercent}</td>
              <td>{row.refundable ?  <span>Yes &#128994;</span> : <span>No &#128308;</span>}</td>
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
