import React from 'react'
import VerticalNav from './verticalnav';
import HorizontalNav from './horizontal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome , faTelegram} from '@fortawesome/free-brands-svg-icons'
library.add(fas,faTwitter, faFontAwesome)

import Data from './data';
import "./page.css"
const home = () => {
  return (

 <div className="app">
      <VerticalNav />
      <div className="main-content">
        <HorizontalNav/>
        <Data/>
        {/* Your main content goes here */}
      </div>
      </div>
  )
}

export default home
