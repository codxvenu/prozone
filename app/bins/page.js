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

import { useNav } from '../home/NavContext';

function bins() {
  const { nav } = useNav();
  const [isloader, setIsloader] = useState(false);
    const [isfilter, setIsfilter] = useState(false);
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [tdata, settData] = useState([]);
    const [tableData, setTableData] = useState([]); // State to hold the table data
  
    const handlefilterChange = (e) => {
      setIsfilter(e.target.checked);
    };
      // Function to mask BIN number
      const maskBin = (bin) => {
        // Convert bin to a string if it is a number
        const binStr = String(bin);
      
        // Check if the string is empty or not
        if (binStr.length === 0) return '';
      
        // Mask all characters except the first one
        return `${binStr[0]}${'*'.repeat(binStr.length - 1)}`;
      };
      
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
     
      types: '',

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
        const response = await fetch('/api/bins', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            buyed: formData.buyed === 'true' || formData.buyed === true, // Ensure buyed is boolean
            level: formData.level,
            country: formData.country,
          
            types: formData.types,
            username : localStorage.getItem("username")
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
      
  
  
  
    const handleClear = () => {
      setFormData({
        buyed : '',
        level: '',
        country: '',
       
      
        type: '',
       
       
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
    setTableData([]);
    settData([]);
    setIsloader(true)
    // Extract the selected rows data based on the IDs in selectedRows
    const selectedData = Array.from(selectedRows).map(id => tableData.find(row => row.id === id));
    const username = localStorage.getItem('username');
    // Prepare the request payload
    const requestBody = JSON.stringify({ items: selectedData,username });
  
    console.log('Request payload:', requestBody); // Debugging: Log the request payload
    try {
      const response = await fetch(`/api/purchase_bins`, {
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
    { !isfilter && (
       <form onSubmit={handleSubmit}>
        <div className='gap-6 break'>

       
       
       
      
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
          <label>Country</label>
          <select name="country" value={formData.country} onChange={handleInputChange}>
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
          <label>Types</label>
          <select name="types" value={formData.types} onChange={handleInputChange}>
          <option value="">All Types</option>
                      <option value="debit">Debit</option>
                      <option value="credit">Credit</option>
                      <option value="standard">Standard</option>
                      <option value="ltd">LTD</option>
                      <option value="charged">Charged</option>



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
        <div className='flex gap-5 items-center buttns'>
  
        <div className="form-row ml-auto btnss">
         
          <button type="sumbit" className='sumbit'>Search</button>  
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
      <div className='overflow-auto'>

     
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
              <td>{maskBin(row.bin)}</td>
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
    </div>    </div>
    </div>
     </div>
     </div>
    </div>  
);
};
export default bins;
