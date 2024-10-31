const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const svgCaptcha = require('svg-captcha');
const mysql = require('mysql');
const session = require('express-session');
const nodemailer = require('nodemailer');

const app = express();
const port = 5000;

app.set("trust proxy", 1);
// Middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
  }));
  

app.use(bodyParser.json());
const corsOptions = {
    origin: process.env.FRONTEND_URL, // Use the environment variable
    credentials: true
  };
  
  app.use(cors(corsOptions));

  // Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).send({ message: 'Internal Server Error' });
  });
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
  });
  

// MySQL connection pooling
const db = mysql.createPool({
    connectionLimit: 10,
    host: 'server759.iseencloud.net',
    user: 'nocash_cc_hub',
    password: 'nocash_cc_hub',
    database: 'nocash_cc_hub',
    port: 3306,
    connectTimeout: 30000 // Increase timeout to 30 seconds
  });
  

const handleDisconnect = () => {
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      setTimeout(handleDisconnect, 2000); // Attempt to reconnect after 2 seconds
    } else {
      console.log('Connected to MySQL database...');
      connection.release();
    }
  });

  db.on('error', (err) => {
    console.error('MySQL error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect(); // Reconnect on connection loss
    } else {
      throw err;
    }
  });
};

handleDisconnect();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'viparraich@gmail.com',
    pass: 'zybc wznj qmfe jwyv' // Your app password
  }
});

const sendMdsCodeEmail = (email, mdsCode) => {
  const mailOptions = {
    from: 'viparraich@gmail.com',
    to: email,
    subject: 'Your MDS Code',
    text: `Thank you for registering. Your MDS code is: ${mdsCode} kindly save it for future login`
  };

  return transporter.sendMail(mailOptions);
};

// owners email
// Add this route to server.js

