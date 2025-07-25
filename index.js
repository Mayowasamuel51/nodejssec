require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mysql = require('mysql');
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());  //Helmet sets various HTTP security headers that protect your app from known web vulnerabilities. Helmet = HTTP firewall for headers
app.use(cors({ origin: process.env.CLIENT_URL 
    ||
     "*" ,   //never do this 
     credentials:true}));
app.use(morgan("dev"));  //Logs incoming HTTP requests to the terminal.
// app.use(express.json());


const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    port:3306,
    password: process.env.password,
    database: process.env.database
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected...");
});
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, try again later.",
});
app.use(limiter);  //Helps protect your API from DDoS attacks, brute force login attempts, and API abuse.

// Routes
const authRoutes = require("./routes/auth.js");
app.use("/api/v1/auth", authRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production'
    ? "Something went wrong"
    : err.message;
  res.status(status).json({ error: message });
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
