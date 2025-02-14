"use client"
import React, { useState, useEffect, useRef } from 'react';

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./page.css"
import HorizontalNav from '../home/horizontal';
import VerticalNav from '../home/verticalnav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome, faTelegram } from '@fortawesome/free-brands-svg-icons'
library.add(fas, faTwitter, faFontAwesome)
import axios from 'axios';
import { useNav } from '../home/NavContext';
const CreditCardForm = () => {
  const { nav } = useNav();

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
      if (minValue < 0)
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
    fetch(`/api/cities`)
      .then(response => {
        if (response.ok) return response.json();
        return response.text().then(text => { throw new Error(text); });
      })
      .then(data => setCities(data.map(item => item.city)))
      .catch(error => console.error('Error fetching cities:', error));

    fetch(`/api/banks`)
      .then(response => {
        if (response.ok) return response.json();
        return response.text().then(text => { throw new Error(text); });
      })
      .then(data => setBanks(data.map(item => item.bankname)))
      .catch(error => console.error('Error fetching banks:', error));
    fetch(`/api/country`)
      .then(response => {
        if (response.ok) return response.json();
        return response.text().then(text => { throw new Error(text); });
      })
      .then(data => setCountrys(data.map(item => item.country)))
      .catch(error => console.error('Error fetching country:', error));

    fetch(`/api/level`)
      .then(response => {
        if (response.ok) return response.json();
        return response.text().then(text => { throw new Error(text); });
      })
      .then(data => setLevels(data.map(item => item.level)))
      .catch(error => console.error('Error fetching level:', error));

    fetch(`/api/brand`)
      .then(response => {
        if (response.ok) return response.json();
        return response.text().then(text => { throw new Error(text); });
      })
      .then(data => setBrands(data.map(item => item.brand)))
      .catch(error => console.error('Error fetching brand:', error));

    fetch(`/api/state`)
      .then(response => {
        if (response.ok) return response.json();
        return response.text().then(text => { throw new Error(text); });
      })
      .then(data => setStates(data.map(item => item.state)))
      .catch(error => console.error('Error fetching state:', error));

    fetch(`/api/base`)
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
      const response = await fetch(`/api/cards`, {
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
          types: formData.types,
          minprice: minValue,
          maxprice: maxValue,
          username: localStorage.getItem("username")
        }),
      });

     
     const resultss = await response.json()
      console.log(resultss);
      
      settData(resultss);
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
      minValue: minValue,
      maxValue: maxValue
    };

    try {
      const response = await axios.post('/api/preorder', body);
      toast.success('Preorder request sent successfully');
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
    setTableData([]);
    settData([]);
    setIsloader(true)
    // Extract the selected rows data based on the IDs in selectedRows
    const selectedData = Array.from(selectedRows).map(id => tableData.find(row => row.id === id));
    const username = localStorage.getItem('username');
    // Prepare the request payload
    const requestBody = JSON.stringify({ items: selectedData, username });

    console.log('Request payload:', requestBody); // Debugging: Log the request payload
    try {
      const response = await fetch(`/api/purchase`, {
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
        setIsloader(false)
      } else {
        toast.error(result.message);
        setIsloader(false)
      }
    } catch (error) {
      console.log(error);
      
      toast.error('An unexpected error occurred');
    }
  };



  return (
    <div className="app">

      <div className="main-content">
        <HorizontalNav />
      <div className='flex'>
            <VerticalNav />
            <div className={nav ? 'main-form hide' : 'main-form nohide'}>


            {!isfilter && (

              <form onSubmit={handleSubmit}>
                <div className='gap-6 break'>


                  <div className="form-row">
                    <label>Bins</label>
                    <input type="text" name="bin" value={formData.bin} onChange={handleInputChange} placeholder="601100,492181,..." />
                  </div>
                  <div className="form-row">
                    <label>Country</label>
                    <select placeholder="Enter Country" name="country" value={formData.country} onChange={handleInputChange}>
                  <option value="">All Countries</option>
        <option>AW-Aruba</option>
        <option>AF-Afghanistan</option>
        <option>AO-Angola</option>
        <option>AL-Albania</option>
        <option>AD-Andorra</option>
        <option>AE-United Arab Emirates</option>
        <option>AR-Argentina</option>
        <option>AM-Armenia</option>
        <option>AS-American Samoa</option>
        <option>AG-Antigua and Barbuda</option>
        <option>AU-Australia</option>
        <option>AT-Austria</option>
        <option>BI-Burundi</option>
        <option>BE-Belgium</option>
        <option>BJ-Benin</option>
        <option>BF-Burkina Faso</option>
        <option>BG-Bulgaria</option>
        <option>BH-Bahrain</option>
        <option>BS-Bahamas, The</option>
        <option>BA-Bosnia and Herzegovina</option>
        <option>BY-Belarus</option>
        <option>BZ-Belize</option>
        <option>BM-Bermuda</option>
        <option>BO-Bolivia</option>
        <option>BR-Brazil</option>
        <option>BB-Barbados</option>
        <option>BN-Brunei Darussalam</option>
        <option>BT-Bhutan</option>
        <option>BW-Botswana</option>
        <option>CF-Central African Republic</option>
        <option>CA-Canada</option>
        <option>CH-Switzerland</option>
        <option>JG-Channel Islands</option>
        <option>CL-Chile</option>
        <option>CN-China</option>
        <option>CI-Cote d'Ivoire</option>
        <option>CM-Cameroon</option>
        <option>CD-Congo, Dem. Rep.</option>
        <option>CG-Congo, Rep.</option>
        <option>CO-Colombia</option>
        <option>KM-Comoros</option>
        <option>CV-Cabo Verde</option>
        <option>CR-Costa Rica</option>
        <option>CU-Cuba</option>
        <option>CW-Curacao</option>
        <option>KY-Cayman Islands</option>
        <option>CY-Cyprus</option>
        <option>CZ-Czech Republic</option>
        <option>DE-Germany</option>
        <option>DJ-Djibouti</option>
        <option>DM-Dominica</option>
        <option>DK-Denmark</option>
        <option>DO-Dominican Republic</option>
        <option>DZ-Algeria</option>
        <option>EC-Ecuador</option>
        <option>EG-Egypt, Arab Rep.</option>
        <option>ER-Eritrea</option>
        <option>ES-Spain</option>
        <option>EE-Estonia</option>
        <option>ET-Ethiopia</option>
        <option>FI-Finland</option>
        <option>FJ-Fiji</option>
        <option>FR-France</option>
        <option>FO-Faroe Islands</option>
        <option>FM-Micronesia, Fed. Sts.</option>
        <option>GA-Gabon</option>
        <option>GB-United Kingdom</option>
        <option>GE-Georgia</option>
        <option>GH-Ghana</option>
        <option>GI-Gibraltar</option>
        <option>GN-Guinea</option>
        <option>GM-Gambia, The</option>
        <option>GW-Guinea-Bissau</option>
        <option>GQ-Equatorial Guinea</option>
        <option>GR-Greece</option>
        <option>GD-Grenada</option>
        <option>GL-Greenland</option>
        <option>GT-Guatemala</option>
        <option>GU-Guam</option>
        <option>GY-Guyana</option>
        <option>HK-Hong Kong SAR, China</option>
        <option>HN-Honduras</option>
        <option>HR-Croatia</option>
        <option>HT-Haiti</option>
        <option>HU-Hungary</option>
        <option>ID-Indonesia</option>
        <option>IM-Isle of Man</option>
        <option>IN-India</option>
        <option>IE-Ireland</option>
        <option>IR-Iran, Islamic Rep.</option>
        <option>IQ-Iraq</option>
        <option>IS-Iceland</option>
        <option>IL-Israel</option>
        <option>IT-Italy</option>
        <option>JM-Jamaica</option>
        <option>JO-Jordan</option>
        <option>JP-Japan</option>
        <option>KZ-Kazakhstan</option>
        <option>KE-Kenya</option>
        <option>KG-Kyrgyz Republic</option>
        <option>KH-Cambodia</option>
        <option>KI-Kiribati</option>
        <option>KN-St. Kitts and Nevis</option>
        <option>KR-Korea, Rep.</option>
        <option>KW-Kuwait</option>
        <option>LA-Lao PDR</option>
        <option>LB-Lebanon</option>
        <option>LR-Liberia</option>
        <option>LY-Libya</option>
        <option>LC-St. Lucia</option>
        <option>LI-Liechtenstein</option>
        <option>LK-Sri Lanka</option>
        <option>LS-Lesotho</option>
        <option>LT-Lithuania</option>
        <option>LU-Luxembourg</option>
        <option>LV-Latvia</option>
        <option>MO-Macao SAR, China</option>
        <option>MF-St. Martin (French part)</option>
        <option>MA-Morocco</option>
        <option>MC-Monaco</option>
        <option>MD-Moldova</option>
        <option>MG-Madagascar</option>
        <option>MV-Maldives</option>
        <option>MX-Mexico</option>
        <option>MH-Marshall Islands</option>
        <option>MK-Macedonia, FYR</option>
        <option>ML-Mali</option>
        <option>MT-Malta</option>
        <option>MM-Myanmar</option>
        <option>ME-Montenegro</option>
        <option>MN-Mongolia</option>
        <option>MP-Northern Mariana Islands</option>
        <option>MZ-Mozambique</option>
        <option>MR-Mauritania</option>
        <option>MU-Mauritius</option>
        <option>MW-Malawi</option>
        <option>MY-Malaysia</option>
        <option>NA-Namibia</option>
        <option>NC-New Caledonia</option>
        <option>NE-Niger</option>
        <option>NG-Nigeria</option>
        <option>NI-Nicaragua</option>
        <option>NL-Netherlands</option>
        <option>NO-Norway</option>
        <option>NP-Nepal</option>
        <option>NR-Nauru</option>
        <option>NZ-New Zealand</option>
        <option>OM-Oman</option>
        <option>PK-Pakistan</option>
        <option>PA-Panama</option>
        <option>PE-Peru</option>
        <option>PH-Philippines</option>
        <option>PW-Palau</option>
        <option>PG-Papua New Guinea</option>
        <option>PL-Poland</option>
        <option>PR-Puerto Rico</option>
        <option>KP-Korea, Dem. People’s Rep.</option>
        <option>PT-Portugal</option>
        <option>PY-Paraguay</option>
        <option>PS-West Bank and Gaza</option>
        <option>PF-French Polynesia</option>
        <option>QA-Qatar</option>
        <option>RO-Romania</option>
        <option>RW-Rwanda</option>
        <option>SA-Saudi Arabia</option>
        <option>SD-Sudan</option>
        <option>SN-Senegal</option>
        <option>SG-Singapore</option>
        <option>SB-Solomon Islands</option>
        <option>SL-Sierra Leone</option>
        <option>SV-El Salvador</option>
        <option>SM-San Marino</option>
        <option>SO-Somalia</option>
        <option>RS-Serbia</option>
        <option>SS-South Sudan</option>
        <option>ST-Sao Tome and Principe</option>
        <option>SR-Suriname</option>
        <option>SK-Slovak Republic</option>
        <option>SI-Slovenia</option>
        <option>SE-Sweden</option>
        <option>SG-Singapore</option>
        <option>SH-St. Helena</option>
        <option>SI-Slovenia</option>
        <option>SJ-Svalbard and Jan Mayen Islands</option>
        <option>SK-Slovakia</option>
        <option>SL-Sierra Leone</option>
        <option>SM-San Marino</option>
        <option>SN-Senegal</option>
        <option>SO-Somalia</option>
        <option>SR-Suriname</option>
        <option>SS-South Sudan</option>
        <option>ST-Sao Tome and Principe</option>
        <option>SV-El Salvador</option>
        <option>SX-Sint Maarten (Dutch part)</option>
        <option>SY-Syrian Arab Republic</option>
        <option>SZ-Swaziland</option>
        <option>TC-Turks and Caicos Islands</option>
        <option>TD-Chad</option>
        <option>TF-French Southern Territories</option>
        <option>TG-Togo</option>
        <option>TH-Thailand</option>
        <option>TJ-Tajikistan</option>
        <option>TK-Tokelau</option>
        <option>TM-Turkmenistan</option>
        <option>TL-Timor-Leste</option>
        <option>TO-Tonga</option>
        <option>TT-Trinidad and Tobago</option>
        <option>TV-Tuvalu</option>
        <option>TZ-Tanzania</option>
        <option>UA-Ukraine</option>
        <option>UG-Uganda</option>
        <option>UM-U.S. Minor Outlying Islands</option>
        <option>US-United States</option>
        <option>UY-Uruguay</option>
        <option>UZ-Uzbekistan</option>
        <option>VA-Vatican City State</option>
        <option>VC-St. Vincent and the Grenadines</option>
        <option>VE-Venezuela, RB</option>
        <option>VN-Viet Nam</option>
        <option>VU-Vanuatu</option>
        <option>WF-Wallis and Futuna Islands</option>
        <option>WS-Samoa</option>
        <option>YE-Yemen</option>
        <option>YT-Mayotte</option>
        <option>ZA-South Africa</option>
        <option>ZM-Zambia</option>
        <option>ZW-Zimbabwe</option>
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
            <option>PREPAID</option>
            <option>ATM</option>
            <option>PLATINUM</option>
            <option>CLASSIC</option>
            <option>PREMIUM</option>
            <option>STANDARD</option>
            <option>TITANIUM</option>
            <option>BUSINESS</option>
            <option>WORLD</option>
            <option>GOLD</option>
            <option>CORPORATE</option>
            <option>GIFT</option>
            <option>BLACK</option>
            <option>GREEN</option>
            <option>PROPRIETAR</option>
            <option>OUR CARD</option>
            <option>SHINHAN CAR</option>
            <option>SILVER</option>
            <option>PURCHASING</option>
            <option>CORPORATE GOLD</option>
            <option>NH PLATINUM</option>
            <option>OTHER</option>
            <option>PERSONAL</option>
            <option>CENTURION</option>
            <option>BLUE</option>
            <option>OPTIMA</option>
            <option>PREMIUM PLUS</option>
            <option>GOLD BUSINESS</option>
            <option>PLATINUM BUSINESS</option>
            <option>SMALL BUSINESS</option>
            <option>ULTIMATE</option>
            <option>REVOLVING</option>
            <option>GIFT/PREPAID</option>
            <option>ELECTRON</option>
            <option>INFINITE</option>
            <option>SIGNATURE</option>
            <option>REWARDS</option>
            <option>CORPORATE T&amp;E</option>
            <option>VIRTUAL</option>
            <option>V PAY</option>
            <option>PLATINUM REWARD</option>
            <option>PRIVATE LABEL</option>
            <option>T</option>
            <option>PROPRIETOR</option>
            <option>SEARS</option>
            <option>STANDARD/BUSINESS</option>
            <option>STANDARD/WORLD/PREPAID</option>
            <option>WORLD BLAC</option>
            <option>GOLD/WORLD</option>
            <option>PREPAID GOVERNMEN</option>
            <option>STANDARD/PREPAID</option>
            <option>GOVERNMENT PREPAID</option>
            <option>BUSINESS </option>
            <option>BUSINESS WORLD</option>
            <option>STANDARD UNEMBOSSED</option>
            <option>STANDARD/GOLD</option>
            <option>STANDARD/GOLD/PLATINUM</option>
            <option>PLATINUM/WORLD/TITANIUM/BUSINESS</option>
            <option>WORLD ELIT</option>
            <option>BUSINESS/STANDARD</option>
            <option>STANDARD/WORLD</option>
            <option>GOLD/STANDARD</option>
            <option>GOLD/PLATINUM</option>
            <option>HSA NON-SUBSTANTIATE</option>
            <option>TITANUM</option>
            <option>STANDARD/WORLD/GOLD/PLATINUM</option>
            <option>HEALTH SAVING</option>
            <option>PREPAID CORPORATE</option>
            <option>STANDARD/BUSINESS/PREPAID</option>
            <option>CORPORATE/BUSINESS</option>
            <option>CORPORATE/PREPAID</option>
            <option>BUSINESS PREPAID</option>
            <option>WORLD/PLATINUM</option>
            <option>CORPORATE/PURCHASIN</option>
            <option>PLATINUM/WORLD</option>
            <option>PREPAID/GIF</option>
            <option>PREPAID CORPORATE/PREPAID</option>
            <option>TITANIUM/GOLD</option>
            <option>STANDARD PREPAID</option>
            <option>STANDARD/PREPAID/WORLD</option>
            <option>PREPAID/STANDARD</option>
            <option>PRIVATE LABEL/PRIVATE LABEL/PREPA</option>
            <option>WORLD/STANDAR</option>
            <option>CREDIT</option>
            <option>CORPORATE CAR</option>
            <option>STANDARD/GOLD/TITANIU</option>
            <option>PLATINUM/GOLD</option>
            <option>PLATINUM/STANDART</option>
            <option>PLATINUM/TITANIU</option>
            <option>BUSINESS/CORPORATE</option>
            <option>WORLD/STANDARD</option>
            <option>GOLD/STANDARD/PLATINUM</option>
            <option>GOLD/BUSINESS</option>
            <option>STANDARD UNEMBOSSED/STANDARD</option>
            <option>WORLD/CORPORATE</option>
            <option>VIRTUAL BUSINESS</option>
            <option>FLEET</option>
            <option>PURCHASING/CORPORATE</option>
            <option>GOLD/CORPORATE</option>
            <option>GOLD/STANDARD/TITANIUM/PLATINUM</option>
            <option>CORPORATE PURCHASIN</option>
            <option>CORPORATE FLEE</option>
            <option>FLEET/BUSINESS</option>
            <option>COMMERCIAL</option>
            <option>GOVERNMENT COMMERCIA</option>
            <option>GSA</option>
            <option>STANDARD/GOLD/PLATINUM/WORLD</option>
            <option>STANDARD/PLATINUM</option>
            <option>ATM ONLY</option>
            <option>PREPAID/REWARDS</option>
            <option>BUSINESS/PREPAID/STANDARD/REWARD</option>
            <option>STANDARD/REWARD</option>
            <option>PREPAID/STANDARD/REWARDS</option>
            <option>PREPAID/STANDARD/REWARDS/BUSINESS</option>
            <option>PREMIUM/REWARDS/PREPAID</option>
            <option>BUSINESS/PREPAID/STANDART</option>
            <option>Q-CASH</option>
            <option>ICARD</option>
            <option>PROPRIETARY</option>
            <option>PAYMENT CAR</option>
            <option>EXECUTIVE BUSINESS</option>
            <option>PRIVATE</option>
            <option>ATM ONLY - CASHLINE CAR</option>
            <option>PROPRIETARY/STANDART</option>
            <option>PROPRIETARY/PREPAID</option>
        
                  </select>
                  </div>

                  <div className="form-row">
                    <label>Brand</label>
                    <select name="brand" value={formData.brand} onChange={handleInputChange}>
                
                <option value="">All Brands</option>
                <option value="local_card">LOCAL CARD</option>
                <option value="mir">MIR</option>
                <option value="mastercard">MASTERCARD</option>
                <option value="diners_club">DINERS CLUB</option>
                <option value="amex">AMEX</option>
                <option value="jcb">JCB</option>
                <option value="visa">VISA</option>
                <option value="maestro">MAESTRO</option>
                <option value="ebt">EBT</option>
                <option value="rupay">RUPAY</option>
                <option value="elocard">ELOCARD</option>
                <option value="eftpos">EFTPOS</option>
                <option value="cabal">CABAL</option>
                <option value="discover">DISCOVER</option>
                <option value="china_unionpay">CHINA UNIONPAY</option>
                <option value="sbercard">SBERCARD</option>
                <option value="nsme">NSMEP</option>
                <option value="dinacard">DINACARD</option>
                <option value="comproc">COMPROCARD</option>
            </select>
                  </div>



                  <div className="form-row">
                    <label>Types</label>
                    <select name="types" value={formData.types} onChange={handleInputChange}>
                      <option value="">All Types</option>
                      <option value="debit">Debit</option>
                      <option value="credit">Credit</option>
                      <option value="standard">Standard</option>
                      <option value="ltd">LTD</option>

                    </select>
                  </div>
                  <div className="form-row">
                    <label>Bases</label>
                    <select name="bases" value={formData.bases} onChange={handleInputChange}>
        <option value="">All Bases</option>
        <option value="1000">⭐ DISCOUNTED REFUNDABLE [$4.90]</option>
        <option value="148">[15 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="147">[14 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="146">[13 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="145">[12 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="144">[09 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="143">[08 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="142">[07 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="141">[06 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="140">[05 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="139">[02 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="138">[01 AUG 2024] SNIFF US WORLD MIX</option>
        <option value="137">[31 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="136">[30 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="135">[29 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="134">[26 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="133">[25 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="132">[24 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="131">[23 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="130">[22 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="129">[18 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="128">[15 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="127">[12 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="126">[11 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="125">[10 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="124">[09 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="123">[08 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="122">[05 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="121">[04 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="120">[03 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="119">[02 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="118">[01 JUL 2024] SNIFF US WORLD MIX</option>
        <option value="117">[28 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="116">[27 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="115">[26 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="114">[25 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="113">[21 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="112">[20 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="111">[19 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="110">[18 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="109">[14 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="108">[13 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="107">[12 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="106">[11 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="105">[10 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="104">[07 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="103">[06 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="102">[05 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="101">[03 JUN 2024] SNIFF US WORLD MIX</option>
        <option value="100">[31 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="99">[30 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="98">[29 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="97">[28 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="96">[27 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="95">[24 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="94">[23 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="93">[22 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="92">[21 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="91">[20 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="90">[17 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="89">[16 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="88">[15 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="87">[14 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="86">[13 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="85">[10 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="84">[09 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="83">[08 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="82">[07 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="81">[06 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="80">[03 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="79">[02 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="78">[01 MAY 2024] SNIFF US WORLD MIX</option>
        <option value="77">[30 APR 2024] SNIFF US WORLD MIX</option>
        <option value="76">[29 APR 2024] SNIFF US WORLD MIX</option>
        <option value="75">[26 APR 2024] SNIFF US WORLD MIX</option>
        <option value="74">[25 APR 2024] SNIFF US WORLD MIX</option>
        <option value="73">[24 APR 2024] SNIFF US WORLD MIX</option>
        <option value="72">[23 APR 2024] SNIFF US WORLD MIX</option>
        <option value="71">[22 APR 2024] SNIFF US WORLD MIX</option>
        <option value="70">[18 APR 2024] SNIFF US WORLD MIX</option>
        <option value="69">[17 APR 2024] SNIFF US WORLD MIX</option>
        <option value="68">[16 APR 2024] SNIFF US WORLD MIX</option>
        <option value="67">[15 APR 2024] SNIFF US WORLD MIX</option>
        <option value="66">[12 APR 2024] SNIFF US WORLD MIX</option>
        <option value="65">[11 APR 2024] SNIFF US WORLD MIX</option>
        <option value="64">[10 APR 2024] SNIFF US WORLD MIX</option>
        <option value="63">[09 APR 2024] SNIFF US WORLD MIX</option>
        <option value="62">[08 APR 2024] SNIFF US WORLD MIX</option>
        <option value="61">[05 APR 2024] SNIFF US WORLD MIX</option>
        <option value="60">[04 APR 2024] SNIFF US WORLD MIX</option>
        <option value="59">[03 APR 2024] SNIFF US WORLD MIX</option>
        <option value="58">[02 APR 2024] SNIFF US WORLD MIX</option>
        <option value="57">[01 APR 2024] SNIFF US WORLD MIX</option>
        <option value="56">[29 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="55">[28 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="54">[27 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="53">[26 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="52">[25 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="51">[21 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="50">[20 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="49">[19 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="48">[18 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="47">[14 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="46">[13 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="45">[12 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="44">[11 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="43">[10 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="42">[07 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="41">[06 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="40">[05 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="39">[04 MAR 2024] SNIFF US WORLD MIX</option>
        <option value="38">[01 MAR 2024] SNIFF US WORLD MIX</option>
    </select>
                  </div>
                </div>
                <div className='flex gap-5 items-center buttns'>


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

                  <div className="form-row ml-auto btnss">
                    <button type="submit" className='sumbit'>Search</button>
                    <button type="button" className='clear' onClick={handleClear}>Clear</button>
                  </div></div>
              </form>
            )}

            <div className="data flex text-white items-center gap-3">
              <hr className='w-6/12 border-black' /><label htmlFor="hide" className='w-24'>Hide Filter</label><input type="checkbox" name="hide" checked={isfilter}
                onChange={handlefilterChange} /><hr className='w-6/12  border-black' />
            </div>
            <div className="datasets">
              <div className="flex justify-between">
                <button type="button" className='pre-order bg-black w-52 rounded-md ' onClick={handlePreorder}>Pre-Order</button>
                <button type="button" className='b-selected bg-black w-52 p-2 rounded-md' onClick={handleorder}>Buy Selected</button>
              </div>
              {isloader && (
                <h1>Loading.....</h1>
              )}
              <div className='overflow-auto'>
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
                        <td>{row.exp}</td>
                        <td>{row.firstName}</td>
                        <td>{row.country}</td>
                        <td>{row.state}</td>
                        <td>{row.city}</td>
                        <td>{row.zip}</td>
                        <td>
                          <div className="info-container">
                            <span className="info-icon text-center"><FontAwesomeIcon icon="fa-solid fa-info" className=' text-black bg-green-500 p-1 rounded-full' /></span>
                            <div className="info-content">
                              {row.DOB ? <p>DOB: <span className='text-green-600'>Yes</span></p> : <p>DOB: <span className='text-red-600'>No</span></p>}
                              {row.ssn ? <p>SSN: <span className='text-green-600'>Yes</span></p> : <p>SSN: <span className='text-red-600'>No</span></p>}

                              {row.email ? <p>EMAIL: <span className='text-green-600'>Yes</span></p> : <p>EMAIL: <span className='text-red-600'>No</span></p>}
                              {row.phone ? <p>PHONE: <span className='text-green-600'>Yes</span></p> : <p>PHONE: <span className='text-red-600'>No</span></p>}

                            </div>
                          </div>
                        </td>
                        <td>{row.address ? <span className='text-green-500 text-lg'>&#10004;</span> : '❌'}</td>
                        <td>{row.binInfo}</td>
                        <td>
                          <div className="info-container">
                            <span className="info-icon text-center"><FontAwesomeIcon icon="fa-solid fa-info" className=' text-black bg-green-500 p-1 rounded-full' /></span>
                            <div className="info-content">

                              {row.base ? <p>{row.base}</p> : <p>base: <span className='text-red-600'>No</span></p>}

                            </div>
                          </div>
                        </td>
                        <td>{row.validPercent}</td>
                        <td>{row.refundable ? <span>Yes &#128994;</span> : <span>No &#128308;</span>}</td>
                        <td>{row.price}$</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>         
            </div>
          </div>
        </div>
      </div>  </div>
  );
};

export default CreditCardForm;