app.post('/api/preorder', (req, res) => {
  const {
    city,
    state,
    level,
    country,
    brand,
    bin,
    bases,
    bankName,
    zip,
    minValue,
    maxValue
  } = req.body;

  const mailOptions = {
    from: 'viparraich@gmail.com',
    to: 'viparraich@gmail.com', // Replace with owner's email
    subject: 'New Preorder Request',
    text: `Preorder request from ${userid}:
    City: ${city}
    State: ${state}
    Level: ${level}
    Country: ${country}
    Brand: ${brand}
    BIN: ${bin}
    Bases: ${bases}
    Bank Name: ${bankName}
    Zip: ${zip}
    Min Price: ${minValue}
    Max Price: ${maxValue}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send({ message: 'Failed to send preorder request' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send({ message: 'Preorder request sent successfully' });
    }
  });
});


app.get('/api/captcha', (req, res) => {
    const captchaOptions = {
      ignoreChars: '0o1i',
      background: '#ffffff'
    };
    const captcha = svgCaptcha.create(captchaOptions);
    req.session.captcha = captcha.text.toLowerCase();
    console.log('CAPTCHA text stored in session:', req.session.captcha , req.session); // Debug line
    res.type('svg');
    res.status(200).send(captcha.data);
  });
// Signup route
app.post('/api/signup', (req, res) => {
  const { username, password, email } = req.body;

  // Check if the username or email already exists
  const checkSql = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(checkSql, [username, email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }

    if (results.length > 0) {
      return res.status(409).send({ message: 'Username or email already in use' });
    }

    // If not exists, proceed with signup
    const mdsCode = Math.random().toString(36).substr(2, 9).toUpperCase();
    const insertSql = 'INSERT INTO users (username, password, email, mdsCode) VALUES (?, ?, ?, ?)';
    db.query(insertSql, [username, password, email, mdsCode], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send(err);
      }

      sendMdsCodeEmail(email, mdsCode)
        .then(() => {
          res.status(200).send({ message: 'Signup successful. Check your email for your MDS code.', mdsCode });
          userid = username;
        })
        .catch((error) => {
          console.error('Error sending email:', error);
          res.status(500).send({ message: 'Signup successful but failed to send email. Please contact support.' });
        });
    });
  });
});

// Login route
app.post('/api/login', (req, res) => {
    const { username, password, mdsCode, captcha } = req.body;
    console.log('Received CAPTCHA:', captcha); // Debug line
    console.log('Stored CAPTCHA:', req.session.captcha ); // Debug line
  
    if (!req.session.captcha || captcha.toLowerCase() !== req.session.captcha) {
      console.log('Invalid CAPTCHA:', captcha, req.session.captcha);
      return res.status(400).send({ message: 'Invalid CAPTCHA' });
    }
  
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ? AND mdsCode = ?';
    db.query(sql, [username, password, mdsCode], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send(err);
      }
  
      if (results.length > 0) {
        req.session.username = username;
        console.log(results);
        
        res.status(200).send({ 
          message: 'Login successful',
          redirectTo: '/home',
          username: results[0].username,
          role : results[0].role
        });
      } else {
        res.status(401).send({ message: 'Invalid credentials' });
      }
    });
  });
  
  
// Data route for fetching graph data
app.get('/api/data', (req, res) => {
  const sql = 'SELECT cvv, ssn, checker, floods FROM transaction';
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }

    const graphData = results.map(row => ({
      cvv: row.cvv,
      ssn: row.ssn,
      checker: row.checker,
      floods: row.floods
    }));

    res.status(200).send(graphData);
  });
});
app.get('/api/balance', (req, res) => {
    const { username } = req.query;
  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
    
  }

  db.query('SELECT balance FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send({ message: 'Failed to fetch balance' });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send({ balance: results[0].balance });
  });
});

app.post('/api/submit-transaction', (req, res) => {
  const { transactionId , username } = req.body; // Access the username from session

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }
  const mailOptions = {
    from: 'viparraich@gmail.com',
    to: 'viparraich@gmail.com',
    subject: 'Transaction Details',
    text: `Transaction ID: ${transactionId}\nUsername: ${username}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send({ message: 'Failed to send email' });
    }
    res.status(200).send({ message: 'Email sent successfully' });
  });
});
app.post('/api/submit-seller', (req, res) => {
  const { transactionId , username } = req.body; // Access the username from session

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }
  const mailOptions = {
    from: 'viparraich@gmail.com',
    to: 'viparraich@gmail.com',
    subject: 'Sellers Details',
   
   
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send({ message: 'Failed to send email' });
    }
    res.status(200).send({ message: 'Email sent successfully' });
  });
});
app.get('/api/graph-data', (req, res) => {
  const query = 'SELECT day, activity FROM user_activity';
  db.query(query, (err, results) => {
      if (err) {
          res.status(500).send(err);
      } else {
          res.json(results);
          console.log("home session",req.session);
          
      }
  });
});

app.get('/api/cities', (req, res) => {
  const query = 'SELECT DISTINCT city FROM credit_card';
  db.query(query, (err, results) => {
      if (err) {
          res.status(500).send(err);
      } else {
          res.json(results);
          console.log("credit session",req.session);
      }
  });
});
app.get('/api/banks', (req, res) => {
  const query = 'SELECT DISTINCT bankname FROM credit_card';
  db.query(query, (err, results) => {
      if (err) {
          res.status(500).send(err);
      } else {
          res.json(results);
      }
  });
});
app.get('/api/country', (req, res) => {
  const query = 'SELECT DISTINCT country FROM credit_card';
  db.query(query, (err, results) => {
      if (err) {
          res.status(500).send(err);
      } else {
          res.json(results);
      }
  });
});
app.get('/api/level', (req, res) => {
  const query = 'SELECT DISTINCT level FROM credit_card';
  db.query(query, (err, results) => {
      if (err) {
          res.status(500).send(err);
      } else {
          res.json(results);
      }
  });
});
app.get('/api/brand', (req, res) => {
  const query = 'SELECT DISTINCT brand FROM credit_card';
  db.query(query, (err, results) => {
      if (err) {
          res.status(500).send(err);
      } else {
          res.json(results);
      }
  });
});
app.get('/api/state', (req, res) => {
  const query = 'SELECT DISTINCT state FROM credit_card';
  db.query(query, (err, results) => {
      if (err) {
          res.status(500).send(err);
      } else {
          res.json(results);
      }
  });
});
app.get('/api/base', (req, res) => {
  const query = 'SELECT DISTINCT base FROM credit_card';
  db.query(query, (err, results) => {
      if (err) {
          res.status(500).send(err);
      } else {
          res.json(results);
      }
  });
});
app.get('/api/getusers', (req, res) => {
  const query = 'SELECT DISTINCT username FROM users';
  db.query(query, (err, results) => {
      if (err) {
          res.status(500).send(err);
      } else {
          res.json(results);
          console.log(results);
          
      }
  });
});

