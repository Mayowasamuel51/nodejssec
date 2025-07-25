const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require('mysql');

// Simulated DB (replace with MongoDB/MySQL)
const users = [];

const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    port:3306,
    password: process.env.password,
    database: process.env.database
});



exports.getProfile = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email FROM products WHERE id = ?", [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      message: "Welcome back",
      user: rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};



exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists in MySQL
    const checkQuery = `SELECT * FROM products WHERE email = ?`;
    db.query(checkQuery, [email], async (err, results) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length > 0) {
        return res.status(409).json({ error: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Insert user
      const insertQuery = `INSERT INTO products (name, email, password) VALUES (?, ?, ?)`;
      db.query(insertQuery, [name, email, hashedPassword], (err, results) => {
        if (err) {
          console.error("Insert error:", err);
          return res.status(500).json({ error: "Failed to register user" });
        }

        return res.status(201).json({
          message: "User registered successfully",
          userId: results.insertId,
        });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user in database
    const query = `SELECT * FROM products WHERE email = ?`;
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = results[0];

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return res.json({ message: "Login successful", token });
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
