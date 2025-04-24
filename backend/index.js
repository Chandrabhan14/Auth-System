

const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "66.179.254.59",
  user: "ezpz",
  password: "esh@len$1",
  database: "admin_ezpz",
  port:3306
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL connected.");
});

// DB Setup Queries if wants to setup local db!!
/*
CREATE DATABASE auth_db;
USE auth_db;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role ENUM('customer', 'admin'),
  isVerified BOOLEAN DEFAULT FALSE,
  verificationCode VARCHAR(255)
);
*/

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "chandrabhan.b14@gmail.com",
    pass: "cjdq gvvd iswb lvxg",
  },
});

const sendVerificationEmail = (email, code) => {
  const mailOptions = {
    from: "your_email@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Your verification code is: ${code}`,
  };
  return transporter.sendMail(mailOptions);
};

app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = uuidv4();

  const sql = "INSERT INTO demo_users (firstName, lastName, email, password, role, verificationCode) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [firstName, lastName, email, hashedPassword, role, verificationCode], async (err) => {
    if (err){ console.log(err); return res.status(400).send({ error: "User already exists or input invalid." })};
    await sendVerificationEmail(email, verificationCode);
    res.send({ message: "Registration successful. Please verify your email." });
  });
});

app.post("/verify", (req, res) => {
  const { email, code } = req.body;
  const sql = "UPDATE demo_users SET isVerified = TRUE WHERE email = ? AND verificationCode = ?";
  db.query(sql, [email, code], (err, result) => {
    if (err || result.affectedRows === 0) {
      return res.status(400).send({ error: "Invalid code or email." });
    }
    res.send({ message: "Email verified successfully." });
  });
});

app.post("/admin-login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM demo_users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).send({ error: "Invalid credentials." });
    const user = results[0];

    if (user.role !== "admin") return res.status(403).send({ error: "You are not allowed to login from here" });
    if (!user.isVerified) return res.status(403).send({ error: "Please verify your email before logging in." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send({ error: "Invalid credentials." });

    const token = jwt.sign({ id: user.id, role: user.role }, "secretkey", { expiresIn: "1h" });
    res.send({ message: "Login successful", token });
  });
});

app.post("/customer-login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM demo_users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).send({ error: "Invalid credentials." });
    const user = results[0];

    if (user.role !== "customer") return res.status(403).send({ error: "You are not allowed to login from here" });
    if (!user.isVerified) return res.status(403).send({ error: "Please verify your email before logging in." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send({ error: "Invalid credentials." });

    const token = jwt.sign({ id: user.id, role: user.role }, "secretkey", { expiresIn: "1h" });
    res.send({ message: "Login successful", token });
  });
});

app.listen(3001, () => console.log("Server running on port 3001"));