app.post('/api/cards', (req, res) => {
  const { city, state, level, country, brand, bin, bases, bankName, zip, minprice, maxprice , types} = req.body;

  // Start building the query
  let query = 'SELECT * FROM credit_card WHERE user IS NULL';
  const queryParams = [];

  if (bin) {
    query += ' AND bin = ?';
    queryParams.push(bin);
  }
  if (state) {
    query += ' AND state = ?';
    queryParams.push(state);
  }
  if (types) {
    query += ' AND type = ?';
    queryParams.push(types);
  }
  if (city) {
    query += ' AND city = ?';
    queryParams.push(city);
  }
  if (zip) {
    query += ' AND zip = ?';
    queryParams.push(zip);
  }
  if (bases) {
    query += ' AND base = ?';
    queryParams.push(bases);
  }
  if (bankName) {
    query += ' AND bankname = ?';
    queryParams.push(bankName);
  }
  if (level) {
    query += ' AND level = ?';
    queryParams.push(level);
  }
  if (brand) {
    query += ' AND brand = ?';
    queryParams.push(brand);
  }
  if (country) {
    query += ' AND country = ?';
    queryParams.push(country);
  }
  if (minprice || maxprice) {
    query += ' AND price BETWEEN ? AND ?';
    queryParams.push(minprice || 0); // Default to 0 if minprice is not provided
    queryParams.push(maxprice || 100); // Default to Infinity if maxprice is not provided
  }

  // Log the constructed query and parameters
  console.log('Constructed Query:', query);
  console.log('Query Parameters:', queryParams);

  // Execute the query
  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('Query Results:', results);
    
    res.json(results);
  });
});


app.post('/api/bins', (req, res) => {
  const { level, country, types, buyed , username } = req.body;

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  if (buyed == true) { // Check if buyed is explicitly true
    let query = 'SELECT * FROM buyed WHERE bins = true AND user = ?';
    db.query(query,[username], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  } else {
    let query = 'SELECT * FROM bins WHERE 1=1 AND user IS NULL ';

    
    if (level) query += ` AND level = '${level}'`;
  
    if (country) query += ` AND country = '${country}'`;
    if (types) query += ` AND type = '${types}'`;
   

    // console.log('Constructed Query:', query); // Log the constructed query
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      // console.log('Results:', results); // Log the results
      res.json(results);
    });
  }
});


app.post('/api/Proxies', (req, res) => {
  const { continent, state, city, zip, minprice, maxprice } = req.body;

    let query = 'SELECT * FROM proxies WHERE 1=1';

    if (continent) query += ` AND continent = '${continent}'`;
    if (state) query += ` AND state = '${state}'`;
    if (city) query += ` AND city = '${city}'`;
    if (zip) query += ` AND zip = '${zip}'`;
    if (minprice !== undefined && maxprice !== undefined) {
      query += ` AND price BETWEEN '${minprice}' AND '${maxprice}'`;
    }

    // console.log('Constructed Query:', query); // Log the constructed query
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      // console.log('Results:', results); // Log the results
      res.json(results);
    });
  
});


