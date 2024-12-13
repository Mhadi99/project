const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'mhadi',
  password: 'miT22427605&&',
  database: 'my_database'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

app.post('/register', (req, res) => {
    const { username, password, first_name, last_name, postal_address, email, phone, description, profile_photo } = req.body;
  
    // Check for existing records
    const checkSql = 'SELECT * FROM users WHERE username = ? OR email = ? OR phone = ?';
    db.query(checkSql, [username, email, phone], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
  
      if (results.length > 0) {
        // Determine which field is not unique
        let duplicateFields = [];
        results.forEach(record => {
          if (record.username === username) duplicateFields.push('username');
          if (record.email === email) duplicateFields.push('email');
          if (record.phone === phone) duplicateFields.push('phone');
        });
  
        return res.status(400).json({ error: `Duplicate fields: ${duplicateFields.join(', ')}` });
      }
  
      // If no duplicates, proceed with insertion
      const insertSql = 'INSERT INTO users (username, password, first_name, last_name, postal_address, email, phone, description, profile_photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(insertSql, [username, password, first_name, last_name, postal_address, email, phone, description, profile_photo], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error registering user');
        }
        res.send('User registered successfully');
      });
    });
  });
  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
