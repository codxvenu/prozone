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


function bins() {
  
  const [isloader, setIsloader] = useState(false);
    const [isfilter, setIsfilter] = useState(false);
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(100);
    const [country, setCountrys] = useState([]);
    const [levels, setLevels] = useState([]);
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
    useEffect(() => {
       
          fetch('https://nocash.cc/out/api/country')
            .then(response => {
              if (response.ok) return response.json();
              return response.text().then(text => { throw new Error(text); });
            })
            .then(data => setCountrys(data.map(item => item.country)))
            .catch(error => console.error('Error fetching country:', error));
  
          fetch('https://nocash.cc/out/api/level')
            .then(response => {
              if (response.ok) return response.json();
              return response.text().then(text => { throw new Error(text); });
            })
            .then(data => setLevels(data.map(item => item.level)))
            .catch(error => console.error('Error fetching level:', error));
  
       
       
        }, []);
        useEffect(() => {
            settData(tdata);
            if (Array.isArray(tdata)) {
              setTableData(tdata); // Set the tableData state to the array response
            } else {
              console.error('Expected an array response');
            }
          }, [tdata]);
          
    // State to track selected rows
    
  
    // Handler for "Select All" checkbox
  
    const [formData, setFormData] = useState({
        buyed : 'false',
      level: '',
      country: '',
      bin: '',
      types: '',
      binPriceRange: [0, 100]
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value !== undefined ? value : '',
      });
    };
  
    const handleSubmit = async (e) => {
      isloader(true)
        e.preventDefault();
        try {
          const response = await fetch('https://nocash.cc/out/api/bins', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              buyed: formData.buyed === 'true' || formData.buyed === true, // Ensure buyed is boolean
              level: formData.level,
              country: formData.country,
              bin: formData.bin,
              types: formData.types,
              minprice: minValue,
              maxprice: maxValue,
            }),
          });
      
          const data = await response.json();
          isloader(false)
          settData(data);
          if (Array.isArray(data)) {
            setTableData(data); // Set the tableData state to the array response
          } else {
            console.error('Expected an array response');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      
      
  
  
  
    const handleClear = () => {
      setFormData({
        buyed : '',
        level: '',
        country: '',
       
        bin: '',
      
        type: '',
       
        binPriceRange: [0, 100]
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
      isloader(true)
      // Extract the selected rows data based on the IDs in selectedRows
      const selectedData = Array.from(selectedRows).map(id => tableData.find(row => row.id === id));
    
      // Prepare the request payload
      const requestBody = JSON.stringify({ items: selectedData });
    
      console.log('Request payload:', requestBody); // Debugging: Log the request payload
      try {
        const response = await fetch('https://nocash.cc/out/api/purchase_bins', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
          credentials: 'include' // This includes credentials (cookies, HTTP auth) with the request
        })
    
        const result = await response.json();
    
        if (response.ok) {
          isloader(false)
          toast.success(result.message);
          // Optionally reload the page or update state
        } else {
          isloader(false)
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
       <div className="main-form">     <div className="main-form">    
    { !isfilter && (
       <form onSubmit={handleSubmit}>
        <div className='gap-6 break'>

       
       
       
      
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
          <label>Country</label>
          <select name="country" value={formData.country} onChange={handleInputChange}>
            <option value="">All Countries</option>
            {country.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
          </select>
        </div>
    
        <div className="form-row">
          <label>Bins</label>
          <input type="text" name="bin" value={formData.bin} onChange={handleInputChange} placeholder="601100,492181,..." />
        </div>
      
        <div className="form-row">
          <label>Types</label>
          <select name="types" value={formData.types} onChange={handleInputChange}>
            <option value="">All Types</option>
           <option value="debit">Debit</option>
           <option value="ctedit">Credit</option>
           <option value="standard">Standard</option>
           <option value="ltd">LTD</option>

          </select>
        </div>
        <div className="form-row">
          <label>Owned</label>
          <select name="buyed" value={formData.buyed} onChange={handleInputChange}>
            <option value="true">Yes</option>
            <option value="false">No</option>


          </select>
        </div>
        </div>
        <div className='flex gap-5 items-center'>

        
   <div className="bin">
    <div className="form-row">
          <label>Bins Price Range</label>
         
         
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
      <hr className='w-6/12' /><label htmlFor="hide" className='w-24'>Hide Filter</label><input type="checkbox" name="hide" checked={isfilter}
          onChange={handlefilterChange} /><hr className='w-6/12'  />
    </div>
    <div className="datasets">
      <div className="flex justify-end">
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
            <th>Country</th>
            <th>Card Type</th>
            <th>Card Level</th>

            <th>Card Brand</th>
            <th>Bin Info</th>
            
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
              <td>{row.country}</td>
              <td>{row.type}</td>
              <td>{row.level}</td>
              <td>{row.brand}</td>
              <td>{row.info}</td>
              <td>{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>   
    </div>
     </div>
    </div>  
    </div>  
);
};
export default bins