app.post('/api/purchase', (req, res) => {
  const { username } = req.body;

  if (!username) {
      return res.status(401).send({ message: 'User not authorized' });
  }

  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
      return res.status(400).send({ message: 'Invalid request data' });
  }

  db.getConnection((err, connection) => {
      if (err) {
          console.error('Database connection error:', err);
          return res.status(500).send({ message: 'Database connection failed' });
      }

      connection.beginTransaction(async (err) => {
          if (err) {
              console.error('Transaction initiation error:', err);
              connection.release();
              return res.status(500).send({ message: 'Transaction initiation failed' });
          }

          try {
              // Define queries
              const insertBuyedQuery = `
                  INSERT INTO buyed (
                    bin, firstName, country, state, city, zip, info, address, binInfo, base, validPercent,
                    refundable, price, seller, bankname, level, brand, time, type, DOB, email, phone, ccnum, exp, cvv, user, bins
                  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);
              `;

              const updateBalanceQuery = `UPDATE users SET balance = balance - ? WHERE username = ?`;
              const updateCreditCardQuery = `UPDATE credit_card SET user = ? WHERE ccnum = ?`;
              const updateTransactionCardQuery = `INSERT INTO transaction (user_id, purchase_type, price) VALUES (?, ?, ?)`;
              const getUserRoleQuery = `SELECT role FROM users WHERE username = ?`;

              // Calculate total price
              let totalPrice = 0;
              let cc_num = 0;
              let type = 'credit card';
              const values = items.map(item => {
                  totalPrice += item.price; // Sum up total price
                  cc_num = item.ccnum;
                  return [
                      item.bin, item.firstName, item.country, item.state, item.city, item.zip, item.info,
                      item.address, item.binInfo, item.base, item.validPercent, item.refundable, item.price,
                      item.seller, item.bankname, item.level, item.brand, item.time, item.type, item.DOB, item.email,
                      item.phone, item.ccnum, item.exp, item.cvv, username
                  ];
              });

              // Check if any item has already been bought
              const checkCardQuery = `SELECT user FROM credit_card WHERE ccnum = ?`;
              const cardUsers = await Promise.all(values.map(valueSet =>
                  new Promise((resolve, reject) => {
                      connection.query(checkCardQuery, [valueSet[23]], (error, results) => {
                          if (error) {
                              reject(error);
                          } else {
                              resolve(results);
                          }
                      });
                  })
              ));

              for (const cardUser of cardUsers) {
                  if (cardUser[0] && cardUser[0].user !== null) {
                      return res.status(400).send({ message: 'One or more cards have already been bought' });
                  }
              }

              // Get user role
              const [userRole] = await new Promise((resolve, reject) => {
                  connection.query(getUserRoleQuery, [username], (error, results) => {
                      if (error) reject(error);
                      resolve(results);
                  });
              });

              // Apply discount if user role is 'reseller'
              if (userRole.role === 'reseller') {
                  totalPrice *= 0.5; // Apply 50% discount
              }

              // Insert purchase records
              await Promise.all(values.map(valueSet =>
                  new Promise((resolve, reject) => {
                      connection.query(insertBuyedQuery, valueSet, (error) => {
                          if (error) {
                              reject(error);
                          } else {
                              resolve();
                          }
                      });
                  })
              ));

              // Check balance and update if sufficient
              const [user] = await new Promise((resolve, reject) => {
                  connection.query('SELECT balance FROM users WHERE username = ?', [username], (error, results) => {
                      if (error) reject(error);
                      resolve(results);
                  });
              });

              if (user.balance < totalPrice) {
                  throw new Error('Insufficient balance');
              }

              // Update user balance
              await new Promise((resolve, reject) => {
                  connection.query(updateBalanceQuery, [totalPrice, username], (error) => {
                      if (error) reject(error);
                      resolve();
                  });
              });

              // Update credit card
              await new Promise((resolve, reject) => {
                  connection.query(updateCreditCardQuery, [username, cc_num], (error) => {
                      if (error) reject(error);
                      resolve();
                  });
              });

              // Record the transaction
              await new Promise((resolve, reject) => {
                  connection.query(updateTransactionCardQuery, [username, type, totalPrice], (error) => {
                      if (error) reject(error);
                      resolve();
                  });
              });

              // Commit transaction
              connection.commit((err) => {
                  if (err) {
                      console.error('Transaction commit error:', err);
                      return connection.rollback(() => {
                          res.status(500).send({ message: 'Transaction commit failed' });
                      });
                  }

                  res.send({ message: 'Transaction successful' });
              });
          } catch (error) {
              console.error('Transaction error:', error);
              connection.rollback(() => {
                  res.status(500).send({ message: error.message });
              });
          } finally {
              connection.release();
          }
      });
  });
});

