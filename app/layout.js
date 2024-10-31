import './globals.css'; // Import global styles
import { ThemeProvider } from './theme/ThemeContext'; // Import ThemeProvider
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ThemeWrapper from './theme/ThemeWrapper'; // Import ThemeWrapper

import { NavProvider } from './home/NavContext';

export const metadata = {
  title: "NoCash Store",
  description: "Buy Ccs ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
  <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <NavProvider>
      <body>
     
        <ThemeProvider>
          <ThemeWrapper>
            {children}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </ThemeWrapper>
        </ThemeProvider>
       
      </body>
      </NavProvider>
    </html>
  );
}
