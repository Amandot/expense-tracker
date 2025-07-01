require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔹 MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ Connected to MySQL Database");
});

// 🔹 User Registration API (Signup)
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = "INSERT INTO users (email, password_hash) VALUES (?, ?)";
  db.query(sql, [email, hashedPassword], (err, result) => {
    if (err) return res.status(500).send("⚠️ User already exists or database error.");
    res.send("✅ User registered successfully!");
  });
});

// 🔹 User Login API
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).send("⚠️ Database error.");
    if (results.length === 0) return res.status(400).send("⚠️ User not found!");

    const user = results[0];
    if (!bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).send("⚠️ Invalid credentials!");
    }

    res.send({ message: "✅ Login successful!", userId: user.id, email: user.email });
  });
});

// 🔹 Start the Server
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