app.post('/api/purchase_bins', (req, res) => {
  const { items, username } = req.body;

  if (!username) {
      return res.status(401).send({ message: 'User not authorized' });
  }

  if (!items || !Array.isArray(items)) {
      return res.status(400).send({ message: 'Invalid request data' });
  }

  db.getConnection((err, connection) => {
      if (err) {
          console.error('Database connection error:', err);
          return res.status(500).send({ message: 'Database connection failed' });
      }

      connection.beginTransaction(async (err) => {
          if (err) {
              console.error('Transaction error:', err);
              connection.release();
              return res.status(500).send({ message: 'Transaction failed' });
          }

          try {
              // Define queries
              const insertBuyedQuery = `
                  INSERT INTO buyed (
                    bin, country, price, level, brand, type, bins, user
                  ) VALUES (?, ?, ?, ?, ?, ?, 1, ?);
              `;

              const updateBalanceQuery = `UPDATE users SET balance = balance - ? WHERE username = ?`;
              const updateCreditCardQuery = `UPDATE bins SET user = ? WHERE bin = ?`;
              const updateTransactionCardQuery = `INSERT INTO transaction (user_id, purchase_type, price) VALUES (?, ?, ?)`;

              // Calculate total price
              let totalPrice = 0;
              const type = "bin";
              const values = items.map(item => {
                  totalPrice += item.price; // Sum up total price
                  return [
                      item.bin, item.country, item.price, item.level, item.brand, item.type, username
                  ];
              });

              // Check if any bin has already been bought
              const checkBinQuery = `SELECT user FROM bins WHERE bin = ?`;
              const binUsers = await Promise.all(values.map(valueSet =>
                  new Promise((resolve, reject) => {
                      connection.query(checkBinQuery, [valueSet[0]], (error, results) => {
                          if (error) {
                              reject(error);
                          } else {
                              resolve(results);
                          }
                      });
                  })
              ));

              for (const binUser of binUsers) {
                  if (binUser[0] && binUser[0].user !== null) {
                      return res.status(400).send({ message: 'One or more bins have already been bought' });
                  }
              }
              const [userRole] = await new Promise((resolve, reject) => {
                connection.query(getUserRoleQuery, [username], (error, results) => {
                    if (error) reject(error);
                    resolve(results);
                });
            });

            // Apply discount if user role is 'reseller'
            if (userRole.role === 'reseller') {
                totalPrice *= 0.5; // Apply 50% discount
            }
              // Insert purchase records
              await Promise.all(values.map(valueSet =>
                  new Promise((resolve, reject) => {
                      connection.query(insertBuyedQuery, valueSet, (error) => {
                          if (error) {
                              reject(error);
                          } else {
                              resolve();
                          }
                      });
                  })
              ));

              // Check balance and update if sufficient
              const [user] = await new Promise((resolve, reject) => {
                  connection.query('SELECT balance FROM users WHERE username = ?', [username], (error, results) => {
                      if (error) reject(error);
                      resolve(results);
                  });
              });

              if (user.balance < totalPrice) {
                  throw new Error('Insufficient balance');
              }

              // Update user balance
              await new Promise((resolve, reject) => {
                  connection.query(updateBalanceQuery, [totalPrice, username], (error) => {
                      if (error) reject(error);
                      resolve();
                  });
              });

              // Update bins
              await Promise.all(items.map(item =>
                  new Promise((resolve, reject) => {
                      connection.query(updateCreditCardQuery, [username, item.bin], (error) => {
                          if (error) reject(error);
                          resolve();
                      });
                  })
              ));

              // Record the transaction
              await new Promise((resolve, reject) => {
                  connection.query(updateTransactionCardQuery, [username, type, totalPrice], (error) => {
                      if (error) reject(error);
                      resolve();
                  });
              });

              // Commit transaction
              connection.commit((err) => {
                  if (err) {
                      console.error('Transaction commit error:', err);
                      return connection.rollback(() => {
                          res.status(500).send({ message: 'Transaction failed' });
                      });
                  }

                  res.send({ message: 'Transaction successful' });
              });
          } catch (error) {
              console.error('Transaction error:', error);
              connection.rollback(() => {
                  res.status(500).send({ message: error.message });
              });
          } finally {
              connection.release();
          }
      });
  });
});


