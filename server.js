const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const svgCaptcha = require('svg-captcha');
const mysql = require('mysql');
const session = require('express-session');
const nodemailer = require('nodemailer');

const app = express();
const port = 443;

// Middleware
app.set("trust proxy", 1);
// Middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
}));


app.use(bodyParser.json());
const corsOptions = {
  origin: process.env.NEXT_PUBLIC_BASE_API_URL, // Use the environment variable
  // origin: "http://localhost:3000",
  credentials: true
};

// MySQL connection pooling
const db = mysql.createPool({
  connectionLimit: 10,
  host: 'server759.iseencloud.net',
  user: 'nocash_cc_zone',
  password: 'nocash_cc_zone',
  database: 'nocash_cc_zone',
  port: 3306
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
    pass: 'nvle mnas ajmq dphr' // Your app password
  }
});
const sendMdsCodeEmail = (email, mdsCode) => {
  const mailOptions = {
    from: 'vasulallu09@gmail.com',
    to: "email",
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
    from: 'vasulallu09@gmail.com',
    to: 'eafstriker@gmail.com', // Replace with owner's email
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


// CAPTCHA route
app.get('/captcha', (req, res) => {
  const captchaOptions = {
    ignoreChars: '0o1i',
    background: '#ffffff'
  };
  const captcha = svgCaptcha.create(captchaOptions);
  req.session.captcha = captcha.text.toLowerCase();
  res.type('svg');
  res.status(200).send(captcha.data);
});

// Signup route
app.post('/signup', (req, res) => {
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
app.post('/login', (req, res) => {
  const { username, password, mdsCode, captcha } = req.body;

  if (!req.session.captcha || captcha.toLowerCase() !== req.session.captcha) {
    console.log('Invalid CAPTCHA:', captcha);
    return res.status(400).send({ message: 'Invalid CAPTCHA' });
  }

  const sql = 'SELECT * FROM users WHERE username = ? AND password = ? AND mdsCode = ?';
  db.query(sql, [username, password, mdsCode], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }

    if (results.length > 0) {
      req.session.username = username; // Store username in session
      res.status(200).send({ 
        message: 'Login successful',
        redirectTo: '/home',
        username: results[0].username
      });
    } else {
      res.status(401).send({ message: 'Invalid credentials' });
    }
  });
});




// Data route for fetching graph data
app.get('/data', (req, res) => {
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
app.get('/balance', (req, res) => {


  const username = req.session.username;

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
  const { transactionId } = req.body;
  const username = req.session.username; // Access the username from session

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }

  const mailOptions = {
    from: 'vasulallu09@gmail.com',
    to: 'eafstriker@gmail.com',
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

app.get('/api/graph-data', (req, res) => {
  const query = 'SELECT day, activity FROM user_activity';
  db.query(query, (err, results) => {
      if (err) {
          res.status(500).send(err);
      } else {
          res.json(results);
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

app.post('/api/cards', (req, res) => {
  const { city, state, level, country, brand, bin, bases, bankName, zip , minprice , maxprice} = req.body;

  let query = 'SELECT * FROM credit_card WHERE 1=1';
  const queryParams = [];

  if (bin) query += ` AND bin = '${bin}'`;
  if (state) query += ` AND state = '${state}'`;
  if (city) query += ` AND city = '${city}'`;
  if (zip) query += ` AND zip = '${zip}'`;
  if (bases) query += ` AND base  = '${bases}'`;
  if (bankName) query +=  ` AND bankname = '${bankName}'`;
  if (level) query += ` AND level = '${level}'`;
  if (brand) query +=  ` AND brand = '${brand}'`;
  if (country) query += ` AND country = '${country}'`;
  if (minprice || maxprice) query += ` AND price BETWEEN '${minprice}' AND '${maxprice}'`;


  db.query(query, [
    bin, state, city, zip, bases, bankName, level, brand, country
  ].filter(param => param !== undefined), (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.post('/api/bins', (req, res) => {
  const { level, country, brand, bin, types, minprice, maxprice, buyed } = req.body;

  if (buyed == true) { // Check if buyed is explicitly true
    let query = 'SELECT * FROM buyed WHERE bins = true';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  } else {
    let query = 'SELECT * FROM bins WHERE 1=1';

    if (bin) query += ` AND bin = '${bin}'`;
    if (level) query += ` AND level = '${level}'`;
    if (brand) query += ` AND brand = '${brand}'`;
    if (country) query += ` AND country = '${country}'`;
    if (types) query += ` AND type = '${types}'`;
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
  const username = req.session.username; // Assuming username is obtained from session

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
        console.error('Transaction error:', err);
        connection.release();
        return res.status(500).send({ message: 'Transaction failed' });
      }

      try {
        // Define queries
        const insertBuyedQuery = `
          INSERT INTO buyed (
            id, bin, firstName, country, state, city, zip, info, address, binInfo, base, validPercent,
            refundable, price, seller, bankname, level, brand, time, type, DOB, email, phone
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const updateBalanceQuery = `UPDATE users SET balance = balance - ? WHERE username = ?`;

        // Calculate total price
        let totalPrice = 0;
        const values = items.map(item => {
          totalPrice += item.price; // Sum up total price
          return [
            item.id, item.bin, item.firstName, item.country, item.state, item.city, item.zip, item.info,
            item.address, item.binInfo, item.base, item.validPercent, item.refundable, item.price,
            item.seller, item.bankname, item.level, item.brand, item.time, item.type, item.DOB, item.email, item.phone
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

app.post('/api/purchase_bins', (req, res) => {
  const username = req.session.username; // Assuming username is obtained from session

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
        console.error('Transaction error:', err);
        connection.release();
        return res.status(500).send({ message: 'Transaction failed' });
      }

      try {
        // Define queries
        const insertBuyedQuery = `
          INSERT INTO buyed (
            id, bin, country, price, level, brand, type,bins
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

app.post('/api/purchase_proxies', (req, res) => {
  const username = req.session.username; // Assuming username is obtained from session

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
  const query = 'SELECT id, user_id, purchase_type, price, created_at FROM transaction';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching transactions:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.json(results); // This should be an array
  });
});
app.get('/api/transaction/:id', (req, res) => {
  const transactionId = req.params.id;
  const username = req.session.username; // Assuming username is obtained from session

  if (!username) {
    return res.status(401).send({ message: 'User not authorized' });
  }
  
  // Query to get transaction details
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

    // If the purchase type is 'credit card', get detailed info from buyed table
    if (transaction.purchase_type === 'credit card') {
      const creditCardQuery = `SELECT * FROM buyed WHERE transaction_id = ? AND user = ? AND bins = 0`;
      db.query(creditCardQuery, [transactionId, username], (err, cardResults) => {
        if (err) {
          console.error('Error fetching credit card info:', err);
          return res.status(500).send('Internal Server Error');
        }

        const creditCardInfo = cardResults.length > 0 ? cardResults[0] : null;
        res.json({ transaction, creditCardInfo });
      });
    } else if (transaction.purchase_type === 'bin') {
      const binQuery = `SELECT * FROM buyed WHERE transaction_id = ? AND user = ? AND bins = 1`;
      db.query(binQuery, [transactionId, username], (err, binResults) => {
        if (err) {
          console.error('Error fetching bin info:', err);
          return res.status(500).send('Internal Server Error');
        }

        const binInfo = binResults.length > 0 ? binResults[0] : null;
        res.json({ transaction, additionalInfo: binInfo });
      });
    } else {
      res.json({ transaction });
    }
  });
});
// Route to get user details
app.get('/profile', (req, res) => {
  const username = req.session.username; // Assuming session holds the userId
  const sql = 'SELECT username, email, created_at FROM users WHERE username = ?';
  
  db.query(sql, [username], (err, results) => {
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
app.post('/profile/password', (req, res) => {
  const username = req.session.username;
  const { currentPassword, newPassword } = req.body;

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

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