app.post('/api/purchase_proxies', (req, res) => {
    const { items , username} = req.body;


  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  
  if (!items || !Array.isArray(items)) {
    return res.status(400).send({ message: 'Invalid request data' });
  }

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).send({ message: 'Database connection failed' });
    }

    connection.beginTransaction(async (err) => {
      if (err) {
        console.error('Transaction error:', err);
        connection.release();
        return res.status(500).send({ message: 'Transaction failed' });
      }

      try {
        // Define queries
        const insertBuyedQuery = `
          INSERT INTO buyed (
            id, , country, price, level, brand, type,bins
          ) VALUES (?,?,?,?,?,?,?,1);
        `;

        const updateBalanceQuery = `UPDATE users SET balance = balance - ? WHERE username = ?`;

        // Calculate total price
        let totalPrice = 0;
        const values = items.map(item => {
          totalPrice += item.price; // Sum up total price
          return [
            item.id, item.bin, item.country, item.price, item.level, item.brand, item.type
          ];
        });

        // Insert purchase records
        await Promise.all(values.map(valueSet =>
          new Promise((resolve, reject) => {
            connection.query(insertBuyedQuery, valueSet, (error) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            });
          })
        ));

        // Check balance and update if sufficient
        const [user] = await new Promise((resolve, reject) => {
          connection.query('SELECT balance FROM users WHERE username = ?', [username], (error, results) => {
            if (error) reject(error);
            resolve(results);
          });
        });

        if (user.balance < totalPrice) {
          throw new Error('Insufficient balance');
        }

        // Update user balance
        await new Promise((resolve, reject) => {
          connection.query(updateBalanceQuery, [totalPrice, username], (error) => {
            if (error) reject(error);
            resolve();
          });
        });

        // Commit transaction
        connection.commit((err) => {
          if (err) {
            console.error('Transaction commit error:', err);
            return connection.rollback(() => {
              res.status(500).send({ message: 'Transaction failed' });
            });
          }

          res.send({ message: 'Transaction successful' });
        });
      } catch (error) {
        console.error('Transaction error:', error);
        connection.rollback(() => {
          res.status(500).send({ message: error.message });
        });
      } finally {
        connection.release();
      }
    });
  });
});
app.get('/api/transactions', (req, res) => {
  const username = req.query.username; 
  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }
  
  const query = 'SELECT * FROM transaction WHERE user_id = ?';
  
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error fetching transactions:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.json(results); // This should be an array
  });
});

app.get('/api/transaction/:id', (req, res) => {
  const username = req.query.username;
  const transactionId = req.params.id;
  
  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }
  
  const transactionQuery = 'SELECT * FROM transaction WHERE id = ?';
  db.query(transactionQuery, [transactionId], (err, results) => {
    if (err) {
      console.error('Error fetching transaction:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length === 0) {
      return res.status(404).send('Transaction not found');
    }

    const transaction = results[0];

    if (transaction.purchase_type === 'credit card') {
      const creditCardQuery = `SELECT * FROM buyed WHERE transaction_id = ? AND user = ? AND bins = 0`;
      db.query(creditCardQuery, [transactionId, username], (err, cardResults) => {
        if (err) {
          console.error('Error fetching credit card info:', err);
          return res.status(500).send('Internal Server Error');
        }

        const creditCardInfo = cardResults.length > 0 ? cardResults[0] : null;
        res.json({ transaction, creditCardInfo, bin: 0 });
      });
    } else{
      const binQuery = `SELECT * FROM buyed WHERE transaction_id = ? AND user = ? AND bins = 1`;
      db.query(binQuery, [transactionId, username], (err, binResults) => {
        if (err) {
          console.error('Error fetching bin info:', err);
          return res.status(500).send('Internal Server Error');
        }

        const binInfo = binResults.length > 0 ? binResults[0] : null;
        res.json({ transaction, additionalInfo: binInfo, bin: 1 });
      });
    }
  });
});

// Route to get user details
app.get('/api/profile', (req, res) => {
  const user = req.query.username;
  const sql = 'SELECT username, email, created_at FROM users WHERE username = ?';
  
  db.query(sql, [user], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }

    if (results.length > 0) {
      res.status(200).send(results[0]);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  });
});

// Route to update the password
app.post('/api/profile/password', (req, res) => {

  const { currentPassword, newPassword , username} = req.body;

  // Check current password
  const checkSql = 'SELECT password FROM users WHERE username = ?';
  db.query(checkSql, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }

    if (results.length === 0 || results[0].password !== currentPassword) {
      return res.status(401).send({ message: 'Current password is incorrect' });
    }

    // Update to new password
    const updateSql = 'UPDATE users SET password = ? WHERE username = ?';
    db.query(updateSql, [newPassword, username], (err, updateResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send(err);
      }

      res.status(200).send({ message: 'Password updated successfully' });
    });
  });
});
app.get('/api/checker', (req, res) => {
  const username = req.query.username;
  const sql = 'SELECT * FROM buyed WHERE user = ?';
  
  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }

    if (results.length > 0) {
      res.status(200).send(results[0]);
      // console.log(results);
      
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  });
});
app.post('/api/send-email', (req, res) => {
  const emailData = req.body;

  const mailOptions = {
    from: 'viparraich@gmail.com',
    to: 'viparraich@gmail.com',  // Recipient's email address
    subject: 'Credit Details', // Subject of the email
    text: `Here are the details of the Credit Card For Checking For User ${emailData.username}:
    
    BIN: ${emailData.bin}
    Exp Date: ${emailData.time}
    First Name: ${emailData.firstName}
    Country: ${emailData.country}
    State: ${emailData.state}
    City: ${emailData.city}
    ZIP: ${emailData.zip}
    Info: ${emailData.info}
    Address: ${emailData.address}
    BIN Info: ${emailData.binInfo}
    Base: ${emailData.base}
    Valid Percent: ${emailData.validPercent}
    Refundable: ${emailData.refundable ? 'Yes' : 'No'}
    Price: ${emailData.price}$`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send({ message: 'Failed to send email' });
    }
    console.log('Email sent: ' + info.response);
    res.status(200).send({ message: 'Email sent successfully!' });
  });
});

app.post("/api/add-card", (req, res) => {
  const {
    ccnum,
    cvv,
    exp,
    bin,
    country,
    state,
    city,
    zip,
    bankName,
    level,
    brand,
    types,
    bases,
    price,
    address,
    binfo,email,phone,dob,name
  } = req.body;

  const sql = `
    INSERT INTO credit_card (
      ccnum, cvv, exp, bin, country, state, city, zip,
      bankname, level, brand, type, base, price,address,binInfo, email, phone, DOB,firstName, seller ,info,validPercent	,refundable,user
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?, ?,?, ?,?, ?,'VCLUB','sample',95,1,,NULL)
  `;
  db.query(sql, [
    ccnum, cvv, exp, bin, country, state, city, zip,
    bankName, level, brand, types, bases, price,address,binfo,email,phone,dob,name
  ], (err, result) => {
    if (err) {
      console.error("Error inserting card data into the database:", err);
      return res.status(500).json({ message: "Error inserting card data into the database" });
    }
    res.status(200).json({ message: "Card data added successfully" });
    console.log(result);
    
  });
});

// Route to add BIN data
app.post("/api/add-bin", (req, res) => {
  const {
    bin,
    country,
    types,
    level,
    price
  } = req.body;

  const sql = `
    INSERT INTO bins (
      bin, country, level, type,brand, price,user
    ) VALUES (?, ?, ?, ?, 'CC',?,NULL)
  `;
  db.query(sql, [
    bin, country, level, types, price
  ], (err, result) => {
    if (err) {
      console.error("Error inserting BIN data into the database:", err);
      return res.status(500).json({ message: "Error inserting BIN data into the database" });
    }
    res.status(200).json({ message: "BIN data added successfully" });
  });
});
app.post('/api/add-seller', (req, res) => {
  let { user, role, price } = req.body;


  // Validate input
  if (!user || role === undefined || price  === undefined) {
    return res.status(400).send({ message: 'Username, new role, and a valid balance are required' });
  }
  if (isNaN(price)) {
    return res.status(400).send({ message: 'Invalid balance value' });
  }
  const updateRoleQuery = `
    UPDATE users
    SET role = ?
    WHERE username = ?;
  `;

  const updateBalanceQuery = `
    UPDATE users
    SET balance = balance - ?
    WHERE username = ?;
  `;

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).send({ message: 'Database connection failed' });
    }

    connection.beginTransaction(async (err) => {
      if (err) {
        console.error('Transaction initiation error:', err);
        connection.release();
        return res.status(500).send({ message: 'Transaction initiation failed' });
      }

      try {
        // Log the queries and parameters
        console.log('Executing updateRoleQuery:', updateRoleQuery);
        console.log('With parameters:', [role, user]);

        await new Promise((resolve, reject) => {
          connection.query(updateRoleQuery, [role, user], (error) => {
            if (error) {
              console.error('Error updating role:', error.message);
              reject(error);
            } else {
              resolve();
            }
          });
        });
        const [users] = await new Promise((resolve, reject) => {
          connection.query('SELECT balance FROM users WHERE username = ?', [user], (error, results) => {
              if (error) reject(error);
              resolve(results);
          });
      });

      if (users.balance < price) {
          throw new Error('Insufficient balance');
      }
        await new Promise((resolve, reject) => {
          connection.query(updateBalanceQuery, [price, user], (error) => {
            if (error) {
              console.error('Error updating balance:', error.message);
              reject(error);
            } else {
              resolve();
            }
          });
        });

        connection.commit((err) => {
          if (err) {
            console.error('Commit error:', err);
            connection.rollback(() => {
              res.status(500).send({ message: 'Transaction commit failed' });
            });
          } else {
            res.send({ message: 'User role and balance updated successfully' });
          }
        });
      } catch (error) {
        console.error('Transaction error:', error.message);
        connection.rollback(() => {
          res.status(500).send({ message: error.message });
        });
      } finally {
        connection.release();
      }
    });
  });
});


// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });
module.exports = app;
